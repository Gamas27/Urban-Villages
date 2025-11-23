/**
 * Backend Store - Manages backend sync state and data
 * 
 * Features:
 * - Backend profile sync
 * - Post state caching
 * - Sync status tracking
 * - Optimistic updates
 */

import { create } from 'zustand';
import { getUserProfile, saveUserProfile as saveProfileToBackend } from '../api/userTracking';

export interface BackendProfile {
  id?: string;
  walletAddress: string;
  username?: string;
  village?: string;
  namespaceId?: string;
  profilePicBlobId?: string;
  onboardingCompletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BackendState {
  // Backend profile data
  backendProfile: BackendProfile | null;
  
  // Sync status
  syncing: boolean;
  lastSync: number | null;
  syncError: string | null;

  // Cache duration (1 minute)
  cacheDuration: number;
}

interface BackendActions {
  // Profile sync
  fetchBackendProfile: (walletAddress: string) => Promise<BackendProfile | null>;
  syncProfile: (profile: Partial<BackendProfile>) => Promise<void>;
  setBackendProfile: (profile: BackendProfile | null) => void;
  clearBackendProfile: () => void;

  // Reset
  reset: () => void;
}

export type BackendStore = BackendState & BackendActions;

const CACHE_DURATION = 60 * 1000; // 1 minute

const initialState: BackendState = {
  backendProfile: null,
  syncing: false,
  lastSync: null,
  syncError: null,
  cacheDuration: CACHE_DURATION,
};

export const useBackendStore = create<BackendStore>((set, get) => ({
  ...initialState,

  // Fetch backend profile
  fetchBackendProfile: async (walletAddress: string) => {
    const state = get();
    
    // Check cache
    if (state.lastSync && Date.now() - state.lastSync < state.cacheDuration) {
      return state.backendProfile; // Use cached value
    }

    set({ syncing: true, syncError: null });

    try {
      const profile = await getUserProfile(walletAddress);
      
      if (profile) {
        const backendProfile: BackendProfile = {
          id: profile.id,
          walletAddress: profile.wallet_address,
          username: profile.username || undefined,
          village: profile.village || undefined,
          namespaceId: profile.namespace_id || undefined,
          profilePicBlobId: profile.profile_pic_blob_id || undefined,
          onboardingCompletedAt: profile.onboarding_completed_at || undefined,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
        };

        set({
          backendProfile,
          syncing: false,
          lastSync: Date.now(),
          syncError: null,
        });

        return backendProfile;
      }

      set({
        backendProfile: null,
        syncing: false,
        lastSync: Date.now(),
        syncError: null,
      });

      return null;
    } catch (error) {
      set({
        syncing: false,
        syncError: error instanceof Error ? error.message : 'Failed to fetch profile',
      });
      return null;
    }
  },

  // Sync profile to backend
  syncProfile: async (profile: Partial<BackendProfile>) => {
    if (!profile.walletAddress) {
      throw new Error('Wallet address is required');
    }

    set({ syncing: true, syncError: null });

    try {
      const result = await saveProfileToBackend({
        walletAddress: profile.walletAddress,
        username: profile.username,
        village: profile.village,
        namespaceId: profile.namespaceId,
        profilePicBlobId: profile.profilePicBlobId,
        onboardingCompleted: !!profile.onboardingCompletedAt,
      });

      if (result?.data) {
        const backendProfile: BackendProfile = {
          id: result.data.id,
          walletAddress: result.data.wallet_address,
          username: result.data.username || undefined,
          village: result.data.village || undefined,
          namespaceId: result.data.namespace_id || undefined,
          profilePicBlobId: result.data.profile_pic_blob_id || undefined,
          onboardingCompletedAt: result.data.onboarding_completed_at || undefined,
          createdAt: result.data.created_at,
          updatedAt: result.data.updated_at,
        };

        set({
          backendProfile,
          syncing: false,
          lastSync: Date.now(),
          syncError: null,
        });
      }
    } catch (error) {
      set({
        syncing: false,
        syncError: error instanceof Error ? error.message : 'Failed to sync profile',
      });
      throw error;
    }
  },

  setBackendProfile: (profile: BackendProfile | null) => {
    set({
      backendProfile: profile,
      lastSync: Date.now(),
      syncError: null,
    });
  },

  clearBackendProfile: () => {
    set({
      backendProfile: null,
      lastSync: null,
      syncError: null,
    });
  },

  // Reset
  reset: () => {
    set(initialState);
  },
}));

/**
 * Selector Hooks
 */

export const useBackendProfile = () => useBackendStore((state) => state.backendProfile);
export const useBackendSyncing = () => useBackendStore((state) => state.syncing);
export const useBackendSyncError = () => useBackendStore((state) => state.syncError);

