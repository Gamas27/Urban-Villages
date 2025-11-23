import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/db/supabase';

/**
 * POST /api/admin/populate-feed
 * Populate the feed table with fake demo posts
 * 
 * Body (optional):
 * {
 *   count?: number - Number of posts to create (default: 20)
 *   clear?: boolean - Clear existing posts first (default: false)
 * }
 */
export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const count = body.count || 20;
    const clear = body.clear || false;

    // Clear existing posts if requested
    if (clear) {
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a condition that's always true)
      
      if (deleteError) {
        console.error('[Populate Feed] Error clearing posts:', deleteError);
        // Continue anyway
      }
    }

    // Sample post data for different villages
    const samplePosts = [
      // Lisbon posts
      {
        namespace: 'maria.lisbon',
        village: 'lisbon',
        text: 'Just opened Bottle #47! This orange wine is absolutely stunning 🍊✨',
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
        type: 'regular',
        hoursAgo: 0.25,
      },
      {
        namespace: 'carlos.lisbon',
        village: 'lisbon',
        text: '🛍️ Just purchased a rare bottle from the village shop!',
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
        type: 'purchase',
        activityData: {
          bottleName: '2023 Orange Skin Contact',
          bottleImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200',
        },
        hoursAgo: 2.5,
      },
      {
        namespace: 'ana.lisbon',
        village: 'lisbon',
        text: 'Lisbon Cork Collective meetup was amazing! Great community 🎉',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        type: 'regular',
        hoursAgo: 5,
      },
      
      // Porto posts
      {
        namespace: 'joao.porto',
        village: 'porto',
        text: '🎁 Gifted a special bottle to celebrate their birthday!',
        type: 'gift-bottle',
        activityData: {
          recipient: 'maria.lisbon',
          bottleName: '2021 Vintage Port',
          bottleImage: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=200',
        },
        hoursAgo: 0.5,
      },
      {
        namespace: 'pedro.porto',
        village: 'porto',
        text: 'Visiting the Douro Valley today. The vineyards are breathtaking! 🍷',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        type: 'regular',
        hoursAgo: 1,
      },
      {
        namespace: 'rita.porto',
        village: 'porto',
        text: 'Port wine tasting session with the community. So many amazing vintages!',
        imageUrl: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=600&h=400&fit=crop',
        type: 'regular',
        hoursAgo: 6,
      },
      
      // Berlin posts
      {
        namespace: 'sophie.berlin',
        village: 'berlin',
        text: 'Berlin Cork Collective meetup tonight! Who\'s coming? 🎉',
        type: 'regular',
        hoursAgo: 2,
      },
      {
        namespace: 'max.berlin',
        village: 'berlin',
        text: 'Riesling from Mosel region is incredible. Perfect summer wine! 🍋',
        imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=600&h=400&fit=crop',
        type: 'regular',
        hoursAgo: 8,
      },
      {
        namespace: 'lisa.berlin',
        village: 'berlin',
        text: '✨ Sent some CORK tokens to support village initiatives',
        type: 'send-tokens',
        activityData: {
          recipient: 'carlos.lisbon',
          amount: 100,
        },
        hoursAgo: 12,
      },
      
      // Paris posts
      {
        namespace: 'amelie.paris',
        village: 'paris',
        text: 'Celebrating Bottle #100 with champagne! 🥂 Thank you Cork Collective!',
        imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop',
        type: 'regular',
        hoursAgo: 3,
      },
      {
        namespace: 'pierre.paris',
        village: 'paris',
        text: 'Champagne tasting in Reims. The terroir here is unmatched!',
        imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=600&h=400&fit=crop',
        type: 'regular',
        hoursAgo: 10,
      },
      {
        namespace: 'sophie.paris',
        village: 'paris',
        text: '✨ Sent some CORK tokens to support village initiatives',
        type: 'send-tokens',
        activityData: {
          recipient: 'maria.lisbon',
          amount: 150,
        },
        hoursAgo: 1.5,
      },
      
      // Barcelona posts
      {
        namespace: 'carlos.barcelona',
        village: 'barcelona',
        text: 'Just minted my first NFT bottle! The provenance feature is incredible 🔥',
        type: 'regular',
        hoursAgo: 4,
      },
      {
        namespace: 'maria.barcelona',
        village: 'barcelona',
        text: 'Cava tasting in Penedès. Traditional method is beautiful!',
        imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&h=400&fit=crop',
        type: 'regular',
        hoursAgo: 7,
      },
      
      // Rome posts
      {
        namespace: 'giovanni.rome',
        village: 'rome',
        text: 'Chianti Classico pairs perfectly with pasta! What\'s your favorite pairing? 🍝',
        imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop',
        type: 'regular',
        hoursAgo: 5,
      },
      {
        namespace: 'francesca.rome',
        village: 'rome',
        text: 'Tuscany wine tour was magical! The rolling hills and vineyards...',
        imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&h=400&fit=crop',
        type: 'regular',
        hoursAgo: 9,
      },
      {
        namespace: 'marco.rome',
        village: 'rome',
        text: '🛍️ Just purchased a Chianti Classico from the village shop!',
        type: 'purchase',
        activityData: {
          bottleName: 'Chianti Classico 2021',
          bottleImage: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=200',
        },
        hoursAgo: 11,
      },
    ];

    // Generate fake wallet addresses for users (or reuse existing ones)
    const walletAddresses: Record<string, string> = {};
    
    // Get or create users for each namespace
    const createdPosts = [];
    const postsToCreate = samplePosts.slice(0, Math.min(count, samplePosts.length));
    
    for (const postData of postsToCreate) {
      const username = postData.namespace.split('.')[0];
      
      // Generate a fake wallet address if we don't have one for this user
      if (!walletAddresses[postData.namespace]) {
        walletAddresses[postData.namespace] = `0x${Array.from({ length: 64 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`;
      }
      
      const walletAddress = walletAddresses[postData.namespace];
      
      // Get or create user
      let { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single();
      
      if (userError || !user) {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            wallet_address: walletAddress,
            username: username,
            village: postData.village,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select('id')
          .single();
        
        if (createError || !newUser) {
          console.error(`[Populate Feed] Failed to create user ${postData.namespace}:`, createError);
          continue;
        }
        user = newUser;
      }
      
      // Calculate CORK earned
      let corkEarned = 10;
      if (postData.text.length > 100) corkEarned = 20;
      else if (postData.text.length > 50) corkEarned = 15;
      if (postData.imageUrl) corkEarned += 5;
      
      // Create post
      const timestamp = new Date(Date.now() - postData.hoursAgo * 60 * 60 * 1000);
      
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          namespace: postData.namespace,
          village: postData.village,
          text: postData.text,
          image_blob_id: null, // No Walrus blob ID for demo
          image_url: postData.imageUrl || null,
          post_type: postData.type || 'regular',
          activity_data: postData.activityData || null,
          cork_earned: corkEarned,
          likes: Math.floor(Math.random() * 50) + 5,
          comments: Math.floor(Math.random() * 20) + 1,
          created_at: timestamp.toISOString(),
          updated_at: timestamp.toISOString(),
        })
        .select()
        .single();
      
      if (postError) {
        console.error(`[Populate Feed] Failed to create post for ${postData.namespace}:`, postError);
        continue;
      }
      
      createdPosts.push(post);
    }
    
    return NextResponse.json({
      success: true,
      message: `Created ${createdPosts.length} demo posts`,
      count: createdPosts.length,
      posts: createdPosts.map(p => ({
        id: p.id,
        namespace: p.namespace,
        village: p.village,
        text: p.text,
      })),
    });
  } catch (error) {
    console.error('[POST /api/admin/populate-feed] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

