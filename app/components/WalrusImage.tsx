'use client';

import { useState } from 'react';
import { getWalrusUrl } from '@/lib/walrus';
import { getPlaceholderPostImageUrl } from '@/lib/placeholders';

interface WalrusImageProps {
  blobId: string;
  alt: string;
  className?: string;
  network?: 'testnet' | 'mainnet';
  type?: 'post' | 'profile';
  initial?: string; // For profile placeholders
  onError?: () => void; // Callback when image fails to load
}

export function WalrusImage({ 
  blobId, 
  alt, 
  className, 
  network = 'testnet',
  type = 'post',
  initial,
  onError
}: WalrusImageProps) {
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const url = getWalrusUrl(blobId, network);

  // Retry once before showing placeholder (in case of temporary network issues)
  const handleError = () => {
    if (retryCount < 1) {
      setRetryCount(prev => prev + 1);
      // Force reload by updating src
      setTimeout(() => {
        const img = document.querySelector(`img[data-blob-id="${blobId}"]`) as HTMLImageElement;
        if (img) {
          img.src = url + '?retry=' + Date.now();
        }
      }, 1000);
    } else {
      setError(true);
      // Call parent error handler if provided
      if (onError) {
        onError();
      }
    }
  };

  // For profile pictures, render a local fallback instead of external placeholder
  if (error && type === 'profile') {
    // Extract size classes from className, but replace image-specific classes
    const baseClasses = className?.replace(/\bobject-cover\b/g, '').trim() || '';
    return (
      <div 
        className={`${baseClasses} bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-3xl font-bold text-white`}
        title="Profile picture unavailable"
      >
        {initial || alt[0]?.toUpperCase() || 'U'}
      </div>
    );
  }

  // For posts, use external placeholder (or could be improved to use local fallback)
  if (error && type === 'post') {
    return (
      <img
        src={getPlaceholderPostImageUrl()}
        alt={alt}
        className={className}
        title="Walrus image unavailable - showing placeholder"
      />
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      data-blob-id={blobId}
      onError={handleError}
      loading="lazy"
    />
  );
}
