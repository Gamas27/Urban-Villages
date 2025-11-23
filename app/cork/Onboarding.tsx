'use client';

import { useState } from 'react';
import { VILLAGES, type Village } from './data/villages';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, Users, Loader2 } from 'lucide-react';
import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import { useEnokiWalrusUpload } from '@/lib/hooks/useEnokiWalrusUpload';
import { WalletAddress } from '@/components/WalletAddress';

interface OnboardingProps {
  onComplete: (data: { username: string; village: string; profilePicBlobId?: string }) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  // Use Enoki wallet via dapp-kit (works with Enoki wallets and regular wallets)
  const account = useCurrentAccount();
  const { uploadFile, uploading: walrusUploading, error: walrusError } = useEnokiWalrusUpload();

  const [step, setStep] = useState(1);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [username, setUsername] = useState('');
  const [profilePicBlobId, setProfilePicBlobId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if wallet is connected (Enoki or regular)
    if (!account) {
      console.warn('Please connect a wallet first.');
      // Show preview anyway
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Walrus using Enoki wallet (via dapp-kit)
    console.log('[Onboarding] Starting profile picture upload to Walrus...');
    const result = await uploadFile(file);
    if (result) {
      console.log('[Onboarding] ✅ Profile picture uploaded successfully:', {
        blobId: result.blobId,
        url: result.url,
      });
      setProfilePicBlobId(result.blobId);
    } else {
      console.error('[Onboarding] ❌ Walrus upload failed:', walrusError);
      // Clear preview if upload failed
      setPreviewUrl(null);
    }
  };

  const handleComplete = () => {
    if (!selectedVillage || !username) return;
    
    const onboardingData = {
      username,
      village: selectedVillage.id,
      profilePicBlobId: profilePicBlobId || undefined,
    };
    
    console.log('[Onboarding] Completing onboarding with data:', {
      username: onboardingData.username,
      village: onboardingData.village,
      hasProfilePic: !!onboardingData.profilePicBlobId,
      profilePicBlobId: onboardingData.profilePicBlobId,
    });
    
    // Note: Profile will be stored in Zustand store (which also persists to sessionStorage)
    // The profilePicBlobId will be saved to Supabase when saveUserProfile is called in CorkApp
    onComplete(onboardingData);
  };

  // Step 0: Wallet Connection (Enoki wallets appear in ConnectButton)
  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 animate-in fade-in duration-500">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-orange-500 via-purple-600 to-pink-500 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyMCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6 flex items-center justify-center ring-4 ring-white/30 animate-in zoom-in duration-500">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Urban Villages</h1>
              <p className="text-white/90 text-sm">
                Join communities that tokenize resources and build together
              </p>
            </div>
          </div>

          <div className="p-8">
            <p className="text-gray-600 text-center mb-8 text-sm leading-relaxed">
              Modular community platform where villages tokenize resources and feed community treasuries through local development.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200/50 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-semibold text-gray-900 mb-1">Location-Based Villages</p>
                  <p className="text-sm text-gray-600">Join communities in your city</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/50 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-semibold text-gray-900 mb-1">Tokenize Resources</p>
                  <p className="text-sm text-gray-600">Turn community assets into tokens</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-pink-50 to-pink-100/50 rounded-2xl border border-pink-200/50 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-semibold text-gray-900 mb-1">Build Community Treasury</p>
                  <p className="text-sm text-gray-600">Fund local development projects</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <ConnectButton />
            </div>
            
            {account && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in slide-in-from-bottom-4 duration-300">
                <p className="text-xs text-gray-600 mb-2 text-center font-medium">Your wallet address:</p>
                <WalletAddress />
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Copy this address and fund it with SUI tokens using a faucet
                </p>
              </div>
            )}
            
            <div className="p-5 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-blue-200/50">
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">🔐</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Sign in with Google</p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    No wallet extension needed! Click "Connect Wallet" above and select <strong className="text-purple-700">Enoki (Google)</strong> to sign in with your Google account.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mt-6 text-center">
              Powered by SUI Network + Enoki + Walrus Storage
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Village Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 p-4 pb-safe animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto pt-8 pb-8">
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="h-1.5 w-12 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full" />
            <div className="h-1.5 w-2 bg-gray-300 rounded-full" />
            <div className="h-1.5 w-2 bg-gray-300 rounded-full" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Choose Your Village
            </h1>
            <p className="text-gray-600 text-lg">
              Join a local community based on your city
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VILLAGES.map((village) => (
              <button
                key={village.id}
                onClick={() => {
                  setSelectedVillage(village);
                  setStep(2);
                }}
                className="bg-white rounded-3xl p-6 text-left hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-2 border-transparent hover:border-purple-300 group relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-orange-500/0 group-hover:from-purple-500/5 group-hover:to-orange-500/5 transition-all duration-300" />
                
                <div className="relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-br ${village.gradient} rounded-3xl mb-5 flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {village.emoji}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{village.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 font-medium">{village.country}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">{village.wineType}</span>
                    <span className="bg-gradient-to-r from-purple-100 to-orange-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-purple-200">
                      {village.members} members
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Username
  if (step === 2 && selectedVillage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="max-w-md w-full">
          <button
            onClick={() => setStep(1)}
            className="text-gray-600 mb-6 hover:text-gray-900 flex items-center gap-2 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back</span>
          </button>
          
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="h-1.5 w-2 bg-gray-300 rounded-full" />
            <div className="h-1.5 w-12 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full" />
            <div className="h-1.5 w-2 bg-gray-300 rounded-full" />
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className={`w-24 h-24 bg-gradient-to-br ${selectedVillage.gradient} rounded-3xl mx-auto mb-6 flex items-center justify-center text-5xl shadow-lg`}>
              {selectedVillage.emoji}
            </div>
            
            <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Claim Your Namespace
            </h1>
            <p className="text-gray-600 text-center mb-8 text-sm">
              Create your unique identity on SUI blockchain
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                  placeholder="Enter username"
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all text-lg"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {username.length > 0 ? `${username.length}/20 characters` : 'Only letters and numbers'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200/50">
                <p className="text-xs text-gray-600 mb-3 font-medium uppercase tracking-wide">Your SUI Namespace</p>
                <p className="text-3xl font-mono font-bold">
                  <span className="text-gray-400">@</span>
                  <span className="text-purple-600">{username || 'username'}</span>
                  <span className="text-gray-400">.{selectedVillage.id}</span>
                </p>
                {username && username.length >= 3 && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">Available!</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setStep(3)}
                disabled={!username || username.length < 3}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Profile Picture
  if (step === 3 && selectedVillage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="max-w-md w-full">
          <button
            onClick={() => setStep(2)}
            className="text-gray-600 mb-6 hover:text-gray-900 flex items-center gap-2 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back</span>
          </button>
          
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="h-1.5 w-2 bg-gray-300 rounded-full" />
            <div className="h-1.5 w-2 bg-gray-300 rounded-full" />
            <div className="h-1.5 w-12 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full" />
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Upload Profile Picture
            </h1>
            <p className="text-gray-600 text-center mb-8 text-sm">
              Stored on Walrus decentralized storage
            </p>

            <div className="space-y-6">
              {!account && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-xl">⚠️</div>
                    <div>
                      <p className="text-sm font-semibold text-amber-900 mb-1">Wallet required</p>
                      <p className="text-xs text-amber-700">Please connect a wallet to upload your profile picture</p>
                    </div>
                  </div>
                </div>
              )}

              {account && (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2 text-center font-medium">Your wallet address:</p>
                  <WalletAddress />
                </div>
              )}

              <div className="flex justify-center">
                <label className={`cursor-pointer group relative ${!account ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    disabled={walrusUploading || !account}
                    className="hidden"
                  />
                  <div className="relative">
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Profile preview"
                          className="w-40 h-40 rounded-full object-cover border-4 border-purple-300 shadow-xl"
                        />
                        {walrusUploading && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        {profilePicBlobId && !walrusUploading && (
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            Uploaded
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-200 via-purple-100 to-orange-100 flex items-center justify-center group-hover:from-purple-200 group-hover:via-pink-200 group-hover:to-orange-200 transition-all duration-300 border-4 border-purple-200 shadow-lg">
                        <Camera className="w-16 h-16 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    )}
                    {!previewUrl && (
                      <div className="absolute bottom-0 right-0 w-14 h-14 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                        <Camera className="w-7 h-7" />
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {walrusUploading && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-center text-sm text-purple-700 font-medium">
                    Uploading to Walrus...
                  </p>
                  <p className="text-center text-xs text-purple-600 mt-1">
                    This may take a moment
                  </p>
                </div>
              )}
              
              {walrusError && (
                <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="text-xl">❌</div>
                    <div>
                      <p className="text-sm font-semibold text-red-900 mb-1">Upload failed</p>
                      <p className="text-xs text-red-700">{walrusError}</p>
                    </div>
                  </div>
                </div>
              )}

              {profilePicBlobId && !walrusUploading && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">✓</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-800">Uploaded to Walrus!</p>
                      <p className="text-xs text-green-600 mt-1 font-mono truncate">
                        {profilePicBlobId.slice(0, 24)}...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleComplete}
                disabled={walrusUploading}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
              >
                {walrusUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : profilePicBlobId ? (
                  'Complete Onboarding'
                ) : (
                  'Skip for Now'
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                You can always add a profile picture later
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}