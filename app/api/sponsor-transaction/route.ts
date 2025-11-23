import { NextRequest, NextResponse } from 'next/server';
import { EnokiClient } from '@mysten/enoki';
import { toB64 } from '@mysten/sui/utils';

/**
 * API Route for Enoki Sponsored Transactions
 * 
 * This route uses the Enoki Private API Key to sponsor transactions.
 * The private key should NEVER be exposed to the frontend.
 * 
 * Environment Variables Required:
 * - ENOKI_PRIVATE_API_KEY: Your Enoki private API key (backend only!)
 * - NEXT_PUBLIC_SUI_NETWORK: Network (testnet, mainnet, devnet)
 */

const enokiClient = new EnokiClient({
  apiKey: process.env.ENOKI_PRIVATE_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    // Check if private API key is configured
    if (!process.env.ENOKI_PRIVATE_API_KEY) {
      console.error('[POST /api/sponsor-transaction] Enoki private API key not configured');
      return NextResponse.json(
        { 
          error: 'Enoki private API key not configured',
          details: 'Add ENOKI_PRIVATE_API_KEY to your environment variables in Vercel project settings'
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { transactionKindBytes, sender, network = 'testnet' } = body;

    if (!transactionKindBytes || !sender) {
      console.error('[POST /api/sponsor-transaction] Missing required fields:', {
        hasTransactionKindBytes: !!transactionKindBytes,
        hasSender: !!sender,
      });
      return NextResponse.json(
        { error: 'Missing required fields: transactionKindBytes and sender are required' },
        { status: 400 }
      );
    }

    console.log('[POST /api/sponsor-transaction] Sponsoring transaction:', {
      sender,
      network,
      transactionKindSize: transactionKindBytes.length,
      hasApiKey: !!process.env.ENOKI_PRIVATE_API_KEY,
    });

    // Create sponsored transaction using Enoki
    const sponsoredTx = await enokiClient.createSponsoredTransaction({
      network: network as 'testnet' | 'mainnet' | 'devnet',
      transactionKindBytes,
      sender,
      // Optional: Add allowed targets/addresses for security
      // allowedMoveCallTargets: [...],
      // allowedAddresses: [...],
    });

    console.log('[POST /api/sponsor-transaction] ✅ Transaction sponsored successfully');

    return NextResponse.json({
      bytes: sponsoredTx.bytes,
      digest: sponsoredTx.digest,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('[POST /api/sponsor-transaction] ❌ Failed to sponsor transaction:', {
      error: errorMsg,
      stack: errorStack,
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to sponsor transaction',
        details: errorMsg
      },
      { status: 500 }
    );
  }
}

