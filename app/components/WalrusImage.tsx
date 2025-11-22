'use client';

import { useState } from 'react';
import { getWalrusUrl } from '@/lib/walrus';

interface WalrusImageProps {
  blobId: string;
  alt: string;
  className?: string;
  network?: 'testnet' | 'mainnet';
}

export function WalrusImage({ blobId, alt, className, network = 'testnet' }: WalrusImageProps) {
  const [error, setError] = useState(false);
  const url = getWalrusUrl(blobId, network);

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
