import { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, Package, ExternalLink } from 'lucide-react';

interface MintingConfirmationProps {
  bottleName: string;
  bottleImage: string;
  nftId: string;
  bottleNumber: number;
  onClose: () => void;
}

export function MintingConfirmation({ 
  bottleName, 
  bottleImage, 
  nftId, 
  bottleNumber,
  onClose 
}: MintingConfirmationProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Auto-progress through minting steps
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1600),
      setTimeout(() => setStep(3), 2400),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const steps = [
    { label: 'Processing payment...', icon: '💳' },
    { label: 'Minting NFT on SUI blockchain...', icon: '⛓️' },
    { label: 'Adding to your collection...', icon: '📦' },
    { label: 'Complete!', icon: '✨' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Success Header */}
        {step === 3 ? (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl mb-2">Purchase Complete!</h2>
            <p className="text-green-100 text-sm">Your NFT has been minted</p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-purple-600 to-rose-600 text-white p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl mb-2">Creating Your NFT...</h2>
            <p className="text-purple-100 text-sm">This will only take a moment</p>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Bottle Preview */}
          <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl p-6 text-center border border-purple-100">
            <div className="text-6xl mb-3">{bottleImage}</div>
            <h3 className="text-gray-900 mb-1">{bottleName}</h3>
            <p className="text-sm text-gray-600">Bottle #{bottleNumber}/500</p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-3">
            {steps.map((s, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  index < step
                    ? 'bg-green-50 border border-green-200'
                    : index === step
                    ? 'bg-purple-50 border border-purple-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="text-2xl">{s.icon}</div>
                <div className="flex-1">
                  <p className={`text-sm ${
                    index <= step ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {s.label}
                  </p>
                </div>
                {index < step && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {index === step && step < 3 && (
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            ))}
          </div>

          {/* NFT Details (only show when complete) */}
          {step === 3 && (
            <>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-start gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm text-purple-900 mb-1">NFT Minted Successfully</h4>
                    <p className="text-xs text-purple-700 font-mono break-all">{nftId}</p>
                  </div>
                </div>
                <a
                  href={`https://suiscan.xyz/testnet/object/${nftId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <span>View on SUI Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-amber-700 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm text-amber-900 mb-1">What's Next?</h4>
                    <p className="text-xs text-amber-700">
                      Your bottle will ship with a QR code. Scan it when it arrives to verify authenticity and view full provenance on the blockchain!
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-xl hover:from-purple-700 hover:to-rose-700 transition-all active:scale-95 shadow-lg shadow-purple-500/30"
              >
                View My Collection
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
