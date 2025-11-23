'use client';

import { useState } from 'react';
import { Home, ShoppingBag, PlusCircle, User, MapPin, Package, Users } from 'lucide-react';
import { Feed } from './Feed';
import { Shop } from './Shop';
import { Profile } from './Profile';
import { Collection } from './Collection';
import { Friends } from './Friends';
import { PostComposer } from './PostComposer';
import { VillageSwitch } from './VillageSwitch';
import { getVillageById } from './data/villages';
import { useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useUserProfile, useUserNamespace, useUserVillage } from '@/lib/stores/userStore';
import { useBlockchainStore, useBackendStore } from '@/lib/stores';

type Tab = 'feed' | 'shop' | 'friends' | 'collection' | 'post' | 'profile';

export function MainApp() {
  const account = useCurrentAccount();
  const profile = useUserProfile();
  const namespace = useUserNamespace();
  const userVillage = useUserVillage();
  
  // Get stores for blockchain and backend sync
  const { refreshAll } = useBlockchainStore();
  const { fetchBackendProfile } = useBackendStore();
  
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [showVillageSwitch, setShowVillageSwitch] = useState(false);
  const [showPostComposer, setShowPostComposer] = useState(false);
  const [currentVillage, setCurrentVillage] = useState(userVillage || 'lisbon');

  const village = getVillageById(currentVillage);

  // Load blockchain state and backend profile on mount
  useEffect(() => {
    if (!account?.address) return;

    // Fetch blockchain state (CORK balance, NFTs)
    refreshAll(account.address).catch((err) => {
      console.error('Failed to refresh blockchain state:', err);
    });

    // Fetch backend profile
    fetchBackendProfile(account.address).catch((err) => {
      console.error('Failed to fetch backend profile:', err);
    });
  }, [account?.address, refreshAll, fetchBackendProfile]);


  const handlePost = () => {
    setShowPostComposer(false);
    setActiveTab('feed');
    // Trigger feed refresh by dispatching a custom event
    window.dispatchEvent(new Event('postCreated'));
  };

  // Listen for purchase completion to navigate to collection
  useEffect(() => {
    const handlePurchaseComplete = () => {
      // Collection will auto-refresh via purchaseComplete event
    };

    const handleNavigateToCollection = () => {
      setActiveTab('collection');
    };

    window.addEventListener('purchaseComplete', handlePurchaseComplete);
    window.addEventListener('navigateToCollection', handleNavigateToCollection);
    
    return () => {
      window.removeEventListener('purchaseComplete', handlePurchaseComplete);
      window.removeEventListener('navigateToCollection', handleNavigateToCollection);
    };
  }, []);

  if (showPostComposer) {
    return (
      <PostComposer
        onClose={() => setShowPostComposer(false)}
        onPost={handlePost}
      />
    );
  }

  if (showVillageSwitch) {
    return (
      <VillageSwitch
        currentVillage={currentVillage}
        onSelect={(villageId) => {
          setCurrentVillage(villageId);
          setShowVillageSwitch(false);
          setActiveTab('feed');
        }}
        onClose={() => setShowVillageSwitch(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-r ${village?.gradient || 'from-purple-500 to-purple-700'} text-white p-4 sticky top-0 z-10 shadow-lg`}>
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur rounded-full flex items-center justify-center text-2xl">
              {village?.emoji || '🍷'}
            </div>
            <div>
              <h1 className="text-xl">Urban Villages</h1>
              <p className="text-xs opacity-90">@{namespace || 'user'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVillageSwitch(true)}
              className="flex items-center gap-2 bg-black bg-opacity-20 backdrop-blur px-4 py-2 rounded-full hover:bg-opacity-30 transition-all border border-white border-opacity-20"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{village?.name || 'Village'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'feed' && <Feed village={currentVillage} />}
        {activeTab === 'shop' && <Shop village={currentVillage} />}
        {activeTab === 'friends' && <Friends village={currentVillage} />}
        {activeTab === 'collection' && <Collection village={currentVillage} />}
        {activeTab === 'profile' && <Profile />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="max-w-2xl mx-auto flex items-center justify-around px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center justify-center gap-1 p-3 min-w-[64px] transition-colors duration-200 ${
              activeTab === 'feed'
                ? 'text-purple-600'
                : 'text-gray-500'
            }`}
          >
            <Home className={`w-6 h-6 transition-all duration-200 ${activeTab === 'feed' ? 'fill-purple-600' : ''}`} />
            <span className={`text-[10px] ${activeTab === 'feed' ? 'font-semibold' : 'font-medium'}`}>Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center justify-center gap-1 p-3 min-w-[64px] transition-colors duration-200 ${
              activeTab === 'shop'
                ? 'text-purple-600'
                : 'text-gray-500'
            }`}
          >
            <ShoppingBag className={`w-6 h-6 transition-all duration-200 ${activeTab === 'shop' ? 'fill-purple-600' : ''}`} />
            <span className={`text-[10px] ${activeTab === 'shop' ? 'font-semibold' : 'font-medium'}`}>Shop</span>
          </button>

          <button
            onClick={() => setShowPostComposer(true)}
            className="flex items-center justify-center w-14 h-14 -mt-7 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-full shadow-[0_8px_16px_rgba(168,85,247,0.4)] hover:shadow-[0_12px_20px_rgba(168,85,247,0.5)] transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-7 h-7" strokeWidth={2} />
          </button>

          <button
            onClick={() => setActiveTab('collection')}
            className={`flex flex-col items-center justify-center gap-1 p-3 min-w-[64px] transition-colors duration-200 ${
              activeTab === 'collection'
                ? 'text-purple-600'
                : 'text-gray-500'
            }`}
          >
            <Package className={`w-6 h-6 transition-all duration-200 ${activeTab === 'collection' ? 'fill-purple-600' : ''}`} />
            <span className={`text-[10px] ${activeTab === 'collection' ? 'font-semibold' : 'font-medium'}`}>Collection</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center gap-1 p-3 min-w-[64px] transition-colors duration-200 ${
              activeTab === 'profile'
                ? 'text-purple-600'
                : 'text-gray-500'
            }`}
          >
            <User className={`w-6 h-6 transition-all duration-200 ${activeTab === 'profile' ? 'fill-purple-600' : ''}`} />
            <span className={`text-[10px] ${activeTab === 'profile' ? 'font-semibold' : 'font-medium'}`}>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}