'use client';

import { useState } from 'react';
import { X, Sparkles, Package, ExternalLink, Loader2, CheckCircle } from 'lucide-react';
import { type Wine } from './data/mockData';
import { Button } from '@/components/ui/button';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { bottleApi } from '@/lib/api';

interface PurchaseModalProps {
  wine: Wine;
  onClose: () => void;
  onSuccess: () => void;
}

export function PurchaseModal({ wine, onClose, onSuccess }: PurchaseModalProps) {
  const account = useCurrentAccount();
  const [step, setStep] = useState<'confirm' | 'minting' | 'success'>('confirm');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [nftId, setNftId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    setStep('minting');
    setError(null);

    try {
      // Generate QR code (for demo, use timestamp-based)
      const qrCode = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Use bottleApi client for consistent error handling
      const { bottleApi } = await import('@/lib/api');
      const result = await bottleApi.mintBottle({
        recipient: account.address,
        wineName: wine.name,
        vintage: parseInt(wine.vintage) || new Date().getFullYear(),
        region: wine.village || 'Unknown',
        winery: wine.vineyard,
        wineType: 'Wine',
        bottleNumber: Math.floor(Math.random() * 1000) + 1,
        totalSupply: wine.total || 500,
        imageUrl: wine.imageUrl,
        qrCode,
        corkAmount: wine.corkReward || 50,
        customText: wine.description || undefined,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to complete purchase');
      }

      setTxHash(result.data.digest);
      setNftId(data.nftId);
      setStep('success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to complete purchase';
      setError(errorMsg);
      setStep('confirm');
    }
  };

  const handleClose = () => {
    if (step === 'success') {
      onSuccess();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-lg md:rounded-2xl max-h-screen overflow-y-auto pb-safe">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg">
            {step === 'confirm' && 'Confirm Purchase'}
            {step === 'minting' && 'Minting NFT...'}
            {step === 'success' && 'Purchase Complete!'}
          </h2>
          <button
            onClick={handleClose}
            disabled={step === 'minting'}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Confirm Step */}
          {step === 'confirm' && (
            <div className="space-y-6">
              {/* Wine Details */}
              <div className="flex gap-4">
                <img
                  src={wine.imageUrl}
                  alt={wine.name}
                  className="w-24 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl mb-1">{wine.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {wine.vineyard} • {wine.vintage}
                  </p>
                  <p className="text-sm text-gray-700">{wine.description}</p>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Wine Price</span>
                  <span className="font-semibold">€{wine.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gas Fee (estimated)</span>
                  <span className="font-semibold">€0.50</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg">€{(wine.price + 0.5).toFixed(2)}</span>
                </div>
              </div>

              {/* Rewards */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">You'll Earn</span>
                </div>
                <p className="text-2xl text-green-900 mb-1">+{wine.corkReward} CORK</p>
                <p className="text-sm text-green-700">Added to your wallet instantly</p>
              </div>

              {/* NFT Info */}
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">NFT Details</span>
                </div>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Unique bottle number assigned</li>
                  <li>• Provenance data stored on Walrus</li>
                  <li>• QR code for verification</li>
                  <li>• Tradeable on SUI marketplace</li>
                </ul>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                disabled={!account}
                className="w-full py-6 text-lg bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:opacity-50"
              >
                {account ? 'Confirm Purchase' : 'Connect Wallet First'}
              </Button>

              <p className="text-xs text-center text-gray-500">
                {account 
                  ? 'NFT and CORK tokens will be minted to your wallet'
                  : 'Please connect your wallet to continue'}
              </p>
            </div>
          )}

          {/* Minting Step */}
          {step === 'minting' && (
            <div className="py-12 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full animate-pulse" />
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <Package className="w-12 h-12 text-purple-600 animate-bounce" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl mb-2">Minting Your NFT</h3>
                <p className="text-gray-600">
                  Creating unique bottle on SUI blockchain...
                </p>
              </div>

              <div className="space-y-2 text-sm text-left max-w-xs mx-auto">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  <span>Minting CORK tokens...</span>
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  <span>Minting NFT bottle...</span>
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  <span>Finalizing transaction...</span>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-800">{error}</p>
                  <Button
                    onClick={() => {
                      setError(null);
                      setStep('confirm');
                    }}
                    variant="outline"
                    className="mt-2 w-full"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="py-8 space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                <h3 className="text-2xl mb-2">Purchase Complete!</h3>
                <p className="text-gray-600">
                  Your NFT bottle has been minted and is now in your wallet
                </p>
              </div>

              {/* Wine Card */}
              <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-2xl p-6 text-center">
                <img
                  src={wine.imageUrl}
                  alt={wine.name}
                  className="w-32 h-48 object-cover rounded-lg mx-auto mb-4 shadow-lg"
                />
                <h4 className="text-xl mb-1">{wine.name}</h4>
                {nftId && (
                  <p className="text-sm text-gray-600 mb-3">NFT: {nftId.slice(0, 8)}...{nftId.slice(-6)}</p>
                )}
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">+{wine.corkReward} CORK earned!</span>
                </div>
              </div>

              {/* Transaction Details */}
              {txHash && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transaction</span>
                    <a
                      href={`https://testnet.suivision.xyz/txblock/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {nftId && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">NFT Object</span>
                      <a
                        href={`https://testnet.suivision.xyz/object/${nftId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleClose}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
                >
                  View My Bottles
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="w-full py-4"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

