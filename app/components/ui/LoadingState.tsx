/**
 * Loading State Component
 * 
 * Reusable loading/error/success state wrapper
 * Based on G8 pattern but simplified for hackathon
 */

'use client';

import { ReactNode } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface LoadingStateProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: ReactNode;
  loadingText?: string;
  errorTitle?: string;
  className?: string;
}

export function LoadingState({
  loading = false,
  error = null,
  onRetry,
  children,
  loadingText = 'Loading...',
  errorTitle = 'Something went wrong',
  className = '',
}: LoadingStateProps) {
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-600">{loadingText}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{errorTitle}</h3>
        <p className="text-sm text-gray-600 mb-4 text-center max-w-md">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Skeleton Loader Component
 * 
 * Simple skeleton for list items
 */
interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
        />
      ))}
    </>
  );
}

/**
 * Skeleton Card - For card-like content
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

