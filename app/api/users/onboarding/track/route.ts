import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/db/supabase';

/**
 * POST /api/users/onboarding/track
 * Track onboarding events for analytics
 * 
 * Body:
 * {
 *   walletAddress: string (required)
 *   eventType: string (required) - 'wallet_connected', 'village_selected', 'namespace_claimed', 'profile_pic_uploaded', 'completed'
 *   metadata?: object - Additional event data
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
    const body = await req.json();
    const { walletAddress, eventType, metadata } = body;

    if (!walletAddress || !eventType) {
      return NextResponse.json(
        { error: 'walletAddress and eventType are required' },
        { status: 400 }
      );
    }

    // Get or create user
    let userId: string;
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();

    if (user) {
      userId = user.id;
    } else {
      // Create user if doesn't exist
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          wallet_address: walletAddress,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (createError || !newUser) {
        console.error('[POST /api/users/onboarding/track] User creation error:', createError);
        return NextResponse.json(
          { error: 'Failed to create user', details: createError?.message },
          { status: 500 }
        );
      }

      userId = newUser.id;
    }

    // Track the event
    const { data, error } = await supabase
      .from('onboarding_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        metadata: metadata || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[POST /api/users/onboarding/track] Error:', error);
      return NextResponse.json(
        { error: 'Failed to track event', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[POST /api/users/onboarding/track] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

