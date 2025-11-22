'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { UrbanVillages } from './components/UrbanVillages';

// Query client for React Query
const queryClient = new QueryClient();

// SUI network configuration for wallets
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider 
          autoConnect={true}
          preferredWallets={['Sui Wallet']}
        >
          <UrbanVillages />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}