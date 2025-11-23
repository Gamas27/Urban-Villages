'use client';

import { useState, useEffect } from 'react';
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
  const [loaded, setLoaded] = useState(false);
  const url = getWalrusUrl(blobId, network);

  // Log when component mounts and starts loading
  useEffect(() => {
    console.log(`[WalrusImage] Loading ${type} image:`, {
      blobId,
      url,
      network,
      type,
      alt,
    });
  }, [blobId, url, network, type, alt]);

  // Handle successful image load
  const handleLoad = () => {
    if (!loaded) {
      setLoaded(true);
      console.log(`[WalrusImage] ✅ Successfully loaded ${type} image from Walrus:`, {
        blobId,
        url,
        type,
        alt,
      });
    }
  };

  // Retry once before showing placeholder (in case of temporary network issues)
  const handleError = () => {
    if (retryCount < 1) {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      console.warn(`[WalrusImage] ⚠️ Failed to load ${type} image (attempt ${newRetryCount}), retrying...`, {
        blobId,
        url,
        type,
        alt,
      });
      // Force reload by updating src
      setTimeout(() => {
        const img = document.querySelector(`img[data-blob-id="${blobId}"]`) as HTMLImageElement;
        if (img) {
          const retryUrl = url + '?retry=' + Date.now();
          console.log(`[WalrusImage] Retrying load from:`, retryUrl);
          img.src = retryUrl;
        }
      }, 1000);
    } else {
      setError(true);
      console.error(`[WalrusImage] ❌ Failed to load ${type} image after retries, showing fallback:`, {
        blobId,
        url,
        type,
        alt,
        retryCount: retryCount + 1,
      });
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
    console.log(`[WalrusImage] Showing profile fallback (gradient circle) for:`, {
      blobId,
      initial: initial || alt[0]?.toUpperCase() || 'U',
    });
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
    console.log(`[WalrusImage] Showing post placeholder for:`, { blobId, alt });
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
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
}
