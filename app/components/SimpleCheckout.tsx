import { CreditCard, Lock, CheckCircle } from 'lucide-react';

interface SimpleCheckoutProps {
  bottle: {
    name: string;
    price: number;
    corks: number;
  };
  customText?: string;
  onComplete: () => void;
  onBack: () => void;
}

export function SimpleCheckout({ bottle, customText, onComplete, onBack }: SimpleCheckoutProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In real app: Process payment with Stripe
    // Behind the scenes:
    // 1. Charge credit card
    // 2. Backend mints NFT to user's embedded wallet
    // 3. Backend pays gas fees
    // 4. User receives NFT + Corks
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-rose-600 text-white p-6">
          <h2 className="text-2xl mb-2">Complete Your Purchase</h2>
          <p className="text-white/90">Pay with card - your NFT will be minted automatically</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-lg text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{bottle.name}</span>
                  <span className="text-gray-900">${bottle.price}</span>
                </div>
                
                {customText && (
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <p className="text-xs text-gray-600 mb-1">Custom Message:</p>
                    <p className="text-sm text-gray-900 italic">"{customText}"</p>
                  </div>
                )}

                <div className="border-t border-purple-200 pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Unique SUI NFT Certificate</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Earn {bottle.corks} Cork Tokens</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Blockchain Verified Provenance</span>
                  </div>
                </div>

                <div className="border-t border-purple-200 pt-3 flex justify-between items-center">
                  <span className="text-lg text-gray-900">Total</span>
                  <span className="text-2xl text-gray-900">${bottle.price}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    required
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-green-800">
                  <p className="mb-2">Your payment is secure. After purchase:</p>
                  <ul className="space-y-1">
                    <li>✓ We'll create your blockchain wallet automatically</li>
                    <li>✓ Your NFT will be minted on SUI blockchain</li>
                    <li>✓ Cork tokens added to your account</li>
                    <li>✓ QR code ready for bottle verification</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-xl hover:from-purple-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl"
              >
                Pay ${bottle.price}
              </button>
            </div>

            {/* Fine Print */}
            <p className="text-xs text-gray-500 text-center">
              No crypto knowledge required. We handle all blockchain transactions for you.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
