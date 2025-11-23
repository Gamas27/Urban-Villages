'use client';

import { useState } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getWalrusUrl } from '../walrus';
import { WalrusFile } from '@mysten/walrus';
import { useWalrusService } from './useWalrusService';

export interface UploadResult {
  blobId: string;
  url: string;
  metadataId: string;
}

/**
 * Walrus upload hook using Enoki wallets (via dapp-kit)
 * 
 * Since Enoki wallets integrate with @mysten/dapp-kit's WalletProvider,
 * they work seamlessly with the standard dapp-kit hooks.
 * 
 * This hook works with:
 * - Enoki wallets (Google login via embedded wallets)
 * - Regular wallet extensions (Sui Wallet, etc.)
 * 
 * Enoki benefits:
 * - No wallet extension needed (users can use Google login)
 * - Gas sponsorship (if configured via Enoki Gas Pool)
 * - Persistent wallet storage across devices
 */
export function useEnokiWalrusUpload() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  // Use shared Walrus service (initialized once, reused everywhere)
  const { walrus, isLoading: serviceLoading, error: serviceError, retry: retryService } = useWalrusService();
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload a file to Walrus using current wallet (Enoki or regular)
   * Returns: { blobId, url, metadataId }
   * 
   * Includes retry logic and timeout handling for reliability
   */
  const uploadFile = async (file: File, maxRetries = 3): Promise<UploadResult | null> => {
    if (!currentAccount) {
      setError('Please connect your wallet first');
      return null;
    }

    if (serviceLoading) {
      setError('Walrus service is initializing. Please wait...');
      return null;
    }

    if (serviceError || !walrus) {
      setError(serviceError || 'Walrus service not available. Click retry to initialize.');
      return null;
    }

    setUploading(true);
    setError(null);

    // Retry logic with exponential backoff
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`[Walrus] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const result = await performUpload(file);
        setUploading(false);
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error');
        console.warn(`[Walrus] Upload attempt ${attempt + 1} failed:`, lastError.message);
        
        // Don't retry on certain errors
        if (lastError.message.includes('wallet') || lastError.message.includes('account')) {
          break;
        }
      } finally {
        if (attempt === maxRetries - 1) {
          setUploading(false);
        }
      }
    }

    // All retries failed
    const errorMsg = lastError?.message || 'Upload failed after multiple attempts';
    setError(`Upload failed: ${errorMsg}`);
    console.error('[Walrus] All upload attempts failed');
    setUploading(false);
    return null;
  };

  /**
   * Perform the actual upload with timeout handling
   */
  const performUpload = async (file: File): Promise<UploadResult> => {
    // Timeout wrapper (30 seconds max)
    const timeoutMs = 30000;
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout - operation took too long')), timeoutMs);
    });

    const uploadPromise = async (): Promise<UploadResult> => {
      try {
        // Read file as array buffer
        const contents = await file.arrayBuffer();

        // Create upload flow - using template pattern with writeFilesFlow
        const flow = walrus.writeFilesFlow({
          files: [
            WalrusFile.from({
              contents: new Uint8Array(contents),
              identifier: file.name,
              tags: { 'content-type': file.type || 'application/octet-stream' },
            }),
          ],
        });

        // Step 1: Encode (with timeout)
        await Promise.race([
          flow.encode(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Encode timeout')), 10000))
        ]);

        // Step 2: Register (returns transaction)
        const registerTx = flow.register({
          owner: currentAccount.address,
          epochs: 10,
          deletable: true,
        });

        // Step 3: Sign and execute register transaction - using template pattern with promise wrapper
        let registerDigest: string;
        let blobObjectId: string | null = null;
        
        await Promise.race([
          new Promise<void>((resolve, reject) => {
            signAndExecute(
              { transaction: registerTx },
              {
                onSuccess: async ({ digest }) => {
                  try {
                    registerDigest = digest;
                    const result = await suiClient.waitForTransaction({
                      digest,
                      options: { showEffects: true, showEvents: true },
                    });

                    // Extract blob object ID from BlobRegistered event
                    if (result.events) {
                      const blobEvent = result.events.find((e) =>
                        e.type.includes('BlobRegistered')
                      );
                      if (blobEvent?.parsedJson) {
                        const data = blobEvent.parsedJson as any;
                        blobObjectId = data.object_id || data.objectId || null;
                      }
                    }
                    resolve();
                  } catch (err) {
                    reject(err);
                  }
                },
                onError: reject,
              }
            );
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Register transaction timeout')), 15000))
        ]);

        // Step 4: Upload data to storage nodes (with timeout)
        await Promise.race([
          flow.upload({ digest: registerDigest! }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Storage upload timeout')), 20000))
        ]);

        // Step 5: Certify (returns transaction)
        const certifyTx = flow.certify();

        // Step 6: Sign and execute certify transaction - using template pattern
        await Promise.race([
          new Promise<void>((resolve, reject) => {
            signAndExecute(
              { transaction: certifyTx },
              {
                onSuccess: async ({ digest }) => {
                  try {
                    await suiClient.waitForTransaction({ digest });
                    resolve();
                  } catch (err) {
                    reject(err);
                  }
                },
                onError: reject,
              }
            );
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Certify transaction timeout')), 15000))
        ]);

        // Step 7: Get blobId
        const files = await flow.listFiles();
        const blobId = files[0]?.blobId;

        if (!blobId) {
          throw new Error('Failed to get blobId after upload');
        }

        const metadataId = blobObjectId || blobId;

        return {
          blobId,
          url: getWalrusUrl(blobId),
          metadataId,
        };
      } catch (err) {
        throw err; // Re-throw for retry logic
      }
    };

    // Race between upload and timeout
    return await Promise.race([uploadPromise(), timeoutPromise]);
  };

  return {
    uploadFile,
    uploading: uploading || serviceLoading,
    error: error || serviceError,
    clearError: () => { 
      setError(null);
      if (serviceError) retryService();
    },
    retryService,
  };
}

