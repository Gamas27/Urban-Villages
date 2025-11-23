import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';
import { fetchPostsFromWalrus } from '@/lib/walrus/postStorage';

/**
 * GET /api/posts?village=xxx&limit=20
 * Get posts from the feed
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

    // Step 1: Query Supabase index (fast filtering by village, pagination)
    let query = supabase
      .from('posts')
      .select('id, walrus_blob_id, namespace, village, created_at, text, image_blob_id, users:user_id(wallet_address, username, profile_pic_blob_id)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by village if specified
    if (village) {
      query = query.eq('village', village);
    }

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

    // Step 2: Separate posts with Walrus blob IDs vs old posts (text in DB)
    const walrusPosts = indexData.filter((item: any) => item.walrus_blob_id);
    const legacyPosts = indexData.filter((item: any) => !item.walrus_blob_id && item.text);

    // Step 3: Fetch post content from Walrus for new posts
    let walrusPostsData: any[] = [];
    if (walrusPosts.length > 0) {
      const blobIds = walrusPosts.map((item: any) => item.walrus_blob_id);
      const fetchedPosts = await fetchPostsFromWalrus(blobIds);
      
      // Merge with index metadata
      walrusPostsData = fetchedPosts.map((walrusPost) => {
        const indexEntry = walrusPosts.find(
          (item: any) => item.walrus_blob_id === walrusPost.id
        );
        return {
          id: indexEntry?.id || walrusPost.id,
          namespace: walrusPost.namespace,
          village: walrusPost.village,
          text: walrusPost.text,
          imageBlobId: walrusPost.imageBlobId || indexEntry?.image_blob_id || null,
          imageUrl: walrusPost.imageUrl || null,
          type: walrusPost.type || 'regular',
          activityData: walrusPost.activityData || null,
          corkEarned: walrusPost.corkEarned || 0,
          likes: walrusPost.likes || 0,
          comments: walrusPost.comments || 0,
          timestamp: walrusPost.timestamp,
          author: walrusPost.author || (indexEntry?.users && indexEntry.users.length > 0 ? indexEntry.users[0].username : null) || 'user',
          profilePicBlobId: walrusPost.profilePicBlobId || (indexEntry?.users && indexEntry.users.length > 0 ? indexEntry.users[0].profile_pic_blob_id : null) || null,
          walrusBlobId: walrusPost.id,
        };
      });
    }

    // Step 4: Transform legacy posts (old posts without Walrus blob ID)
    const legacyPostsData = legacyPosts.map((post: any) => ({
      id: post.id,
      namespace: post.namespace,
      village: post.village,
      text: post.text,
      imageBlobId: post.image_blob_id || null,
      imageUrl: null,
      type: 'regular',
      activityData: null,
      corkEarned: 0,
      likes: 0,
      comments: 0,
      timestamp: post.created_at ? new Date(post.created_at).getTime() : Date.now(),
      author: post.users?.username || post.namespace?.split('.')[0] || 'user',
      profilePicBlobId: post.users?.profile_pic_blob_id || null,
    }));

    // Step 5: Combine and sort (Walrus posts first, then legacy)
    const posts = [...walrusPostsData, ...legacyPostsData]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit); // Ensure we don't exceed limit

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
 * Create a new post
 * 
 * Body:
 * {
 *   walletAddress: string (required)
 *   namespace: string (required) - e.g., "maria.lisbon"
 *   village: string (required)
 *   text: string (required)
 *   imageBlobId?: string - Walrus blob ID
 *   imageUrl?: string - Fallback URL
 *   type?: string - 'regular', 'purchase', etc.
 *   activityData?: object - Additional data for activity posts
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
      imageUrl,
      walrusBlobId, // Walrus blob ID for post content
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
      .select('id')
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
        .select('id')
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
    let corkEarned = 10; // Base amount
    if (text.length > 100) corkEarned = 20;
    else if (text.length > 50) corkEarned = 15;
    if (imageBlobId) corkEarned += 5; // Bonus for image

    // Create post index entry in Supabase
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        namespace,
        village,
        text: text.trim(), // Keep as fallback for legacy posts
        image_blob_id: imageBlobId || null,
        image_url: imageUrl || null,
        post_type: type,
        activity_data: activityData || null,
        cork_earned: corkEarned,
        likes: 0,
        comments: 0,
        walrus_blob_id: walrusBlobId || null, // New: Walrus blob ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (postError) {
      console.error('[POST /api/posts] Error:', postError);
      return NextResponse.json(
        { error: 'Failed to create post', details: postError.message },
        { status: 500 }
      );
    }

    // Log post creation as a transaction (optional)
    await fetch('/api/users/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress,
        transactionType: 'post_created',
        transactionDigest: `post_${post.id}`, // Fake digest for posts
        tokenAmount: corkEarned,
        metadata: {
          postId: post.id,
          postType: type,
          hasImage: !!imageBlobId,
        },
      }),
    }).catch((err) => {
      // Don't fail post creation if logging fails
      console.error('Failed to log post transaction:', err);
    });

    // Transform response to match Post interface
    const response = {
      id: post.id,
      namespace: post.namespace,
      village: post.village,
      text: post.text,
      imageBlobId: post.image_blob_id || null,
      imageUrl: post.image_url || null,
      type: post.post_type || 'regular',
      activityData: post.activity_data || null,
      corkEarned: post.cork_earned || 0,
      likes: post.likes || 0,
      comments: post.comments || 0,
      timestamp: new Date(post.created_at).getTime(),
    };

    return NextResponse.json({
      success: true,
      data: response,
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

