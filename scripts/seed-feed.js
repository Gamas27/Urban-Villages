/**
 * Seed script to populate the feed with demo posts
 * Run with: node scripts/seed-feed.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const envVars = {};
    
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          envVars[key.trim()] = value.trim();
        }
      }
    });
    
    Object.assign(process.env, envVars);
  } catch (error) {
    console.warn('Could not load .env.local, using existing environment variables');
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

async function seedFeed() {
  console.log('🌱 Starting feed seed...\n');

  const walletAddresses = {};
  const createdPosts = [];

  for (const postData of samplePosts) {
    const username = postData.namespace.split('.')[0];
    
    // Generate a fake wallet address if we don't have one for this user
    if (!walletAddresses[postData.namespace]) {
      walletAddresses[postData.namespace] = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
    }
    
    const walletAddress = walletAddresses[postData.namespace];
    
    try {
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
          console.error(`❌ Failed to create user ${postData.namespace}:`, createError?.message);
          continue;
        }
        user = newUser;
        console.log(`✓ Created user: ${postData.namespace}`);
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
        console.error(`❌ Failed to create post for ${postData.namespace}:`, postError.message);
        continue;
      }
      
      createdPosts.push(post);
      console.log(`✓ Created post: ${postData.namespace} - "${postData.text.substring(0, 50)}..."`);
    } catch (error) {
      console.error(`❌ Error processing ${postData.namespace}:`, error);
    }
  }
  
  console.log(`\n✅ Seed complete! Created ${createdPosts.length} posts.`);
  console.log(`   Check your feed to see the demo posts!`);
}

seedFeed().catch(console.error);

