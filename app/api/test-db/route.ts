import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/db/supabase';

/**
 * GET /api/test-db
 * Test endpoint to verify Supabase connection
 * Useful for debugging setup issues
 */
export async function GET() {
  const results: any = {
    configured: false,
    connected: false,
    tablesExist: false,
    errors: [],
  };

  // Check if configured
  if (!isSupabaseConfigured()) {
    results.errors.push('Environment variables not set');
    return NextResponse.json(results, { status: 503 });
  }

  results.configured = true;
  results.env = {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
  };

  if (!supabase) {
    results.errors.push('Supabase client not initialized');
    return NextResponse.json(results, { status: 503 });
  }

  // Test connection by querying users table
  try {
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        results.errors.push('Users table does not exist - run migration first');
        results.migrationNeeded = true;
      } else {
        results.errors.push(`Database error: ${error.message}`);
      }
      return NextResponse.json(results, { status: 500 });
    }

    results.connected = true;
    results.tablesExist = true;
    results.userCount = count || 0;
  } catch (error) {
    results.errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return NextResponse.json(results, { status: 500 });
  }

  // Test other tables
  const tables = ['onboarding_events', 'transactions', 'nft_ownership'];
  results.tables = {};

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      results.tables[table] = !error;
      if (error) {
        results.tables[table + '_error'] = error.message;
      }
    } catch (error) {
      results.tables[table] = false;
      results.tables[table + '_error'] = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  return NextResponse.json(results);
}

