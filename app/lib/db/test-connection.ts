/**
 * Test Supabase Connection
 * 
 * Run this to verify your Supabase setup is working
 * Usage: node -r ts-node/register app/lib/db/test-connection.ts
 * Or import and call from an API route
 */

import { supabase, isSupabaseConfigured } from './supabase';

export async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  // Check if configured
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase not configured!');
    console.error('   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
    return false;
  }

  if (!supabase) {
    console.error('❌ Supabase client not initialized!');
    return false;
  }

  console.log('✅ Environment variables configured');
  console.log(`   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  console.log(`   Anon Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...\n`);

  // Test connection by querying a table
  try {
    console.log('🔌 Testing database connection...');
    
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (error) {
      // If table doesn't exist, that's okay - migration might not be run yet
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        console.warn('⚠️  Users table not found');
        console.warn('   Run the migration in Supabase SQL Editor:');
        console.warn('   app/lib/db/migrations/001_initial_schema.sql\n');
        return false;
      }
      
      console.error('❌ Connection error:', error.message);
      return false;
    }

    console.log('✅ Database connection successful!');
    console.log(`   Users table exists`);
    console.log(`   Current user count: ${data || 0}\n`);
    return true;
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// If run directly
if (require.main === module) {
  testConnection()
    .then((success) => {
      if (success) {
        console.log('🎉 All tests passed! Your Supabase setup is working.');
      } else {
        console.error('❌ Connection test failed. Check your configuration.');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

