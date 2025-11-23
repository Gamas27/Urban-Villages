/**
 * Blockchain Store - Manages blockchain state (CORK tokens, NFTs, transactions)
 * 
 * Features:
 * - CORK token balance caching
 * - NFT ownership tracking
 * - Transaction state management
 * - Automatic refresh
 * - Backend sync integration
 */

import { create } from 'zustand';
import { getCorkBalance } from '../cork-token';
import { getOwnedBottles } from '../bottle-nft';

export interface NFTBottle {
  id: string;
  objectId: string;
  name: string;
  vintage: number;
  region: string;
  winery: string;
  wineType: string;
  bottleNumber: number;
  village: string;
  imageUrl?: string;
  imageBlobId?: string;
  qrCode: string;
  mintDate: number;
}

export interface TransactionState {
  id: string;
  type: 'purchase' | 'mint_nft' | 'mint_token' | 'namespace_claim' | 'post_created' | 'transfer';
  status: 'pending' | 'success' | 'failed';
  digest?: string;
  error?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface BlockchainState {
  // CORK token balance
  corkBalance: number;
  corkBalanceLoading: boolean;
  corkBalanceError: string | null;
  lastBalanceFetch: number | null;

  // NFT ownership
  ownedNFTs: NFTBottle[];
  nftsLoading: boolean;
  nftsError: string | null;
  lastNFTsFetch: number | null;

  // Transaction states
  transactions: TransactionState[];
  
  // Cache duration (30 seconds)
  cacheDuration: number;
}

interface BlockchainActions {
  // CORK balance actions
  fetchCorkBalance: (address: string) => Promise<void>;
  setCorkBalance: (balance: number) => void;
  clearCorkBalance: () => void;

  // NFT actions
  fetchOwnedNFTs: (address: string) => Promise<void>;
  setOwnedNFTs: (nfts: NFTBottle[]) => void;
  addNFT: (nft: NFTBottle) => void;
  removeNFT: (nftId: string) => void;
  clearNFTs: () => void;

  // Transaction actions
  addTransaction: (tx: Omit<TransactionState, 'id' | 'timestamp'>) => string;
  updateTransaction: (id: string, updates: Partial<TransactionState>) => void;
  removeTransaction: (id: string) => void;
  clearTransactions: () => void;

  // Refresh all
  refreshAll: (address: string) => Promise<void>;
  
  // Reset
  reset: () => void;
}

export type BlockchainStore = BlockchainState & BlockchainActions;

const CACHE_DURATION = 30 * 1000; // 30 seconds

const initialState: BlockchainState = {
  corkBalance: 0,
  corkBalanceLoading: false,
  corkBalanceError: null,
  lastBalanceFetch: null,

  ownedNFTs: [],
  nftsLoading: false,
  nftsError: null,
  lastNFTsFetch: null,

  transactions: [],
  cacheDuration: CACHE_DURATION,
};

export const useBlockchainStore = create<BlockchainStore>((set, get) => ({
  ...initialState,

  // CORK balance actions
  fetchCorkBalance: async (address: string) => {
    const state = get();
    
    // Check cache
    if (state.lastBalanceFetch && Date.now() - state.lastBalanceFetch < state.cacheDuration) {
      return; // Use cached value
    }

    set({ corkBalanceLoading: true, corkBalanceError: null });

    try {
      const balance = await getCorkBalance(address);
      set({
        corkBalance: balance,
        corkBalanceLoading: false,
        lastBalanceFetch: Date.now(),
        corkBalanceError: null,
      });
    } catch (error) {
      set({
        corkBalanceLoading: false,
        corkBalanceError: error instanceof Error ? error.message : 'Failed to fetch balance',
      });
    }
  },

  setCorkBalance: (balance: number) => {
    set({
      corkBalance: balance,
      lastBalanceFetch: Date.now(),
      corkBalanceError: null,
    });
  },

  clearCorkBalance: () => {
    set({
      corkBalance: 0,
      lastBalanceFetch: null,
      corkBalanceError: null,
    });
  },

  // NFT actions
  fetchOwnedNFTs: async (address: string) => {
    const state = get();
    
    // Check cache
    if (state.lastNFTsFetch && Date.now() - state.lastNFTsFetch < state.cacheDuration) {
      return; // Use cached value
    }

    set({ nftsLoading: true, nftsError: null });

    try {
      const nfts = await getOwnedBottles(address);
      
      // Transform to NFTBottle format
      const transformedNFTs: NFTBottle[] = nfts.map((nft: any) => ({
        id: nft.objectId || nft.id,
        objectId: nft.objectId || nft.id,
        name: nft.name || nft.wine_name || 'Unknown Wine',
        vintage: nft.vintage || 0,
        region: nft.region || '',
        winery: nft.winery || '',
        wineType: nft.wine_type || nft.wineType || '',
        bottleNumber: nft.bottle_number || nft.bottleNumber || 0,
        village: nft.village || '',
        imageUrl: nft.image_url || nft.imageUrl,
        imageBlobId: nft.image_blob_id || nft.imageBlobId,
        qrCode: nft.qr_code || nft.qrCode || '',
        mintDate: nft.mint_date || nft.mintDate || Date.now(),
      }));

      set({
        ownedNFTs: transformedNFTs,
        nftsLoading: false,
        lastNFTsFetch: Date.now(),
        nftsError: null,
      });
    } catch (error) {
      set({
        nftsLoading: false,
        nftsError: error instanceof Error ? error.message : 'Failed to fetch NFTs',
      });
    }
  },

  setOwnedNFTs: (nfts: NFTBottle[]) => {
    set({
      ownedNFTs: nfts,
      lastNFTsFetch: Date.now(),
      nftsError: null,
    });
  },

  addNFT: (nft: NFTBottle) => {
    const state = get();
    // Check if NFT already exists
    if (state.ownedNFTs.find((existing) => existing.objectId === nft.objectId)) {
      return;
    }
    set({
      ownedNFTs: [nft, ...state.ownedNFTs],
      lastNFTsFetch: Date.now(),
    });
  },

  removeNFT: (nftId: string) => {
    const state = get();
    set({
      ownedNFTs: state.ownedNFTs.filter((nft) => nft.objectId !== nftId && nft.id !== nftId),
      lastNFTsFetch: Date.now(),
    });
  },

  clearNFTs: () => {
    set({
      ownedNFTs: [],
      lastNFTsFetch: null,
      nftsError: null,
    });
  },

  // Transaction actions
  addTransaction: (tx) => {
    const id = `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const newTx: TransactionState = {
      ...tx,
      id,
      timestamp: Date.now(),
    };

    set((state) => ({
      transactions: [newTx, ...state.transactions].slice(0, 50), // Keep last 50 transactions
    }));

    return id;
  },

  updateTransaction: (id: string, updates: Partial<TransactionState>) => {
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      ),
    }));
  },

  removeTransaction: (id: string) => {
    set((state) => ({
      transactions: state.transactions.filter((tx) => tx.id !== id),
    }));
  },

  clearTransactions: () => {
    set({ transactions: [] });
  },

  // Refresh all
  refreshAll: async (address: string) => {
    await Promise.all([
      get().fetchCorkBalance(address),
      get().fetchOwnedNFTs(address),
    ]);
  },

  // Reset
  reset: () => {
    set(initialState);
  },
}));

/**
 * Selector Hooks
 */

export const useCorkBalance = () => useBlockchainStore((state) => state.corkBalance);
export const useCorkBalanceLoading = () => useBlockchainStore((state) => state.corkBalanceLoading);
export const useOwnedNFTs = () => useBlockchainStore((state) => state.ownedNFTs);
export const useNFTsLoading = () => useBlockchainStore((state) => state.nftsLoading);
export const useTransactions = () => useBlockchainStore((state) => state.transactions);
export const usePendingTransactions = () => useBlockchainStore((state) => 
  state.transactions.filter((tx) => tx.status === 'pending')
);

