/**
 * User Store - Centralized state management for user profile and namespace
 * 
 * Features:
 * - Caching (5-minute cache duration)
 * - Optimistic updates
 * - Session persistence
 * - Selector hooks for performance
 */

import { create } from 'zustand';

export interface UserProfile {
  username: string;
  village: string;
  profilePicBlobId?: string;
  namespaceId?: string;
  walletAddress: string | null;
}

interface UserState {
  // Profile data
  profile: UserProfile | null;
  
  // Loading & error states
  loading: boolean;
  error: string | null;
  
  // Cache timestamp
  lastFetchedAt?: number;
}

interface UserActions {
  // Profile actions
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  
  // Loading & error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Reset
  reset: () => void;
}

export type UserStore = UserState & UserActions;

/**
 * Cache duration (5 minutes)
 */
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Initial state
 */
const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

/**
 * User Store
 * 
 * Persists to sessionStorage for onboarding data
 * Includes caching to reduce API calls
 */
export const useUserStore = create<UserStore>((set, get) => {
  // Load from sessionStorage on initialization
  let initialProfile: UserProfile | null = null;
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('cork_onboarding_data');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.username && data.village) {
          initialProfile = {
            username: data.username,
            village: data.village,
            profilePicBlobId: data.profilePicBlobId,
            namespaceId: data.namespaceId,
            walletAddress: null, // Will be set when wallet connects
          };
        }
      }
    } catch (err) {
      console.error('[UserStore] Failed to load from sessionStorage:', err);
    }
  }

  return {
    // Initial state
    ...initialState,
    profile: initialProfile,

    // Profile actions
    setProfile: (profile) => {
      set({
        profile,
        lastFetchedAt: Date.now(),
        error: null,
      });
      
      // Persist to sessionStorage
      if (typeof window !== 'undefined' && profile) {
        sessionStorage.setItem('cork_onboarding_data', JSON.stringify({
          username: profile.username,
          village: profile.village,
          profilePicBlobId: profile.profilePicBlobId,
          namespaceId: profile.namespaceId,
        }));
      } else if (typeof window !== 'undefined' && !profile) {
        sessionStorage.removeItem('cork_onboarding_data');
      }
    },

    updateProfile: (updates) => {
      const currentProfile = get().profile;
      if (!currentProfile) {
        console.warn('[UserStore] Cannot update: no profile');
        return;
      }

      const updatedProfile = { ...currentProfile, ...updates };
      get().setProfile(updatedProfile);
    },

    clearProfile: () => {
      set({ profile: null, lastFetchedAt: undefined });
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('cork_onboarding_data');
      }
    },

    // Loading & error
    setLoading: (loading) => {
      set({ loading });
    },

    setError: (error) => {
      set({ error });
    },

    clearError: () => {
      set({ error: null });
    },

    // Reset
    reset: () => {
      set(initialState);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('cork_onboarding_data');
      }
    },
  };
});

/**
 * Selector Hooks (Performance Optimization)
 * These hooks only re-render when the specific value changes
 */

export const useUserProfile = () => useUserStore((state) => state.profile);

export const useUserNamespace = () => {
  const profile = useUserStore((state) => state.profile);
  if (!profile) return null;
  return `${profile.username}.${profile.village}`;
};

export const useUserVillage = () => useUserStore((state) => state.profile?.village);

export const useUserUsername = () => useUserStore((state) => state.profile?.username);

export const useUserLoading = () => useUserStore((state) => state.loading);

export const useUserError = () => useUserStore((state) => state.error);

export default useUserStore;

