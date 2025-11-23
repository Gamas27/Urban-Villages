/**
 * Hook to upload post content to Walrus
 * 
 * Creates post as JSON and uploads to Walrus decentralized storage
 * Returns blob ID to store in Supabase index
 */

'use client';

import { useState } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { createWalrusService, getWalrusUrl } from '../walrus';
import { WalrusFile } from '@mysten/walrus';

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
 */
export function usePostUpload() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload post content to Walrus
   */
  const uploadPost = async (postContent: PostContent): Promise<PostUploadResult | null> => {
    if (!account) {
      setError('Please connect your wallet first');
      return null;
    }

    setUploading(true);
    setError(null);

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

      // Create Walrus service
      const walrusService = await createWalrusService(
        {
          network: (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet',
          epochs: 10,
        },
        suiClient
      );

      // Read file as array buffer
      const contents = await file.arrayBuffer();

      // Create upload flow
      const flow = walrusService.writeFilesFlow({
        files: [
          WalrusFile.from({
            contents: new Uint8Array(contents),
            identifier: file.name,
            tags: { 'content-type': 'application/json' },
          }),
        ],
      });

      // Step 1: Encode
      await flow.encode();

      // Step 2: Register (returns transaction)
      const registerTx = flow.register({
        owner: account.address,
        epochs: 10,
        deletable: true,
      });

      // Step 3: Sign and execute register transaction
      let registerDigest: string;
      
      await new Promise<void>((resolve, reject) => {
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
      });

      // Step 4: Upload data to storage nodes
      await flow.upload({ digest: registerDigest! });

      // Step 5: Certify (returns transaction)
      const certifyTx = flow.certify();

      // Step 6: Sign and execute certify transaction
      await new Promise<void>((resolve, reject) => {
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
      });

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
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Post upload failed: ${errorMsg}`);
      console.error('Post upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadPost,
    uploading,
    error,
    clearError: () => { setError(null); },
  };
}

