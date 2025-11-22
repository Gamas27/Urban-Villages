/**
 * Simple post storage for demo purposes
 * In production, this would be stored on-chain or in a database
 */

import { Post } from '../data/mockData';

const STORAGE_KEY = 'cork_collective_posts';

export function savePost(post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'corkEarned'>): Post {
  const newPost: Post = {
    ...post,
    id: `post_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    timestamp: Date.now(),
    likes: 0,
    comments: 0,
    corkEarned: post.text.length > 100 ? 20 : post.text.length > 50 ? 15 : post.imageBlobId ? 15 : 10,
  };

  // Get existing posts from localStorage
  const existingPosts = getPosts();
  
  // Add new post at the beginning
  const updatedPosts = [newPost, ...existingPosts];
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  }

  return newPost;
}

export function getPosts(): Post[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading posts from storage:', error);
  }

  return [];
}

export function clearPosts() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

