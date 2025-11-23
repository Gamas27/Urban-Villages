'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { sponsorTransaction, type SponsoredTransactionResult } from '../sponsored-transaction';

/**
 * Hook for executing sponsored transactions
 * 
 * Usage:
 * ```tsx
 * const { executeSponsoredTransaction, sponsoring } = useSponsoredTransaction();
 * 
 * const tx = new Transaction();
 * tx.moveCall({...});
 * 
 * await executeSponsoredTransaction(tx, account.address);
 * ```
 */
export function useSponsoredTransaction() {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const [sponsoring, setSponsoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeSponsoredTransaction = async (
    transaction: Transaction,
    sender: string,
    network: 'testnet' | 'mainnet' | 'devnet' = 'testnet'
  ): Promise<{ digest: string }> => {
    setSponsoring(true);
    setError(null);

    try {
      // Step 1: Sponsor the transaction via backend API
      const sponsored = await sponsorTransaction(transaction, sender, network);

      // Step 2: Sign and execute the sponsored transaction
      const result = await signAndExecute({
        transaction: sponsored.bytes,
      });

      // Step 3: Wait for transaction confirmation
      await suiClient.waitForTransaction({ digest: result.digest });

      return { digest: result.digest };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to execute sponsored transaction';
      setError(errorMsg);
      throw err;
    } finally {
      setSponsoring(false);
    }
  };

  return {
    executeSponsoredTransaction,
    sponsoring,
    error,
    clearError: () => setError(null),
  };
}

