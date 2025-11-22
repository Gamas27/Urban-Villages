'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download, Eye, EyeOff } from 'lucide-react';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export function WalletExport() {
  const account = useCurrentAccount();
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!account) {
    return null;
  }

  const handleGenerateNewWallet = () => {
    try {
      // Generate a new Ed25519 keypair
      const keypair = new Ed25519Keypair();
      const privateKeyBytes = keypair.getSecretKey();
      const privateKeyHex = Array.from(privateKeyBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      
      setPrivateKey(privateKeyHex);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate wallet');
    }
  };

  const handleCopy = async () => {
    if (!privateKey) return;
    
    try {
      await navigator.clipboard.writeText(privateKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isEnokiWallet = currentWallet?.name?.toLowerCase().includes('enoki');

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Export Wallet for Sui Wallet (Slush)</h3>
        <p className="text-xs text-gray-600 mb-4">
          Export your private key to import into Sui Wallet (Slush) for funding with WAL tokens.
        </p>
      </div>

      {isEnokiWallet && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> Enoki wallets are managed wallets and don't support private key export. 
            You can generate a new wallet below or use the address to receive tokens.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-800 whitespace-pre-line">{error}</p>
        </div>
      )}

      {!privateKey ? (
        <div className="space-y-2">
          <Button
            onClick={handleExportPrivateKey}
            disabled={loading || isEnokiWallet}
            variant="outline"
            className="w-full"
          >
            {loading ? 'Exporting...' : 'Try Export Private Key'}
          </Button>
          
          <div className="text-center text-xs text-gray-500">or</div>
          
          <Button
            onClick={handleGenerateNewWallet}
            variant="default"
            className="w-full bg-gradient-to-r from-orange-500 to-purple-600"
          >
            Generate New Wallet
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Generate a new wallet that you can import into Sui Wallet (Slush)
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-700">Private Key:</label>
              <button
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="text-xs text-gray-600 hover:text-gray-900"
              >
                {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <code className="text-xs font-mono text-gray-800 break-all block">
              {showPrivateKey ? privateKey : '•'.repeat(64)}
            </code>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex-1"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Private Key
                </>
              )}
            </Button>
            
            <Button
              onClick={() => {
                const blob = new Blob([privateKey], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'wallet-private-key.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              variant="outline"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900 font-semibold mb-1">How to import into Sui Wallet (Slush):</p>
            <ol className="text-xs text-blue-800 list-decimal list-inside space-y-1">
              <li>Open Sui Wallet (Slush) app</li>
              <li>Select "More Options" → "Import existing from private key"</li>
              <li>Paste the private key above</li>
              <li>Set a password and complete import</li>
            </ol>
          </div>

          <Button
            onClick={() => {
              setPrivateKey(null);
              setError(null);
            }}
            variant="ghost"
            className="w-full text-xs"
          >
            Generate Another Wallet
          </Button>
        </div>
      )}
    </div>
  );
}

