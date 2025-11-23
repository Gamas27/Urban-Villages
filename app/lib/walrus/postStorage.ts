/**
 * Post Storage on Walrus
 * 
 * Stores post content as JSON on Walrus decentralized storage
 * Returns blob ID that's stored in Supabase index
 */

import { createWalrusService } from '../walrus';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';

export interface WalrusPost {
  id: string;
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
  timestamp: number;
  author?: string;
  profilePicBlobId?: string;
}

/**
 * Upload post content to Walrus
 * Returns blob ID
 */
export async function uploadPostToWalrus(
  post: Omit<WalrusPost, 'id' | 'timestamp'>,
  suiClient?: any,
  signAndExecute?: any
): Promise<{ blobId: string; url: string } | null> {
  try {
    // Create post content as JSON
    const postContent = {
      namespace: post.namespace,
      village: post.village,
      text: post.text,
      imageBlobId: post.imageBlobId || null,
      imageUrl: post.imageUrl || null,
      type: post.type || 'regular',
      activityData: post.activityData || null,
      corkEarned: post.corkEarned || 0,
      likes: post.likes || 0,
      comments: post.comments || 0,
      author: post.author || post.namespace?.split('.')[0] || 'user',
      profilePicBlobId: post.profilePicBlobId || null,
      createdAt: new Date().toISOString(),
    };

    // Convert to JSON blob
    const jsonString = JSON.stringify(postContent);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], `post-${Date.now()}.json`, {
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

    // Upload to Walrus using writeFilesFlow (the correct API)
    const flow = walrusService.writeFilesFlow({
      files: [
        await (await import('@mysten/walrus')).WalrusFile.from({
          contents: await file.arrayBuffer().then(buf => new Uint8Array(buf)),
          identifier: file.name,
          tags: { 'content-type': 'application/json' },
        }),
      ],
    });

    // Encode, register, upload, and certify
    await flow.encode();
    
    if (!signAndExecute) {
      throw new Error('signAndExecute function is required');
    }

    const registerTx = flow.register({
      owner: '', // Will be set by signAndExecute
      epochs: 10,
      deletable: true,
    });

    // Note: This function needs to be refactored to use the new Walrus API properly
    // For now, throw an error directing users to use the usePostUpload hook instead
    throw new Error('uploadPostToWalrus needs to be refactored to use the new Walrus API. Use usePostUpload hook instead.');
  } catch (error) {
    console.error('[uploadPostToWalrus] Error:', error);
    return null;
  }
}

/**
 * Fetch post content from Walrus
 */
export async function fetchPostFromWalrus(blobId: string): Promise<WalrusPost | null> {
  try {
    const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet';
    const aggregatorUrl = network === 'testnet'
      ? 'https://aggregator.walrus-testnet.walrus.space'
      : 'https://aggregator.walrus.walrus.space';
    
    const url = `${aggregatorUrl}/v1/${blobId}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch post from Walrus: ${response.statusText}`);
    }

    const postData = await response.json();
    
    // Transform to WalrusPost format
    const post: WalrusPost = {
      id: blobId, // Use blobId as ID
      namespace: postData.namespace,
      village: postData.village,
      text: postData.text,
      imageBlobId: postData.imageBlobId || undefined,
      imageUrl: postData.imageUrl || undefined,
      type: postData.type || 'regular',
      activityData: postData.activityData || undefined,
      corkEarned: postData.corkEarned || 0,
      likes: postData.likes || 0,
      comments: postData.comments || 0,
      timestamp: postData.createdAt ? new Date(postData.createdAt).getTime() : Date.now(),
      author: postData.author || postData.namespace?.split('.')[0] || 'user',
      profilePicBlobId: postData.profilePicBlobId || undefined,
    };

    return post;
  } catch (error) {
    console.error('[fetchPostFromWalrus] Error:', error);
    return null;
  }
}

/**
 * Fetch multiple posts from Walrus in parallel
 */
export async function fetchPostsFromWalrus(blobIds: string[]): Promise<WalrusPost[]> {
  const posts = await Promise.all(
    blobIds.map((blobId) => fetchPostFromWalrus(blobId))
  );

  // Filter out null results and sort by timestamp (newest first)
  return posts
    .filter((post): post is WalrusPost => post !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
}

