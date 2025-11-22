import { X, Mail, Wallet, Chrome } from 'lucide-react';
import { useState } from 'react';

interface OnboardingModalProps {
  onClose: () => void;
  onLogin: (method: 'email' | 'google' | 'wallet') => void;
}

export function OnboardingModal({ onClose, onLogin }: OnboardingModalProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-rose-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl mb-2">Welcome to Cork Collective</h2>
          <p className="text-white/90 text-sm">Get started in seconds - no crypto experience needed</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Easy Login Options */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">Choose how you'd like to sign in:</p>

            {/* Email Login */}
            <button
              onClick={() => onLogin('email')}
              className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-gray-900">Continue with Email</div>
                <div className="text-xs text-gray-500">We'll create your account automatically</div>
              </div>
            </button>

            {/* Google Login */}
            <button
              onClick={() => onLogin('google')}
              className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-rose-400 hover:bg-rose-50 transition-all text-left flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                <Chrome className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex-1">
                <div className="text-gray-900">Continue with Google</div>
                <div className="text-xs text-gray-500">One-click sign in</div>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="bg-white px-3 py-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showAdvanced ? 'Hide' : 'Show'} advanced options
              </button>
            </div>
          </div>

          {/* Advanced: Web3 Wallet */}
          {showAdvanced && (
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500">For crypto users:</p>
              <button
                onClick={() => onLogin('wallet')}
                className="w-full p-4 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-xl hover:from-purple-700 hover:to-rose-700 transition-all text-left flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Wallet className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div>Connect SUI Wallet</div>
                  <div className="text-xs text-white/80">SUI Wallet, Suiet, Ethos, etc.</div>
                </div>
              </button>
            </div>
          )}

          {/* Trust Badges */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <p className="text-xs text-green-800 mb-2">✨ What you get:</p>
            <ul className="text-xs text-green-700 space-y-1">
              <li>✓ Your own blockchain wallet (created automatically)</li>
              <li>✓ NFT ownership of every bottle you buy</li>
              <li>✓ Cork tokens for rewards & discounts</li>
              <li>✓ No crypto knowledge required</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
