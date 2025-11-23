import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/db/supabase';

/**
 * GET /api/users/profile?walletAddress=xxx
 * Get user profile by wallet address
 */
export async function GET(req: NextRequest) {
  const supabase = getSupabaseServer();
  
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'walletAddress query parameter is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('[GET /api/users/profile] Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user profile', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[GET /api/users/profile] Unexpected error:', error);
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
 * POST /api/users/profile
 * Create or update user profile
 * 
 * Body:
 * {
 *   walletAddress: string (required)
 *   username?: string
 *   village?: string
 *   namespaceId?: string
 *   profilePicBlobId?: string
 *   onboardingCompleted?: boolean
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
    const {
      walletAddress,
      username,
      village,
      namespaceId,
      profilePicBlobId,
      onboardingCompleted,
    } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'walletAddress is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();

    const profileData: any = {
      wallet_address: walletAddress,
      updated_at: new Date().toISOString(),
    };

    if (username !== undefined) profileData.username = username;
    if (village !== undefined) profileData.village = village;
    if (namespaceId !== undefined) profileData.namespace_id = namespaceId;
    if (profilePicBlobId !== undefined) profileData.profile_pic_blob_id = profilePicBlobId;

    if (onboardingCompleted) {
      profileData.onboarding_completed_at = new Date().toISOString();
    }

    let result;
    let isNewUser = false;
    
    // Check if user exists (ignore PGRST116 = not found error)
    if (existingUser && !checkError) {
      // Update existing user
      const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', existingUser.id)
        .select()
        .single();

      if (error) {
        console.error('[POST /api/users/profile] Update error:', error);
        return NextResponse.json(
          { error: 'Failed to update user profile', details: error.message },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Create new user
      isNewUser = true;
      const { data, error } = await supabase
        .from('users')
        .insert({
          ...profileData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('[POST /api/users/profile] Insert error:', error);
        return NextResponse.json(
          { error: 'Failed to create user profile', details: error.message },
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json({
      success: true,
      data: result,
      isNewUser,
    });
  } catch (error) {
    console.error('[POST /api/users/profile] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

