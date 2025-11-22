'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

export function WalletAddress() {
  const account = useCurrentAccount();
  const [copied, setCopied] = useState(false);

  if (!account) {
    return null;
  }

  const address = account.address;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border">
      <code className="flex-1 text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
        {address}
      </code>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="shrink-0"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </>
        )}
      </Button>
    </div>
  );
}

