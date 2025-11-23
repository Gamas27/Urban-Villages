import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/db/supabase';

/**
 * POST /api/users/transactions
 * Log blockchain transactions for analytics
 * 
 * Body:
 * {
 *   walletAddress: string (required)
 *   transactionType: string (required) - 'purchase', 'mint_nft', 'mint_token', 'namespace_claim'
 *   transactionDigest: string (required) - SUI transaction digest
 *   nftId?: string - Created NFT ID
 *   tokenAmount?: number - CORK tokens minted/burned
 *   metadata?: object - Additional transaction data
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
      transactionType,
      transactionDigest,
      nftId,
      tokenAmount,
      metadata,
    } = body;

    if (!walletAddress || !transactionType || !transactionDigest) {
      return NextResponse.json(
        { error: 'walletAddress, transactionType, and transactionDigest are required' },
        { status: 400 }
      );
    }

    // Get user ID
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Complete onboarding first.' },
        { status: 404 }
      );
    }

    // Log the transaction
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: transactionType,
        transaction_digest: transactionDigest,
        nft_id: nftId || null,
        token_amount: tokenAmount ? BigInt(tokenAmount).toString() : null,
        metadata: metadata || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[POST /api/users/transactions] Error:', error);
      return NextResponse.json(
        { error: 'Failed to log transaction', details: error.message },
        { status: 500 }
      );
    }

    // If NFT was minted, also update nft_ownership table
    if (nftId && transactionType === 'purchase' || transactionType === 'mint_nft') {
      const nftMetadata = metadata || {};
      await supabase
        .from('nft_ownership')
        .insert({
          user_id: user.id,
          nft_id: nftId,
          bottle_number: nftMetadata.bottleNumber || null,
          wine_name: nftMetadata.wineName || null,
          village: nftMetadata.village || null,
          minted_at: new Date().toISOString(),
          transaction_digest: transactionDigest,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[POST /api/users/transactions] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

