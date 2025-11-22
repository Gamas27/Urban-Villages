import React, { useState } from 'react';
import { Gift, Send, UserPlus, CheckCircle, AlertCircle, ArrowRight, Copy, Mail } from 'lucide-react';

interface Bottle {
  id: number;
  name: string;
  vintage: number;
  image: string;
  nftId: string;
  qrCode: string;
}

interface GiftBottleFlowProps {
  bottle: Bottle;
  onBack: () => void;
  onComplete: (recipientAddress: string, message: string) => void;
}

export function GiftBottleFlow({ bottle, onBack, onComplete }: GiftBottleFlowProps) {
  const [step, setStep] = useState<'method' | 'details' | 'confirm' | 'transferring' | 'success'>('method');
  const [giftMethod, setGiftMethod] = useState<'wallet' | 'email'>('wallet');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [includeNFT, setIncludeNFT] = useState(true);
  
  const handleMethodSelect = (method: 'wallet' | 'email') => {
    setGiftMethod(method);
    setStep('details');
  };

  const handleContinue = () => {
    setStep('confirm');
  };

  const handleTransfer = async () => {
    setStep('transferring');
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setStep('success');
  };

  const handleComplete = () => {
    onComplete(
      giftMethod === 'wallet' ? recipientAddress : recipientEmail,
      giftMessage
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-rose-500 via-purple-600 to-purple-700 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl text-white">Gift This Bottle</h2>
                <p className="text-purple-100 text-sm">Transfer NFT ownership</p>
              </div>
            </div>
            {step !== 'transferring' && step !== 'success' && (
              <button
                onClick={onBack}
                className="text-white/80 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Bottle Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{bottle.image}</div>
              <div className="flex-1">
                <h3 className="text-white mb-1">{bottle.name}</h3>
                <p className="text-purple-100 text-sm">Vintage {bottle.vintage}</p>
                <p className="text-purple-200 text-xs font-mono mt-1">{bottle.nftId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Select Method */}
          {step === 'method' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-900 mb-2">How would you like to send this gift?</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Choose whether to transfer to a wallet address or invite via email
                </p>
              </div>

              {/* Wallet Transfer Option */}
              <button
                onClick={() => handleMethodSelect('wallet')}
                className="w-full bg-white border-2 border-purple-200 rounded-2xl p-6 hover:border-purple-600 hover:shadow-lg transition-all active:scale-95 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors">
                    <Send className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1 flex items-center gap-2">
                      Transfer to Wallet Address
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Instant</span>
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Send to someone who already has a SUI wallet
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>✓ Instant transfer on-chain</li>
                      <li>✓ Recipient sees it immediately</li>
                      <li>✓ No email required</li>
                    </ul>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </button>

              {/* Email Invite Option */}
              <button
                onClick={() => handleMethodSelect('email')}
                className="w-full bg-white border-2 border-blue-200 rounded-2xl p-6 hover:border-blue-600 hover:shadow-lg transition-all active:scale-95 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                    <Mail className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1 flex items-center gap-2">
                      Invite via Email
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">Beginner Friendly</span>
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Perfect for friends new to blockchain
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>✓ We'll create a wallet for them</li>
                      <li>✓ Email with claim instructions</li>
                      <li>✓ No crypto knowledge needed</li>
                    </ul>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </button>
            </div>
          )}

          {/* Step 2: Enter Details */}
          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setStep('method')}
                  className="text-sm text-purple-600 hover:text-purple-700 mb-4 flex items-center gap-1"
                >
                  ← Back to options
                </button>
                <h3 className="text-lg text-gray-900 mb-2">
                  {giftMethod === 'wallet' ? 'Enter Recipient Wallet' : 'Enter Email Address'}
                </h3>
                <p className="text-sm text-gray-600">
                  {giftMethod === 'wallet' 
                    ? 'Provide the SUI wallet address of the recipient'
                    : "We'll send them an email with instructions to claim this bottle"
                  }
                </p>
              </div>

              {/* Recipient Input */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {giftMethod === 'wallet' ? 'Recipient Wallet Address' : 'Recipient Email'}
                </label>
                {giftMethod === 'wallet' ? (
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                  />
                ) : (
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                )}
              </div>

              {/* Gift Message */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Gift Message (Optional)
                </label>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Happy Birthday! Enjoy this bottle..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This message will be included with the transfer
                </p>
              </div>

              {/* Include Physical Bottle Option */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm text-amber-900 mb-1">Physical Bottle Transfer</h4>
                    <p className="text-xs text-amber-700 mb-3">
                      Remember: This only transfers the NFT ownership. Make sure to give them the physical bottle too!
                    </p>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeNFT}
                        onChange={(e) => setIncludeNFT(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-xs text-amber-800">
                        I will give them the physical bottle with QR code
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={
                  (giftMethod === 'wallet' && !recipientAddress) ||
                  (giftMethod === 'email' && !recipientEmail) ||
                  !includeNFT
                }
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-xl hover:from-purple-700 hover:to-rose-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
              >
                Continue to Review
              </button>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg text-gray-900 mb-2">Review Transfer</h3>
                <p className="text-sm text-gray-600">
                  Please confirm the details before transferring ownership
                </p>
              </div>

              {/* Transfer Summary */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bottle NFT</p>
                  <p className="text-sm text-gray-900">{bottle.name} {bottle.vintage}</p>
                  <p className="text-xs text-gray-600 font-mono mt-1">{bottle.nftId}</p>
                </div>

                <div className="h-px bg-gray-200" />

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {giftMethod === 'wallet' ? 'Recipient Wallet' : 'Recipient Email'}
                  </p>
                  <p className="text-sm text-gray-900 font-mono break-all">
                    {giftMethod === 'wallet' ? recipientAddress : recipientEmail}
                  </p>
                </div>

                {giftMessage && (
                  <>
                    <div className="h-px bg-gray-200" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Gift Message</p>
                      <p className="text-sm text-gray-700 italic">"{giftMessage}"</p>
                    </div>
                  </>
                )}

                <div className="h-px bg-gray-200" />

                <div>
                  <p className="text-xs text-gray-500 mb-2">What happens next:</p>
                  <ul className="text-xs text-gray-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>NFT ownership transfers to recipient</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Provenance updated with gift event</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>
                        {giftMethod === 'wallet' 
                          ? 'Recipient sees bottle in their collection'
                          : 'Email sent with claim instructions'
                        }
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>You will no longer own this NFT</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm text-rose-900 mb-1">This action cannot be undone</h4>
                    <p className="text-xs text-rose-700">
                      Once transferred, only the recipient can transfer it back to you. Make sure the address is correct!
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                >
                  Back
                </button>
                <button
                  onClick={handleTransfer}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-xl hover:from-purple-700 hover:to-rose-700 transition-all active:scale-95 shadow-lg shadow-purple-500/20"
                >
                  Transfer NFT
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Transferring */}
          {step === 'transferring' && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Send className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2">Transferring NFT...</h3>
              <p className="text-gray-600 mb-6">
                Broadcasting transaction to SUI blockchain
              </p>
              
              {/* Progress Steps */}
              <div className="max-w-sm mx-auto space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">Signing transaction...</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-700">Broadcasting to network...</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                  <span className="text-sm text-gray-400">Confirming transfer...</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 'success' && (
            <div className="py-8">
              {/* Success Animation */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-2">Transfer Complete! 🎉</h3>
                <p className="text-gray-600">
                  The bottle NFT has been successfully transferred
                </p>
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-6">
                <h4 className="text-sm text-gray-700 mb-3">Transaction Details</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-900 font-mono break-all flex-1">
                        0xabcdef1234567890abcdef1234567890abcdef1234567890
                      </p>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">New Owner</p>
                    <p className="text-xs text-gray-900 font-mono break-all">
                      {giftMethod === 'wallet' ? recipientAddress : recipientEmail}
                    </p>
                  </div>
                  <a
                    href={`https://suiexplorer.com/txblock/0xabcdef?network=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
                  >
                    View on SUI Explorer →
                  </a>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h4 className="text-sm text-blue-900 mb-2">Next Steps</h4>
                <ul className="text-xs text-blue-700 space-y-1.5">
                  {giftMethod === 'wallet' ? (
                    <>
                      <li>✓ NFT is now in recipient's wallet</li>
                      <li>✓ They can view it in their collection</li>
                      <li>• Give them the physical bottle with QR code</li>
                      <li>• They can scan QR to verify ownership</li>
                    </>
                  ) : (
                    <>
                      <li>✓ Confirmation email sent to recipient</li>
                      <li>✓ Wallet created automatically for them</li>
                      <li>• They'll click "Claim Bottle" in email</li>
                      <li>• Give them the physical bottle with QR code</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Done Button */}
              <button
                onClick={handleComplete}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-rose-600 text-white rounded-xl hover:from-purple-700 hover:to-rose-700 transition-all active:scale-95 shadow-lg shadow-purple-500/20"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
