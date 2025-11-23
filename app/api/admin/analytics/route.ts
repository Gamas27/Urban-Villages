import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

/**
 * GET /api/admin/analytics
 * Get hackathon analytics (total users, completion rates, etc.)
 * 
 * Query params:
 * - period?: 'hour' | 'day' | 'all' (default: 'all')
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
    const period = searchParams.get('period') || 'all';

    // Calculate time filter
    let timeFilter = '';
    if (period === 'hour') {
      timeFilter = `AND created_at >= NOW() - INTERVAL '1 hour'`;
    } else if (period === 'day') {
      timeFilter = `AND created_at >= NOW() - INTERVAL '24 hours'`;
    }

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get completed onboarding count
    const { count: completedOnboarding } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .not('onboarding_completed_at', 'is', null);

    // Get total transactions
    const { count: totalTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    // Get total NFTs minted
    const { count: totalNFTs } = await supabase
      .from('nft_ownership')
      .select('*', { count: 'exact', head: true });

    // Get village distribution
    const { data: villageDistribution } = await supabase
      .from('users')
      .select('village')
      .not('village', 'is', null);

    const villageCounts: Record<string, number> = {};
    villageDistribution?.forEach((user) => {
      const village = user.village || 'unknown';
      villageCounts[village] = (villageCounts[village] || 0) + 1;
    });

    // Get onboarding events by type
    const { data: eventTypes } = await supabase
      .from('onboarding_events')
      .select('event_type');

    const eventCounts: Record<string, number> = {};
    eventTypes?.forEach((event) => {
      eventCounts[event.event_type] = (eventCounts[event.event_type] || 0) + 1;
    });

    // Get transactions by type
    const { data: transactionTypes } = await supabase
      .from('transactions')
      .select('transaction_type');

    const transactionTypeCounts: Record<string, number> = {};
    transactionTypes?.forEach((tx) => {
      transactionTypeCounts[tx.transaction_type] =
        (transactionTypeCounts[tx.transaction_type] || 0) + 1;
    });

    // Calculate completion rate
    const completionRate =
      totalUsers && totalUsers > 0
        ? ((completedOnboarding || 0) / totalUsers) * 100
        : 0;

    // Get recent users (last 10)
    const { data: recentUsers } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent transactions (last 10)
    const { data: recentTransactions } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      period,
      totals: {
        users: totalUsers || 0,
        completedOnboarding: completedOnboarding || 0,
        transactions: totalTransactions || 0,
        nfts: totalNFTs || 0,
        completionRate: Math.round(completionRate * 100) / 100,
      },
      distribution: {
        villages: villageCounts,
        onboardingEvents: eventCounts,
        transactionTypes: transactionTypeCounts,
      },
      recent: {
        users: recentUsers || [],
        transactions: recentTransactions || [],
      },
    });
  } catch (error) {
    console.error('[GET /api/admin/analytics] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

