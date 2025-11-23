'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { createWalrusService, getWalrusUrl } from '../walrus';
import { WalrusFile } from '@mysten/walrus';

export interface UploadResult {
  blobId: string;
  url: string;
  metadataId: string;
}

export function useWalrusUpload() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create Walrus service (client-side only, async due to WASM)
  const [walrus, setWalrus] = useState<any>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      createWalrusService({ network: 'testnet', epochs: 10 })
        .then(setWalrus)
        .catch((err) => {
          console.error('Failed to initialize Walrus:', err);
          setError('Failed to initialize Walrus service');
        });
    }
  }, []);

  /**
   * Upload a file to Walrus
   * Returns: { blobId, url, metadataId }
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
      // Read file as array buffer
      const contents = await file.arrayBuffer();

      // Create upload flow using writeFilesFlow
      const flow = walrus.writeFilesFlow({
        files: [
          WalrusFile.from({
            contents: new Uint8Array(contents),
            identifier: file.name,
            tags: { 'content-type': file.type || 'application/octet-stream' },
          }),
        ],
      });

      // Step 1: Encode
      await flow.encode();

      // Step 2: Register (returns transaction)
      const registerTx = flow.register({
        owner: currentAccount.address,
        epochs: 10,
        deletable: true,
      });

      // Step 3: Sign and execute register transaction
      let registerDigest: string;
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
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            onError: reject,
          }
        );
      });

      // Step 4: Upload data to storage nodes (optimized with timeout)
      // This is often the slowest step, so we add a longer timeout and better error handling
      const uploadPromise = flow.upload({ digest: registerDigest! });
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Storage upload timeout - file may be too large or network is slow')), 60000);
      });
      
      await Promise.race([uploadPromise, timeoutPromise]);

      // Step 5: Certify (returns transaction)
      const certifyTx = flow.certify();

      // Step 6: Sign and execute certify transaction
      await new Promise<void>((resolve, reject) => {
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
      });

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
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Upload failed: ${errorMsg}`);
      console.error('Walrus upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    error,
    clearError: () => setError(null),
  };
}
