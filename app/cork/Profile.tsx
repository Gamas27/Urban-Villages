'use client';

import { Sparkles, Package, Users, Calendar, ExternalLink } from 'lucide-react';
import { MOCK_USER } from './data/mockData';
import { getVillageById } from './data/villages';
import { Button } from '@/components/ui/button';

export function Profile() {
  const village = getVillageById(MOCK_USER.village);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
        {/* Cover with village gradient */}
        <div className={`h-32 bg-gradient-to-r ${village?.gradient || 'from-purple-500 to-purple-700'}`} />
        
        <div className="px-6 pb-6">
          {/* Profile Picture */}
          <div className="flex justify-between items-end -mt-16 mb-4">
            <img
              src={MOCK_USER.profilePicUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <Button
              variant="outline"
              className="border-2"
            >
              Edit Profile
            </Button>
          </div>

          {/* User Info */}
          <h2 className="text-2xl mb-1">{MOCK_USER.username}</h2>
          <p className="text-purple-600 mb-2">@{MOCK_USER.namespace}</p>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4" />
            <span>Joined {formatDate(MOCK_USER.joinedAt)}</span>
          </div>

          {/* Follow Stats */}
          <div className="flex gap-6 mb-4">
            <div>
              <span className="font-semibold text-lg">{MOCK_USER.following}</span>
              <span className="text-gray-600 text-sm ml-1">Following</span>
            </div>
            <div>
              <span className="font-semibold text-lg">{MOCK_USER.followers}</span>
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
          <p className="text-3xl text-green-900">{MOCK_USER.corkBalance}</p>
          <p className="text-xs text-green-600 mt-1">Fungible Tokens</p>
        </div>

        {/* Bottles Owned */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-700">NFT Bottles</span>
          </div>
          <p className="text-3xl text-purple-900">{MOCK_USER.bottlesOwned}</p>
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
