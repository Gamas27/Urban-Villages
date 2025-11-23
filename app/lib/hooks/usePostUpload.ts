/**
 * Hook to upload post content to Walrus
 * 
 * Creates post as JSON and uploads to Walrus decentralized storage
 * Returns blob ID to store in Supabase index
 */

'use client';

import { useState } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getWalrusUrl } from '../walrus';
import { WalrusFile } from '@mysten/walrus';
import { useWalrusService } from './useWalrusService';

export interface PostContent {
  namespace: string;
  village: string;
  text: string;
  imageBlobId?: string;
  imageUrl?: string;
  type?: string;
  activityData?: any;
  corkEarned: number;
  likes: number;
  comments: number;
  author?: string;
  profilePicBlobId?: string;
}

export interface PostUploadResult {
  blobId: string;
  url: string;
}

/**
 * Hook to upload post content to Walrus
 * 
 * Uses shared Walrus service with retry logic and timeout handling
 */
export function usePostUpload() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  // Use shared Walrus service (initialized once, reused everywhere)
  const { walrus, isLoading: serviceLoading, error: serviceError, retry: retryService } = useWalrusService();
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload post content to Walrus
   * Includes retry logic and timeout handling for reliability
   */
  const uploadPost = async (postContent: PostContent, maxRetries = 3): Promise<PostUploadResult | null> => {
    if (!account) {
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
          console.log(`[Walrus Post] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const result = await performPostUpload(postContent);
        setUploading(false);
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error');
        console.warn(`[Walrus Post] Upload attempt ${attempt + 1} failed:`, lastError.message);
        
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
    setError(`Post upload failed: ${errorMsg}`);
    console.error('[Walrus Post] All upload attempts failed');
    setUploading(false);
    return null;
  };

  /**
   * Perform the actual post upload with timeout handling
   */
  const performPostUpload = async (postContent: PostContent): Promise<PostUploadResult> => {
    // Timeout wrapper (30 seconds max)
    const timeoutMs = 30000;
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout - operation took too long')), timeoutMs);
    });

    const uploadPromise = async (): Promise<PostUploadResult> => {
      try {
        // Create post content as JSON
        const postData = {
          namespace: postContent.namespace,
          village: postContent.village,
          text: postContent.text,
          imageBlobId: postContent.imageBlobId || null,
          imageUrl: postContent.imageUrl || null,
          type: postContent.type || 'regular',
          activityData: postContent.activityData || null,
          corkEarned: postContent.corkEarned || 0,
          likes: postContent.likes || 0,
          comments: postContent.comments || 0,
          author: postContent.author || postContent.namespace?.split('.')[0] || 'user',
          profilePicBlobId: postContent.profilePicBlobId || null,
          createdAt: new Date().toISOString(),
        };

        // Convert to JSON string
        const jsonString = JSON.stringify(postData);
        const jsonBlob = new Blob([jsonString], { type: 'application/json' });
        const file = new File([jsonBlob], `post-${Date.now()}.json`, {
          type: 'application/json',
        });

        // Read file as array buffer
        const contents = await file.arrayBuffer();

        // Create upload flow using shared service (template pattern)
        const flow = walrus.writeFilesFlow({
          files: [
            WalrusFile.from({
              contents: new Uint8Array(contents),
              identifier: file.name,
              tags: { 'content-type': 'application/json' },
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
          owner: account.address,
          epochs: 10,
          deletable: true,
        });

        // Step 3: Sign and execute register transaction (with timeout)
        let registerDigest: string;
        
        await Promise.race([
          new Promise<void>((resolve, reject) => {
            signAndExecute(
              { transaction: registerTx as any },
              {
                onSuccess: async ({ digest }) => {
                  try {
                    registerDigest = digest;
                    await suiClient.waitForTransaction({
                      digest,
                      options: { showEffects: true, showEvents: true },
                    });
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

        // Step 6: Sign and execute certify transaction (with timeout)
        await Promise.race([
          new Promise<void>((resolve, reject) => {
            signAndExecute(
              { transaction: certifyTx as any },
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

        const url = getWalrusUrl(blobId);

        return {
          blobId,
          url,
        };
      };

      // Race between upload and timeout
      return await Promise.race([uploadPromise(), timeoutPromise]);
    } catch (err) {
      throw err; // Re-throw for retry logic
    }
  };

  return {
    uploadPost,
    uploading: uploading || serviceLoading,
    error: error || serviceError,
    clearError: () => { 
      setError(null);
      if (serviceError) retryService();
    },
    retryService,
  };
}

