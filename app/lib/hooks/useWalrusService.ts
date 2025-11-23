/**
 * Shared Walrus Service Hook
 * 
 * Manages Walrus service lifecycle - initialized once, reused for all uploads
 * This prevents slow/failed uploads from creating new services every time
 * 
 * Follows template pattern for reliability
 */

'use client';

import { useState, useEffect } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { createWalrusService } from '../walrus';

export interface UseWalrusServiceResult {
  walrus: any | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Shared hook for Walrus service initialization
 * Initialize once, reuse everywhere
 */
export function useWalrusService(): UseWalrusServiceResult {
  const suiClient = useSuiClient();
  const [walrus, setWalrus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const initializeService = async () => {
    if (typeof window === 'undefined') {
      setError('Walrus can only be used client-side');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = await createWalrusService(
        {
          network: (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet',
          epochs: 10,
        },
        suiClient
      );
      
      setWalrus(service);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize Walrus service';
      console.error('[useWalrusService] Initialization failed:', err);
      setError(errorMsg);
      setWalrus(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeService();
  }, [suiClient, retryCount]);

  const retry = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    walrus,
    isLoading,
    error,
    retry,
  };
}

