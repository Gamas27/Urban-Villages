/**
 * Store Exports
 * 
 * Centralized export point for all Zustand stores
 */

// User store
export {
  useUserStore,
  useUserProfile,
  useUserNamespace,
  useUserVillage,
  useUserUsername,
  useUserLoading,
  useUserError,
  type UserProfile,
  type UserStore,
} from './userStore';

// Blockchain store
export {
  useBlockchainStore,
  useCorkBalance,
  useCorkBalanceLoading,
  useOwnedNFTs,
  useNFTsLoading,
  useTransactions,
  usePendingTransactions,
  type NFTBottle,
  type TransactionState,
  type BlockchainStore,
} from './blockchainStore';

// Backend store
export {
  useBackendStore,
  useBackendProfile,
  useBackendSyncing,
  useBackendSyncError,
  type BackendProfile,
  type BackendStore,
} from './backendStore';

