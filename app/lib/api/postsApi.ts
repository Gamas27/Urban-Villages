/**
 * Posts API Client
 * 
 * Helper functions to interact with posts API
 */

export interface Post {
  id: string;
  namespace: string;
  village: string;
  text: string;
  imageBlobId?: string | null;
  imageUrl?: string | null;
  type?: string;
  activityData?: any;
  corkEarned: number;
  likes: number;
  comments: number;
  timestamp: number;
  author?: string;
  profilePicBlobId?: string | null;
}

export interface CreatePostData {
  walletAddress: string;
  namespace: string;
  village: string;
  text: string;
  imageBlobId?: string;
  imageUrl?: string;
  walrusBlobId?: string; // Walrus blob ID for post content
  type?: string;
  activityData?: any;
}

/**
 * Get posts from the feed
 */
export async function getPosts(options?: {
  village?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: Post[]; count: number; hasMore: boolean }> {
  try {
    const params = new URLSearchParams();
    if (options?.village) params.append('village', options.village);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const response = await fetch(`/api/posts?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      console.error('[getPosts] Error:', error);
      return { data: [], count: 0, hasMore: false };
    }

    return await response.json();
  } catch (error) {
    console.error('[getPosts] Failed to fetch posts:', error);
    return { data: [], count: 0, hasMore: false };
  }
}

/**
 * Create a new post
 */
export async function createPost(data: CreatePostData): Promise<Post | null> {
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[createPost] Error:', error);
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('[createPost] Failed to create post:', error);
    return null;
  }
}

