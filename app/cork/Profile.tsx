'use client';

import { Sparkles, Package, Users, Calendar, ExternalLink, RotateCcw } from 'lucide-react';
import { getVillageById } from './data/villages';
import { Button } from '@/components/ui/button';
import { useUserProfile, useUserNamespace, useUserVillage, useUserStore } from '@/lib/stores/userStore';
import { useBackendProfile, useBackendStore } from '@/lib/stores/backendStore';
import { useBlockchainStore } from '@/lib/stores/blockchainStore';
import { WalrusImage } from '@/components/WalrusImage';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { useMemo, useEffect, useState } from 'react';
import { verifyWalrusBlob } from '@/lib/walrus';
import { saveUserProfile } from '@/lib/api/userTracking';

export function Profile() {
  const profile = useUserProfile();
  const namespace = useUserNamespace();
  const userVillage = useUserVillage();
  const account = useCurrentAccount();
  const backendProfile = useBackendProfile();
  const { fetchBackendProfile, reset: resetBackendStore } = useBackendStore();
  const { reset: resetUserStore } = useUserStore();
  const { clearTransactions } = useBlockchainStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // Fetch backend profile when wallet is connected
  useEffect(() => {
    if (account?.address) {
      console.log('[Profile] Fetching backend profile for wallet:', account.address);
      fetchBackendProfile(account.address).then((backendProfile) => {
        if (backendProfile) {
          console.log('[Profile] ✅ Backend profile loaded:', {
            username: backendProfile.username,
            village: backendProfile.village,
            profilePicBlobId: backendProfile.profilePicBlobId,
            namespaceId: backendProfile.namespaceId,
          });
        } else {
          console.log('[Profile] ℹ️ No backend profile found (user may not have completed onboarding)');
        }
      });
    }
  }, [account?.address, fetchBackendProfile]);
  
  // Merge backend profile with userStore profile (backend takes precedence for profilePicBlobId)
  const mergedProfile = useMemo(() => {
    if (!profile) return null;
    
    const merged = {
      ...profile,
      // Use backend profilePicBlobId if available (more up-to-date)
      profilePicBlobId: backendProfile?.profilePicBlobId || profile.profilePicBlobId,
    };
    
    return merged;
  }, [profile, backendProfile]);

  const [validatedBlobId, setValidatedBlobId] = useState<string | null>(null);

  // Verify blob exists in Walrus when profilePicBlobId is available
  useEffect(() => {
    if (mergedProfile?.profilePicBlobId && account?.address) {
      console.log('[Profile] 📸 Profile picture blobId available, verifying in Walrus:', {
        blobId: mergedProfile.profilePicBlobId,
        username: mergedProfile.username,
        source: backendProfile?.profilePicBlobId ? 'backend' : 'userStore',
      });
      
      // Verify blob exists
      verifyWalrusBlob(mergedProfile.profilePicBlobId, 'testnet').then((exists) => {
        if (exists) {
          console.log('[Profile] ✅ Blob verified, will render from Walrus');
          setValidatedBlobId(mergedProfile.profilePicBlobId!);
        } else {
          console.warn('[Profile] ⚠️ Blob not found in Walrus, will show fallback. BlobId may be invalid:', {
            blobId: mergedProfile.profilePicBlobId,
          });
          setValidatedBlobId(null);
          
          // Optionally clean up invalid blobId from database
          if (account.address && backendProfile?.profilePicBlobId === mergedProfile.profilePicBlobId) {
            console.log('[Profile] Cleaning up invalid blobId from database...');
            saveUserProfile({
              walletAddress: account.address,
              profilePicBlobId: undefined, // Clear invalid blobId
            }).then(() => {
              console.log('[Profile] Invalid blobId cleared from database');
            });
          }
        }
      });
    } else if (mergedProfile) {
      console.log('[Profile] ℹ️ No profilePicBlobId, will show gradient fallback');
      setValidatedBlobId(null);
    }
  }, [mergedProfile?.profilePicBlobId, mergedProfile?.username, backendProfile?.profilePicBlobId, account?.address]);
  
  const village = getVillageById(userVillage || 'lisbon');
  
  // Fetch CORK token balance using corkApi
  const { data: corkBalanceData, isLoading: loadingBalance } = useSuiClientQuery(
    'getBalance',
    {
      coinType: process.env.NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID 
        ? `${process.env.NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID}::cork_token::CORK`
        : '0x2::sui::SUI',
      owner: account?.address || '',
    },
    {
      enabled: !!account && !!process.env.NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID,
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  );
  
  // Convert balance from smallest unit to CORK (6 decimals)
  const corkBalance = useMemo(() => {
    if (!corkBalanceData || !process.env.NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID) return 0;
    return Number(corkBalanceData.totalBalance || 0) / 1_000_000; // 6 decimals
  }, [corkBalanceData]);
  
  // Fetch owned bottles count
  const { data: ownedBottles } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address || '',
      filter: {
        StructType: process.env.NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID 
          ? `${process.env.NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID}::bottle_nft::BottleNFT`
          : '',
      },
      options: { showType: true },
    },
    {
      enabled: !!account && !!process.env.NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID,
    }
  );
  
  const bottlesOwned = ownedBottles?.data?.length || 0;

  if (!mergedProfile) {
    return (
      <div className="min-h-screen p-4 pb-24 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-700 text-lg">No profile found. Please complete onboarding.</p>
        </div>
      </div>
    );
  }
  
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };
  
  // Use current date as joined date if not available
  const joinedDate = new Date();

  return (
    <div className="min-h-screen p-4 pb-24 bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
        <div className="px-6 pb-6 pt-6">
          {/* Profile Picture */}
          <div className="flex justify-between items-end mb-4">
            {validatedBlobId ? (
              <WalrusImage
                blobId={validatedBlobId}
                alt={mergedProfile.username}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                type="profile"
                initial={mergedProfile.username[0].toUpperCase()}
              />
            ) : (
              <div 
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-3xl font-bold text-white"
                title="No profile picture"
              >
                {mergedProfile.username[0].toUpperCase()}
              </div>
            )}
            <Button
              variant="outline"
              className="border-2"
            >
              Edit Profile
            </Button>
          </div>

          {/* User Info */}
          <h2 className="text-2xl mb-1 text-gray-900 font-semibold">{mergedProfile.username}</h2>
          <p className="text-purple-600 mb-2 font-medium">@{namespace || 'user'}</p>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4" />
            <span>Joined {formatDate(joinedDate)}</span>
          </div>

          {/* Follow Stats - Placeholder for future social features */}
          <div className="flex gap-6 mb-4">
            <div>
              <span className="font-semibold text-lg text-gray-900">0</span>
              <span className="text-gray-600 text-sm ml-1">Following</span>
            </div>
            <div>
              <span className="font-semibold text-lg text-gray-900">0</span>
              <span className="text-gray-600 text-sm ml-1">Followers</span>
            </div>
          </div>

          {/* Village Badge */}
          {village && (
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl inline-flex">
              <span className="text-2xl">{village.emoji}</span>
              <span className="font-semibold text-gray-900">{village.name} Village</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* CORK Balance */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700">CORK Balance</span>
          </div>
          <p className="text-3xl text-green-900">{corkBalance.toFixed(2)}</p>
          <p className="text-xs text-green-600 mt-1">Fungible Tokens</p>
        </div>

        {/* Bottles Owned */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-700">NFT Bottles</span>
          </div>
          <p className="text-3xl text-purple-900">{bottlesOwned}</p>
          <p className="text-xs text-purple-600 mt-1">Unique Collectibles</p>
        </div>
      </div>

      {/* Village Stats */}
      {village && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <h3 className="text-lg mb-4 flex items-center gap-2 text-gray-900 font-semibold">
            <Users className="w-5 h-5 text-gray-600" />
            {village.name} Village Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl text-gray-900 font-semibold">{village.members}</p>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
            <div>
              <p className="text-2xl text-gray-900 font-semibold">€{village.treasury.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Village Treasury</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
        <h3 className="text-lg mb-4 text-gray-900 font-semibold">Quick Actions</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-between text-gray-900 hover:text-gray-900"
          >
            <span>View My NFT Bottles</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between text-gray-900 hover:text-gray-900"
          >
            <span>Transaction History</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between text-gray-900 hover:text-gray-900"
          >
            <span>Invite Friends</span>
            <Users className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Demo Reset */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg mb-4 text-gray-900 font-semibold">Demo Tools</h3>
        {showResetConfirm ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              This will clear all app data and return you to onboarding. Are you sure?
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  // Reset all stores
                  resetUserStore();
                  resetBackendStore();
                  clearTransactions();
                  
                  // Clear any additional localStorage/sessionStorage
                  if (typeof window !== 'undefined') {
                    sessionStorage.clear();
                    // Keep only essential items if any
                  }
                  
                  console.log('[Profile] App reset - returning to onboarding');
                  
                  // Reload page to show onboarding
                  window.location.reload();
                }}
              >
                Yes, Reset App
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-between text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300"
            onClick={() => setShowResetConfirm(true)}
          >
            <span className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset App (Demo)
            </span>
          </Button>
        )}
        <p className="text-xs text-gray-500 mt-3">
          Clear all app data to demo onboarding flow again
        </p>
      </div>

      {/* Blockchain Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-xl">
        <p className="text-xs text-blue-900 mb-1">🔗 Powered by SUI Network</p>
        <p className="text-xs text-blue-700">
          Your profile, tokens, and NFTs are stored on-chain. Images stored on Walrus decentralized storage.
        </p>
      </div>
    </div>
  );
}
