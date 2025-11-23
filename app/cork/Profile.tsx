'use client';

import { Sparkles, Package, Users, Calendar, ExternalLink } from 'lucide-react';
import { getVillageById } from './data/villages';
import { Button } from '@/components/ui/button';
import { useUserProfile, useUserNamespace, useUserVillage } from '@/lib/stores/userStore';
import { useBackendProfile, useBackendStore } from '@/lib/stores/backendStore';
import { WalrusImage } from '@/components/WalrusImage';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { useMemo, useEffect } from 'react';

export function Profile() {
  const profile = useUserProfile();
  const namespace = useUserNamespace();
  const userVillage = useUserVillage();
  const account = useCurrentAccount();
  const backendProfile = useBackendProfile();
  const { fetchBackendProfile } = useBackendStore();
  
  // Fetch backend profile when wallet is connected
  useEffect(() => {
    if (account?.address) {
      fetchBackendProfile(account.address);
    }
  }, [account?.address, fetchBackendProfile]);
  
  // Merge backend profile with userStore profile (backend takes precedence for profilePicBlobId)
  const mergedProfile = useMemo(() => {
    if (!profile) return null;
    
    return {
      ...profile,
      // Use backend profilePicBlobId if available (more up-to-date)
      profilePicBlobId: backendProfile?.profilePicBlobId || profile.profilePicBlobId,
    };
  }, [profile, backendProfile]);
  
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
      <div className="min-h-screen p-4 pb-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No profile found. Please complete onboarding.</p>
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
    <div className="min-h-screen p-4 pb-24">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
        {/* Cover with village gradient */}
        <div className={`h-32 bg-gradient-to-r ${village?.gradient || 'from-purple-500 to-purple-700'}`} />
        
        <div className="px-6 pb-6">
          {/* Profile Picture */}
          <div className="flex justify-between items-end -mt-16 mb-4">
            {mergedProfile.profilePicBlobId ? (
              <WalrusImage
                blobId={mergedProfile.profilePicBlobId}
                alt={mergedProfile.username}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                type="profile"
                initial={mergedProfile.username[0].toUpperCase()}
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-3xl font-bold text-white">
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
          <h2 className="text-2xl mb-1">{mergedProfile.username}</h2>
          <p className="text-purple-600 mb-2">@{namespace || 'user'}</p>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4" />
            <span>Joined {formatDate(joinedDate)}</span>
          </div>

          {/* Follow Stats - Placeholder for future social features */}
          <div className="flex gap-6 mb-4">
            <div>
              <span className="font-semibold text-lg">0</span>
              <span className="text-gray-600 text-sm ml-1">Following</span>
            </div>
            <div>
              <span className="font-semibold text-lg">0</span>
              <span className="text-gray-600 text-sm ml-1">Followers</span>
            </div>
          </div>

          {/* Village Badge */}
          {village && (
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl inline-flex">
              <span className="text-2xl">{village.emoji}</span>
              <span className="font-semibold">{village.name} Village</span>
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
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            {village.name} Village Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl">{village.members}</p>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
            <div>
              <p className="text-2xl">€{village.treasury.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Village Treasury</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <span>View My NFT Bottles</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <span>Transaction History</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <span>Invite Friends</span>
            <Users className="w-4 h-4" />
          </Button>
        </div>
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
