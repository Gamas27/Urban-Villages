'use client';

import { useState } from 'react';
import { getWalrusUrl } from '@/lib/walrus';
import { getPlaceholderPostImageUrl, getPlaceholderProfilePicUrl } from '@/lib/placeholders';

interface WalrusImageProps {
  blobId: string;
  alt: string;
  className?: string;
  network?: 'testnet' | 'mainnet';
  type?: 'post' | 'profile';
  initial?: string; // For profile placeholders
}

export function WalrusImage({ 
  blobId, 
  alt, 
  className, 
  network = 'testnet',
  type = 'post',
  initial
}: WalrusImageProps) {
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const url = getWalrusUrl(blobId, network);

  // Get placeholder URL based on type
  const placeholderUrl = type === 'profile' 
    ? getPlaceholderProfilePicUrl(initial)
    : getPlaceholderPostImageUrl();

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
    }
  };

  if (error) {
    return (
      <img
        src={placeholderUrl}
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
