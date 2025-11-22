import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import CorkApp from './app/cork/CorkApp';

// Query client for React Query
const queryClient = new QueryClient();

// SUI network configuration for zkLogin
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
          <CorkApp />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}