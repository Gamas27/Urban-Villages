'use client';

import { useState } from 'react';
import { X, Info } from 'lucide-react';
import { Button } from './ui/button';

/**
 * Banner component to explain zkLogin to hackathon judges
 */
export function ZkLoginInfoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl p-5 z-50 animate-in slide-in-from-bottom duration-300">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2">🔐 zkLogin Technology</h3>
          <p className="text-sm text-white/90 mb-3">
            Urban Villages uses SUI's zkLogin to onboard non-web3 users. Sign in with Google instead of managing crypto wallets!
          </p>
          <div className="space-y-1 text-xs text-white/80">
            <div>✓ No wallet installation needed</div>
            <div>✓ Familiar OAuth login flow</div>
            <div>✓ Automatic SUI address generation</div>
            <div>✓ Zero-knowledge proof security</div>
          </div>
        </div>
      </div>
    </div>
  );
}