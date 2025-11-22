import { useState } from 'react';
import { Upload, X, CheckCircle, ArrowLeft, Wand2 } from 'lucide-react';
import { PurchaseTokenBreakdown } from './PurchaseTokenBreakdown';

interface Bottle {
  id: number;
  name: string;
  vintage: number;
  region: string;
  price: number;
  corks: number;
  image: string;
  type: string;
  description: string;
}

interface PersonalizationFlowProps {
  bottle: Bottle;
  onBack: () => void;
  onComplete: (data: { bottle: Bottle; customText: string; uploadedImage: string | null }) => void;
}

export function PersonalizationFlow({ bottle, onBack, onComplete }: PersonalizationFlowProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'checkout'>('upload');
  const [customText, setCustomText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (step === 'upload') {
      setStep('preview');
    } else if (step === 'preview') {
      setStep('checkout');
    }
  };

  const handlePurchase = () => {
    onComplete({ bottle, customText, uploadedImage });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`flex items-center gap-2 ${step === 'upload' ? 'text-rose-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'upload' ? 'bg-rose-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="hidden sm:inline">Customize</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step === 'preview' ? 'text-rose-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'preview' ? 'bg-rose-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="hidden sm:inline">Preview</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step === 'checkout' ? 'text-rose-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'checkout' ? 'bg-rose-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="hidden sm:inline">Checkout</span>
            </div>
          </div>
        </div>

        {/* Step 1: Upload & Customize */}
        {step === 'upload' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl mb-6 text-gray-900">Personalize Your Bottle</h2>

              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block mb-2 text-gray-700">Upload Image or NFT</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-rose-400 transition-colors">
                    {uploadedImage ? (
                      <div className="relative">
                        <img src={uploadedImage} alt="Uploaded" className="w-full h-48 object-contain rounded-lg" />
                        <button
                          onClick={() => setUploadedImage(null)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600 mb-1">Drop your image or NFT here</p>
                        <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">✨ Or connect wallet to use your NFT collection</p>
                </div>

                {/* Custom Text */}
                <div>
                  <label className="block mb-2 text-gray-700">Custom Message (Optional)</label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="e.g., 'To Sarah, Happy Birthday!' or 'Company Logo'"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    maxLength={50}
                  />
                  <p className="text-sm text-gray-500 mt-1">{customText.length}/50 characters</p>
                </div>

                <button
                  onClick={handleContinue}
                  disabled={!uploadedImage && !customText}
                  className="w-full py-4 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-5 h-5" />
                  Preview Label
                </button>
              </div>
            </div>

            {/* Bottle Info */}
            <div className="bg-gradient-to-br from-purple-100 to-rose-100 rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-9xl mb-4">{bottle.image}</div>
                <h3 className="text-2xl text-gray-900">{bottle.name}</h3>
                <p className="text-gray-700">{bottle.vintage} • {bottle.region}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="text-gray-900">{bottle.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price</span>
                  <span className="text-gray-900 text-xl">€{bottle.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">You'll Earn</span>
                  <span className="text-amber-600 flex items-center gap-1">
                    <span className="text-xl">{bottle.corks}</span> Corks
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-200/50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>✨ Bonus:</strong> Each personalized bottle includes a unique QR code linking to its SUI blockchain NFT with full provenance and authenticity verification.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 'preview' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl mb-6 text-gray-900 text-center">Preview Your Custom Label</h2>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Mock Label Preview */}
                <div className="relative bg-gradient-to-b from-amber-100 to-amber-50 rounded-2xl p-8 border-4 border-amber-900">
                  <div className="text-center mb-4">
                    <h3 className="text-xl text-amber-900">Quinta do Montalto</h3>
                    <p className="text-sm text-amber-800">{bottle.name}</p>
                    <p className="text-xs text-amber-700">{bottle.vintage}</p>
                  </div>

                  {uploadedImage && (
                    <div className="my-6 bg-white p-2 rounded-lg shadow-md">
                      <img src={uploadedImage} alt="Custom" className="w-full h-40 object-contain" />
                    </div>
                  )}

                  {customText && (
                    <div className="my-4 text-center">
                      <p className="text-sm text-amber-900 italic border-t border-b border-amber-300 py-2">
                        "{customText}"
                      </p>
                    </div>
                  )}

                  <div className="text-center mt-6 pt-4 border-t border-amber-300">
                    <p className="text-xs text-amber-800">Natural Wine • {bottle.region}</p>
                    <div className="mt-2 inline-block">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                        <div className="text-xs text-gray-500">QR</div>
                      </div>
                      <p className="text-xs text-amber-700 mt-1">Scan for NFT</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-green-600">
                    <CheckCircle className="w-6 h-6" />
                    <span>Label design confirmed</span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-gray-900">What happens next:</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>✓ Label printed with your custom design</p>
                      <p>✓ Unique SUI NFT minted with bottle metadata</p>
                      <p>✓ QR code links to blockchain provenance</p>
                      <p>✓ {bottle.corks} Corks added to your account</p>
                      <p>✓ Bottle shipped within 3-5 business days</p>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h4 className="text-gray-900 mb-2">NFT Details</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>Blockchain: <span className="text-purple-600">SUI</span></p>
                      <p>Standard: <span className="text-purple-600">Kiosk NFT</span></p>
                      <p>Metadata: <span className="text-purple-600">Fully on-chain</span></p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('upload')}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Edit Design
                    </button>
                    <button
                      onClick={handleContinue}
                      className="flex-1 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Checkout */}
        {step === 'checkout' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl mb-6 text-gray-900">Complete Your Purchase</h2>

              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg mb-4 text-gray-900">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">{bottle.name} ({bottle.vintage})</span>
                      <span className="text-gray-900">€{bottle.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Custom Label</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">NFT Minting</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cork Rewards</span>
                      <span className="text-amber-600">+{bottle.corks} Corks</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-xl">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">€{bottle.price}</span>
                    </div>
                  </div>
                </div>

                {/* Token Earning Breakdown */}
                <PurchaseTokenBreakdown 
                  bottlePrice={bottle.price}
                  corkAmount={bottle.corks}
                />

                {/* Payment Method Selection */}
                <div>
                  <h3 className="text-lg mb-4 text-gray-900">Payment Method</h3>
                  <div className="space-y-3">
                    <button className="w-full p-4 border-2 border-rose-600 bg-rose-50 rounded-xl text-left hover:bg-rose-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-gray-900">💳 Credit Card / Fiat</div>
                          <div className="text-sm text-gray-600">EUR, USD, JPY via Stripe</div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-4 border-rose-600"></div>
                      </div>
                    </button>

                    <button className="w-full p-4 border-2 border-gray-300 rounded-xl text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-gray-900">⛓️ Cryptocurrency</div>
                          <div className="text-sm text-gray-600">BTC, ETH, SOL, SUI</div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Mock Form */}
                <div className="space-y-4">
                  <h3 className="text-lg text-gray-900">Shipping Address</h3>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePurchase}
                  className="w-full py-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-xl hover:from-rose-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  Complete Purchase & Mint NFT
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By completing this purchase, you agree to our terms and confirm you are 18+ years old.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}