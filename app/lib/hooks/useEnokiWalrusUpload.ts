'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getWalrusUrl, verifyWalrusBlob } from '../walrus';
import { getWalrusClient } from '../walrus/client';
import { WalrusFile } from '@mysten/walrus';

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
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use singleton Walrus client (shared across all hooks/components)
  const [walrus, setWalrus] = useState<any>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      getWalrusClient({ network: 'testnet', epochs: 10 })
        .then(setWalrus)
        .catch((err) => {
          console.error('Failed to initialize Walrus:', err);
          setError('Failed to initialize Walrus service');
        });
    }
  }, []);

  /**
   * Upload a file to Walrus using current wallet (Enoki or regular)
   * Returns: { blobId, url, metadataId }
   * 
   * Optimized for speed and reliability - template pattern with step 4 retry logic
   */
  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    if (!currentAccount) {
      setError('Please connect your wallet first');
      return null;
    }

    if (!walrus) {
      setError('Walrus service not available');
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('[Walrus] Starting upload for file:', file.name, file.size, 'bytes');
      
      // Read file as array buffer
      const contents = await file.arrayBuffer();
      console.log('[Walrus] File read, size:', contents.byteLength);

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
      console.log('[Walrus] Flow created');

      // Step 1: Encode
      console.log('[Walrus] Step 1: Encoding...');
      await flow.encode();
      console.log('[Walrus] Step 1: Encode complete');

      // Step 2: Register (returns transaction)
      console.log('[Walrus] Step 2: Registering with owner:', currentAccount.address);
      const registerTx = flow.register({
        owner: currentAccount.address,
        epochs: 10,
        deletable: true,
      });
      console.log('[Walrus] Step 2: Register transaction created');

      // Step 3: Sign and execute register transaction - using template pattern with promise wrapper
      console.log('[Walrus] Step 3: Signing and executing register transaction...');
      let registerDigest!: string; // Definite assignment assertion - guaranteed to be assigned before use
      let blobObjectId: string | null = null;
      
      await new Promise<void>((resolve, reject) => {
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
                console.log('[Walrus] Step 3: Register transaction confirmed, digest:', digest);
                resolve();
              } catch (err) {
                console.error('[Walrus] Step 3: Error waiting for register transaction:', err);
                reject(err);
              }
            },
            onError: (err) => {
              console.error('[Walrus] Step 3: Register transaction failed:', err);
              reject(err);
            },
          }
        );
      });

      // Step 4: Upload data to storage nodes (OPTIMIZED - retry logic for reliability)
      // This is the bottleneck - we retry up to 3 times with exponential backoff
      // registerDigest is guaranteed to be assigned here since Promise only resolves after onSuccess
      console.log('[Walrus] Step 4: Uploading to storage nodes, digest:', registerDigest!);
      
      let uploadSuccess = false;
      let lastError: Error | null = null;
      const maxRetries = 3;
      
      for (let attempt = 0; attempt < maxRetries && !uploadSuccess; attempt++) {
        try {
          if (attempt > 0) {
            // Exponential backoff: 2s, 4s
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`[Walrus] Step 4: Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          // Upload with timeout (dynamic based on file size: 30s base + 1s per MB)
          const fileSizeMB = file.size / (1024 * 1024);
          const timeoutMs = Math.min(30000 + (fileSizeMB * 1000), 120000); // Max 2 minutes
          
          const uploadPromise = flow.upload({ digest: registerDigest! });
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error(`Upload timeout after ${timeoutMs}ms`)), timeoutMs);
          });
          
          await Promise.race([uploadPromise, timeoutPromise]);
          uploadSuccess = true;
          console.log('[Walrus] Step 4: Upload complete');
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Upload failed');
          console.warn(`[Walrus] Step 4: Attempt ${attempt + 1} failed:`, lastError.message);
          
          // Don't retry on certain errors (network errors are retryable, validation errors are not)
          if (lastError.message.includes('timeout') || lastError.message.includes('network') || lastError.message.includes('ECONNREFUSED')) {
            // Retryable - continue loop
            continue;
          } else {
            // Non-retryable error - break immediately
            break;
          }
        }
      }
      
      if (!uploadSuccess) {
        throw lastError || new Error('Upload failed after retries');
      }

      // Step 5: Certify (returns transaction)
      console.log('[Walrus] Step 5: Creating certify transaction...');
      const certifyTx = flow.certify();

      // Step 6: Sign and execute certify transaction - using template pattern
      console.log('[Walrus] Step 6: Signing and executing certify transaction...');
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: certifyTx },
          {
            onSuccess: async ({ digest }) => {
              try {
                await suiClient.waitForTransaction({ digest });
                console.log('[Walrus] Step 6: Certify transaction confirmed, digest:', digest);
                resolve();
              } catch (err) {
                console.error('[Walrus] Step 6: Error waiting for certify transaction:', err);
                reject(err);
              }
            },
            onError: (err) => {
              console.error('[Walrus] Step 6: Certify transaction failed:', err);
              reject(err);
            },
          }
        );
      });

      // Step 7: Get blobId
      console.log('[Walrus] Step 7: Getting blobId...');
      const files = await flow.listFiles();
      const blobId = files[0]?.blobId;
      console.log('[Walrus] Step 7: blobId:', blobId);

      if (!blobId) {
        throw new Error('Failed to get blobId after upload');
      }

      // Step 8: Verify blob exists in Walrus before returning
      console.log('[Walrus] Step 8: Verifying blob exists in Walrus...');
      const blobExists = await verifyWalrusBlob(blobId, 'testnet');
      
      if (!blobExists) {
        console.error('[Walrus] ⚠️ Blob verification failed - blob may not be accessible yet');
        // Wait a bit and retry verification (blob might need time to propagate)
        await new Promise(resolve => setTimeout(resolve, 2000));
        const retryExists = await verifyWalrusBlob(blobId, 'testnet');
        
        if (!retryExists) {
          throw new Error(`Blob ${blobId} is not accessible in Walrus. Upload may have failed.`);
        }
        console.log('[Walrus] ✅ Blob verified after retry');
      } else {
        console.log('[Walrus] ✅ Blob verified successfully');
      }

      const metadataId = blobObjectId || blobId;
      console.log('[Walrus] Upload successful! blobId:', blobId, 'metadataId:', metadataId, 'verified:', blobExists);

      return {
        blobId,
        url: getWalrusUrl(blobId),
        metadataId,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Upload failed: ${errorMsg}`);
      console.error('[Walrus] Upload error details:', {
        error: err,
        message: errorMsg,
        stack: err instanceof Error ? err.stack : undefined,
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    error,
    clearError: () => { setError(null); },
  };
}

