'use client';

import { useState, useEffect } from 'react';
import { VILLAGES, type Village } from './data/villages';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, Users, Wallet, Mail } from 'lucide-react';
import { 
  initiateGoogleLogin, 
  isAuthenticated, 
  getCurrentUser, 
  type ZkLoginUser,
  ZKLOGIN_INFO 
} from '../lib/zkLogin';

interface OnboardingProps {
  onComplete: (data: { username: string; village: string; profilePicBlobId?: string }) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [zkUser, setZkUser] = useState<ZkLoginUser | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Check if already authenticated
  useEffect(() => {
    if (!isClient) return;
    
    if (isAuthenticated()) {
      setZkUser(getCurrentUser());
    }

    // Listen for zkLogin completion
    const handleZkLoginComplete = (event: any) => {
      setZkUser(event.detail);
    };

    window.addEventListener('zklogin_complete', handleZkLoginComplete);
    return () => window.removeEventListener('zklogin_complete', handleZkLoginComplete);
  }, [isClient]);

  const [step, setStep] = useState(1);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [username, setUsername] = useState('');
  const [profilePicBlobId, setProfilePicBlobId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Mock upload to Walrus (for demo)
    setUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
    const mockBlobId = `blob_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    setProfilePicBlobId(mockBlobId);
    setUploading(false);
  };

  const handleComplete = () => {
    if (!selectedVillage || !username) return;
    
    onComplete({
      username,
      village: selectedVillage.id,
      profilePicBlobId: profilePicBlobId || undefined,
    });
  };

  // Step 1: Wallet Connection
  if (!zkUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl mb-2">Urban Villages</h1>
          <p className="text-gray-600 mb-8">
            Modular community platform where villages tokenize resources and feed community treasuries through local development.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold">Location-Based Villages</p>
                <p className="text-sm text-gray-600">Join communities in your city</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold">Tokenize Resources</p>
                <p className="text-sm text-gray-600">Turn community assets into tokens</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="font-semibold">Build Community Treasury</p>
                <p className="text-sm text-gray-600">Fund local development projects</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={initiateGoogleLogin}
            className="w-full py-6 text-lg bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 mb-3"
          >
            <Mail className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
          
          <Button 
            onClick={initiateGoogleLogin}
            className="w-full py-6 text-lg bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
          >
            <Wallet className="w-5 h-5 mr-2" />
            Connect SUI Wallet
          </Button>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-xl text-left">
            <p className="text-xs text-blue-900 mb-2">🔐 <strong>No Wallet? No Problem!</strong></p>
            <p className="text-xs text-blue-700">
              Use your Google account to sign in. We use SUI zkLogin technology to create a blockchain wallet for you automatically.
            </p>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Powered by SUI Network + Walrus Storage
          </p>
        </div>
      </div>
    );
  }

  // Step 1: Village Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 p-4 pb-safe">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl mb-2">Choose Your Village</h1>
            <p className="text-gray-600">
              Join a local community based on your city
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {VILLAGES.map((village) => (
              <button
                key={village.id}
                onClick={() => {
                  setSelectedVillage(village);
                  setStep(2);
                }}
                className="bg-white rounded-2xl p-6 text-left hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-transparent hover:border-purple-200"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${village.gradient} rounded-2xl mb-4 flex items-center justify-center text-3xl`}>
                  {village.emoji}
                </div>
                <h3 className="text-xl mb-1">{village.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{village.country}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{village.wineType}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">{village.members} members</span>
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button
            onClick={() => setStep(1)}
            className="text-gray-600 mb-6 hover:text-gray-900"
          >
            ← Back
          </button>
          
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className={`w-20 h-20 bg-gradient-to-br ${selectedVillage.gradient} rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl`}>
              {selectedVillage.emoji}
            </div>
            
            <h1 className="text-3xl text-center mb-2">Claim Your Namespace</h1>
            <p className="text-gray-600 text-center mb-8">
              Create your unique identity on SUI
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                  placeholder="Enter username"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  maxLength={20}
                />
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-purple-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Your SUI Namespace</p>
                <p className="text-2xl">
                  @<span className="text-purple-600">{username || 'username'}</span>
                  <span className="text-gray-400">.{selectedVillage.id}</span>
                </p>
              </div>

              <Button
                onClick={() => setStep(3)}
                disabled={!username || username.length < 3}
                className="w-full py-6 text-lg bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:opacity-50"
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button
            onClick={() => setStep(2)}
            className="text-gray-600 mb-6 hover:text-gray-900"
          >
            ← Back
          </button>
          
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h1 className="text-3xl text-center mb-2">Upload Profile Picture</h1>
            <p className="text-gray-600 text-center mb-8">
              Stored on Walrus decentralized storage
            </p>

            <div className="space-y-6">
              <div className="flex justify-center">
                <label className="cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="relative">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-all">
                        <Camera className="w-12 h-12 text-gray-400 group-hover:text-purple-600" />
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                  </div>
                </label>
              </div>

              {uploading && (
                <p className="text-center text-sm text-purple-600">
                  Uploading to Walrus...
                </p>
              )}

              {profilePicBlobId && (
                <div className="bg-green-50 p-3 rounded-lg text-sm">
                  <p className="text-green-800 text-center">✓ Uploaded to Walrus!</p>
                  <p className="text-green-600 text-xs text-center mt-1 truncate">
                    BlobID: {profilePicBlobId.slice(0, 20)}...
                  </p>
                </div>
              )}

              <Button
                onClick={handleComplete}
                disabled={uploading}
                className="w-full py-6 text-lg bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
              >
                {uploading ? 'Uploading...' : profilePicBlobId ? 'Complete Onboarding' : 'Skip for Now'}
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