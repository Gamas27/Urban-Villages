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

    // Validate API key format (basic check)
    const apiKey = process.env.ENOKI_PRIVATE_API_KEY;
    if (!apiKey || apiKey.length < 10) {
      console.error('[POST /api/sponsor-transaction] Invalid API key format');
      return NextResponse.json(
        { 
          error: 'Invalid Enoki API key configuration',
          details: 'ENOKI_PRIVATE_API_KEY appears to be invalid or too short. Please check your Vercel environment variables.'
        },
        { status: 500 }
      );
    }

    console.log('[POST /api/sponsor-transaction] Sponsoring transaction:', {
      sender,
      network,
      transactionKindSize: transactionKindBytes.length,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 8) + '...',
    });

    // Create sponsored transaction using Enoki
    let sponsoredTx;
    try {
      sponsoredTx = await enokiClient.createSponsoredTransaction({
        network: network as 'testnet' | 'mainnet' | 'devnet',
        transactionKindBytes,
        sender,
        // Optional: Add allowed targets/addresses for security
        // allowedMoveCallTargets: [...],
        // allowedAddresses: [...],
      });
    } catch (enokiError: any) {
      // Handle Enoki-specific errors
      const enokiErrorMsg = enokiError?.message || 'Unknown Enoki error';
      const enokiErrorCode = enokiError?.code || enokiError?.statusCode || 'UNKNOWN';
      const enokiErrorDetails = enokiError?.response?.data || enokiError?.data || enokiError?.body;
      
      console.error('[POST /api/sponsor-transaction] ❌ Enoki API error:', {
        message: enokiErrorMsg,
        code: enokiErrorCode,
        details: enokiErrorDetails,
        fullError: enokiError,
      });
      
      // Provide user-friendly error messages
      let userFriendlyError = 'Failed to sponsor transaction';
      if (enokiErrorMsg.includes('401') || enokiErrorMsg.includes('Unauthorized') || enokiErrorMsg.includes('Invalid API key')) {
        userFriendlyError = 'Invalid Enoki API key. Please check your ENOKI_PRIVATE_API_KEY in Vercel environment variables.';
      } else if (enokiErrorMsg.includes('403') || enokiErrorMsg.includes('Forbidden')) {
        userFriendlyError = 'Enoki API key does not have permission to sponsor transactions. Check your Enoki project settings.';
      } else if (enokiErrorMsg.includes('429') || enokiErrorMsg.includes('rate limit')) {
        userFriendlyError = 'Rate limit exceeded. Please try again in a moment.';
      } else if (enokiErrorMsg.includes('insufficient') || enokiErrorMsg.includes('balance')) {
        userFriendlyError = 'Insufficient funds in Enoki gas pool. Please fund your gas pool in the Enoki dashboard.';
      }
      
      return NextResponse.json(
        { 
          error: userFriendlyError,
          details: enokiErrorMsg,
          code: enokiErrorCode,
          enokiDetails: enokiErrorDetails,
        },
        { status: 500 }
      );
    }

    console.log('[POST /api/sponsor-transaction] ✅ Transaction sponsored successfully');

    return NextResponse.json({
      bytes: sponsoredTx.bytes,
      digest: sponsoredTx.digest,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'Unknown';
    
    console.error('[POST /api/sponsor-transaction] ❌ Unexpected error:', {
      name: errorName,
      message: errorMsg,
      stack: errorStack,
      fullError: error,
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to sponsor transaction',
        details: errorMsg,
        type: 'unexpected_error',
      },
      { status: 500 }
    );
  }
}

