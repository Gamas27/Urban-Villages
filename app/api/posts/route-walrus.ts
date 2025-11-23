import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import { fetchPostsFromWalrus } from '@/lib/walrus/postStorage';

/**
 * GET /api/posts?village=xxx&limit=20
 * Get posts from the feed (Hybrid: Index from Supabase, Content from Walrus)
 * 
 * Query params:
 * - village?: string - Filter by village
 * - limit?: number - Number of posts to return (default: 50)
 * - offset?: number - Pagination offset
 */
export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const village = searchParams.get('village');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Step 1: Query Supabase index (fast filtering)
    let query = supabase
      .from('posts')
      .select('id, walrus_blob_id, namespace, village, created_at, users:user_id(wallet_address, username, profile_pic_blob_id)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by village if specified
    if (village) {
      query = query.eq('village', village);
    }

    // Filter to only posts with Walrus blob IDs (new posts)
    query = query.not('walrus_blob_id', 'is', null);

    const { data: indexData, error: indexError } = await query;

    if (indexError) {
      console.error('[GET /api/posts] Index query error:', indexError);
      return NextResponse.json(
        { error: 'Failed to fetch posts index', details: indexError.message },
        { status: 500 }
      );
    }

    if (!indexData || indexData.length === 0) {
      return NextResponse.json({
        data: [],
        count: 0,
        hasMore: false,
      });
    }

    // Step 2: Extract blob IDs
    const blobIds = indexData
      .map((item: any) => item.walrus_blob_id)
      .filter((blobId: string | null) => blobId !== null);

    if (blobIds.length === 0) {
      return NextResponse.json({
        data: [],
        count: 0,
        hasMore: false,
      });
    }

    // Step 3: Fetch post content from Walrus (in parallel)
    const walrusPosts = await fetchPostsFromWalrus(blobIds);

    // Step 4: Merge index metadata with Walrus content
    const posts = walrusPosts.map((walrusPost) => {
      // Find corresponding index entry
      const indexEntry = indexData.find(
        (item: any) => item.walrus_blob_id === walrusPost.id
      );

      return {
        id: indexEntry?.id || walrusPost.id,
        namespace: walrusPost.namespace,
        village: walrusPost.village,
        text: walrusPost.text,
        imageBlobId: walrusPost.imageBlobId || null,
        imageUrl: walrusPost.imageUrl || null,
        type: walrusPost.type || 'regular',
        activityData: walrusPost.activityData || null,
        corkEarned: walrusPost.corkEarned || 0,
        likes: walrusPost.likes || 0,
        comments: walrusPost.comments || 0,
        timestamp: walrusPost.timestamp,
        author: walrusPost.author || (indexEntry?.users && indexEntry.users.length > 0 ? indexEntry.users[0].username : null) || 'user',
        profilePicBlobId: walrusPost.profilePicBlobId || (indexEntry?.users && indexEntry.users.length > 0 ? indexEntry.users[0].profile_pic_blob_id : null) || null,
        walrusBlobId: walrusPost.id, // Store blob ID for reference
      };
    });

    return NextResponse.json({
      data: posts,
      count: posts.length,
      hasMore: posts.length === limit,
    });
  } catch (error) {
    console.error('[GET /api/posts] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * Create a new post (Uploads to Walrus, indexes in Supabase)
 * 
 * Body:
 * {
 *   walletAddress: string (required)
 *   namespace: string (required)
 *   village: string (required)
 *   text: string (required)
 *   imageBlobId?: string - Walrus blob ID for image
 *   walrusBlobId?: string - If post already uploaded to Walrus
 *   type?: string
 *   activityData?: object
 * }
 */
export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const {
      walletAddress,
      namespace,
      village,
      text,
      imageBlobId,
      walrusBlobId, // If already uploaded to Walrus
      type = 'regular',
      activityData,
    } = body;

    if (!walletAddress || !namespace || !village || !text) {
      return NextResponse.json(
        { error: 'Missing required fields: walletAddress, namespace, village, and text are required' },
        { status: 400 }
      );
    }

    // Get user ID
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, profile_pic_blob_id')
      .eq('wallet_address', walletAddress)
      .single();

    if (userError || !user) {
      // Create user if doesn't exist
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          wallet_address: walletAddress,
          username: namespace.split('.')[0],
          village: village,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id, username, profile_pic_blob_id')
        .single();

      if (createError || !newUser) {
        return NextResponse.json(
          { error: 'Failed to create user', details: createError?.message },
          { status: 500 }
        );
      }

      user = newUser;
    }

    // Calculate CORK earned
    let corkEarned = 10;
    if (text.length > 100) corkEarned = 20;
    else if (text.length > 50) corkEarned = 15;
    if (imageBlobId) corkEarned += 5;

    let finalWalrusBlobId = walrusBlobId;

    // If not already uploaded, note that client should upload first
    // For now, we'll store in Supabase and note that it needs to be uploaded
    // In production, client uploads to Walrus first, then sends blobId

    // Create index entry in Supabase
    const { data: postIndex, error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        namespace,
        village,
        text: text.trim(), // Keep as fallback/fallback for old posts
        image_blob_id: imageBlobId || null,
        image_url: null,
        post_type: type,
        activity_data: activityData || null,
        cork_earned: corkEarned,
        likes: 0,
        comments: 0,
        walrus_blob_id: finalWalrusBlobId || null, // Will be set when uploaded
        content_hash: null, // TODO: Add hash for deduplication
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (postError) {
      console.error('[POST /api/posts] Error:', postError);
      return NextResponse.json(
        { error: 'Failed to create post index', details: postError.message },
        { status: 500 }
      );
    }

    // Log post creation as transaction (optional)
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/users/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress,
        transactionType: 'post_created',
        transactionDigest: `post_${postIndex.id}`,
        tokenAmount: corkEarned,
        metadata: {
          postId: postIndex.id,
          walrusBlobId: finalWalrusBlobId,
          postType: type,
          hasImage: !!imageBlobId,
        },
      }),
    }).catch((err) => {
      console.error('Failed to log post transaction:', err);
    });

    return NextResponse.json({
      success: true,
      data: {
        id: postIndex.id,
        namespace: postIndex.namespace,
        village: postIndex.village,
        text: postIndex.text,
        imageBlobId: postIndex.image_blob_id || null,
        type: postIndex.post_type || 'regular',
        corkEarned: postIndex.cork_earned || 0,
        likes: postIndex.likes || 0,
        comments: postIndex.comments || 0,
        timestamp: new Date(postIndex.created_at).getTime(),
        walrusBlobId: postIndex.walrus_blob_id || null,
        needsWalrusUpload: !finalWalrusBlobId, // Flag if needs upload
      },
    });
  } catch (error) {
    console.error('[POST /api/posts] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

