import { X, Wallet, Download, ArrowRight, ExternalLink } from 'lucide-react';

interface Web3ExplainerModalProps {
  onClose: () => void;
  onExportWallet: () => void;
}

export function Web3ExplainerModal({ onClose, onExportWallet }: Web3ExplainerModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-rose-600 text-white p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-3xl mb-2">You Already Own Web3 Assets! 🎉</h2>
          <p className="text-white/90">Here's what's happening behind the scenes</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Current Status */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <h3 className="text-xl text-gray-900 mb-4">What You Have Right Now:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                <div>
                  <div className="text-gray-900">Your own SUI blockchain wallet</div>
                  <div className="text-sm text-gray-600">Created automatically when you signed up</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                <div>
                  <div className="text-gray-900">3 NFTs (one per bottle)</div>
                  <div className="text-sm text-gray-600">Stored on SUI blockchain forever</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                <div>
                  <div className="text-gray-900">450 Cork Tokens</div>
                  <div className="text-sm text-gray-600">Real cryptocurrency you can spend</div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-xl text-gray-900 mb-4">How This Works (Simple Explanation):</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-700">1</span>
                </div>
                <div>
                  <div className="text-gray-900 mb-1">You logged in with email/Google</div>
                  <div className="text-sm text-gray-600">
                    Behind the scenes, we created a SUI wallet tied to your account. Think of it like a digital safe deposit box.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-700">2</span>
                </div>
                <div>
                  <div className="text-gray-900 mb-1">You bought wine with your credit card</div>
                  <div className="text-sm text-gray-600">
                    We processed the payment normally, then minted an NFT certificate for each bottle. We paid the blockchain fees - not you.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-700">3</span>
                </div>
                <div>
                  <div className="text-gray-900 mb-1">Your NFTs & tokens are YOURS</div>
                  <div className="text-sm text-gray-600">
                    We don't control them - they're on the public blockchain. You can take them anywhere, sell them, or keep them forever.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why This Matters */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
            <h3 className="text-xl text-gray-900 mb-4">Why This Matters:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span>🔒</span>
                <span><strong>Proof of authenticity:</strong> Your bottles are verified on blockchain - impossible to counterfeit</span>
              </li>
              <li className="flex gap-2">
                <span>📜</span>
                <span><strong>Complete history:</strong> See vineyard, harvest date, fermentation - all permanent</span>
              </li>
              <li className="flex gap-2">
                <span>💎</span>
                <span><strong>You own it:</strong> Unlike regular loyalty points, Cork tokens can't be taken away</span>
              </li>
              <li className="flex gap-2">
                <span>🎁</span>
                <span><strong>Transferable:</strong> Gift your NFTs to friends - they get the full provenance</span>
              </li>
            </ul>
          </div>

          {/* Next Level */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl text-gray-900 mb-4">Want to Go Deeper? (Optional)</h3>
            <p className="text-gray-600 mb-4">
              Right now, we hold your wallet for you (like a bank holds your money). If you want full control, you can:
            </p>

            <div className="space-y-3">
              <button
                onClick={onExportWallet}
                className="w-full p-4 bg-white border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-900">Export Your Wallet</div>
                  <div className="text-sm text-gray-600">Get your private key to use with SUI Wallet app</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => window.open('https://suiexplorer.com', '_blank')}
                className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-rose-400 hover:bg-rose-50 transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center group-hover:bg-rose-200">
                  <ExternalLink className="w-6 h-6 text-rose-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-900">View on SUI Explorer</div>
                  <div className="text-sm text-gray-600">See your assets on the public blockchain</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Most people never need to do this - using Cork Collective through our app is perfectly fine!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
