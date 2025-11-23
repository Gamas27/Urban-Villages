/**
 * Utilities for creating and executing sponsored transactions via Enoki
 * 
 * This module handles the flow:
 * 1. Build transaction on frontend
 * 2. Send to backend API to sponsor
 * 3. Sign sponsored transaction
 * 4. Execute sponsored transaction
 */

import { Transaction } from '@mysten/sui/transactions';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { toB64 } from '@mysten/sui/utils';

export interface SponsoredTransactionResult {
  digest: string;
  bytes: string;
}

/**
 * Sponsor a transaction using the backend API
 */
export async function sponsorTransaction(
  transaction: Transaction,
  sender: string,
  network: 'testnet' | 'mainnet' | 'devnet' = 'testnet'
): Promise<SponsoredTransactionResult> {
  // Build transaction to get transaction kind bytes
  const suiClient = new SuiClient({
    url: getFullnodeUrl(network),
  });

  // Try to build without balance validation
  // Note: onlyTransactionKind should skip gas budget, but may still validate coin balances
  let transactionKindBytes: Uint8Array;
  try {
    transactionKindBytes = await transaction.build({
      client: suiClient,
      onlyTransactionKind: true,
    });
  } catch (error) {
    // If build fails due to balance validation, try to serialize the transaction differently
    // This might happen if the transaction requires coins (like WAL tokens) that the user doesn't have
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    if (errorMsg.includes('Not enough coins')) {
      throw new Error(
        `Transaction requires coins (WAL tokens) that cannot be sponsored. ` +
        `Sponsored transactions only cover gas fees (SUI), not coin transfers. ` +
        `Original error: ${errorMsg}`
      );
    }
    throw error;
  }

  // Send to backend API to sponsor
  console.log('[sponsorTransaction] Requesting sponsorship:', {
    sender,
    network,
    transactionKindSize: transactionKindBytes.length,
  });

  const response = await fetch('/api/sponsor-transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transactionKindBytes: toB64(transactionKindBytes),
      sender,
      network,
    }),
  });

  if (!response.ok) {
    let errorDetails: any;
    try {
      errorDetails = await response.json();
    } catch {
      errorDetails = { error: `HTTP ${response.status}: ${response.statusText}` };
    }
    
    console.error('[sponsorTransaction] Sponsorship failed:', {
      status: response.status,
      statusText: response.statusText,
      error: errorDetails,
    });
    
    const errorMessage = errorDetails.error || errorDetails.details || `Failed to sponsor transaction: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const result = await response.json();
  console.log('[sponsorTransaction] ✅ Transaction sponsored successfully');
  return result;
}

