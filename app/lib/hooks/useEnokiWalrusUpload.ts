'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { createWalrusService, getWalrusUrl } from '../walrus';
import { useSponsoredTransaction } from './useSponsoredTransaction';

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
  const { executeSponsoredTransaction, sponsoring, error: sponsorError } = useSponsoredTransaction();
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create Walrus service (client-side only, async due to WASM)
  const [walrus, setWalrus] = useState<any>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && suiClient) {
      createWalrusService({ network: 'testnet', epochs: 10 }, suiClient)
        .then(setWalrus)
        .catch((err) => {
          console.error('Failed to initialize Walrus:', err);
          setError('Failed to initialize Walrus service');
        });
    }
  }, [suiClient]);

  /**
   * Upload a file to Walrus using current wallet (Enoki or regular)
   * Returns: { blobId, url, metadataId }
   */
  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    if (!currentAccount) {
      setError('Please connect a wallet first');
      return null;
    }

    if (!walrus) {
      setError('Walrus service not available. Please wait for initialization.');
      return null;
    }

    // Check if the method exists
    if (typeof walrus.writeFilesFlow !== 'function') {
      console.error('Walrus client methods:', Object.keys(walrus));
      setError('Walrus writeFilesFlow method not available. Client may not be initialized correctly.');
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      // Read file as array buffer
      const contents = await file.arrayBuffer();

      // Import WalrusFile dynamically
      const { WalrusFile } = await import('@mysten/walrus');

      // Create upload flow using the correct API
      const flow = walrus.writeFilesFlow({
        files: [
          WalrusFile.from({
            contents: new Uint8Array(contents),
            identifier: file.name,
            tags: { 'content-type': file.type || 'application/octet-stream' },
          }),
        ],
      });

      // Step 1: Encode (stores result internally)
      // Add retry logic for network issues
      let encodeAttempts = 0;
      const maxEncodeAttempts = 3;
      while (encodeAttempts < maxEncodeAttempts) {
        try {
          await flow.encode();
          break;
        } catch (err) {
          encodeAttempts++;
          if (encodeAttempts >= maxEncodeAttempts) {
            throw new Error(`Failed to encode after ${maxEncodeAttempts} attempts: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * encodeAttempts));
        }
      }

      // Step 2: Register (returns transaction only)
      const registerTx = flow.register({
        epochs: 10,
        deletable: true,
        owner: currentAccount.address,
      });

      // Step 3: Sign and execute register transaction (sponsored)
      let registerDigest: string;
      let blobObjectId: string | null = null;
      
      try {
        const result = await executeSponsoredTransaction(
          registerTx,
          currentAccount.address,
          'testnet'
        );
        registerDigest = result.digest;

        // Extract blob object ID from BlobRegistered event
        const txResult = await suiClient.getTransactionBlock({
          digest: registerDigest,
          options: { showEffects: true, showEvents: true },
        });

        if (txResult.events) {
          const blobEvent = txResult.events.find((e) =>
            e.type.includes('BlobRegistered')
          );
          if (blobEvent?.parsedJson) {
            const data = blobEvent.parsedJson as any;
            blobObjectId = data.object_id || data.objectId || null;
          }
        }
      } catch (err) {
        throw new Error(`Failed to register blob: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }

      // Step 4: Upload data to storage nodes
      await flow.upload({ digest: registerDigest! });

      // Step 5: Certify (returns transaction only)
      const certifyTx = flow.certify();

      // Step 6: Sign and execute certify transaction (sponsored)
      try {
        await executeSponsoredTransaction(
          certifyTx,
          currentAccount.address,
          'testnet'
        );
      } catch (err) {
        throw new Error(`Failed to certify blob: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }

      // Step 7: Get blobId from listFiles
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
    uploading: uploading || sponsoring,
    error: error || sponsorError,
    clearError: () => {
      setError(null);
      if (sponsorError) {
        // Clear sponsor error if hook provides a method
      }
    },
  };
}

