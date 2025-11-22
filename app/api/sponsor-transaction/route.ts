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
      return NextResponse.json(
        { error: 'Enoki private API key not configured. Add ENOKI_PRIVATE_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { transactionKindBytes, sender, network = 'testnet' } = body;

    if (!transactionKindBytes || !sender) {
      return NextResponse.json(
        { error: 'Missing required fields: transactionKindBytes and sender are required' },
        { status: 400 }
      );
    }

    // Create sponsored transaction using Enoki
    const sponsoredTx = await enokiClient.createSponsoredTransaction({
      network: network as 'testnet' | 'mainnet' | 'devnet',
      transactionKindBytes,
      sender,
      // Optional: Add allowed targets/addresses for security
      // allowedMoveCallTargets: [...],
      // allowedAddresses: [...],
    });

    return NextResponse.json({
      bytes: sponsoredTx.bytes,
      digest: sponsoredTx.digest,
    });
  } catch (error) {
    console.error('Error sponsoring transaction:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sponsor transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

