// Dynamic import for WalrusClient to avoid SSR issues with WASM
// Walrus uses WebAssembly which only works in the browser

export interface WalrusServiceConfig {
  network: 'testnet' | 'mainnet';
  epochs: number;
}

/**
 * Creates a Walrus client for file uploads
 * Network: testnet
 * Storage duration: 10 epochs (~30 days on testnet)
 * 
 * Note: This must be called client-side only (WASM doesn't work in SSR)
 */
export async function createWalrusService(
  config: WalrusServiceConfig = { network: 'testnet', epochs: 10 },
  suiClient?: any
) {
  // Dynamic import to avoid SSR issues
  if (typeof window === 'undefined') {
    throw new Error('WalrusClient can only be used client-side');
  }
  
  const { WalrusClient, WalrusFile } = await import('@mysten/walrus');
  
  const network = config.network === 'mainnet' ? 'mainnet' : 'testnet';
  
  // Explicitly set RPC URL to avoid connection issues
  // Use the format that works with curl (without :443 port)
  const rpcUrl = process.env.NEXT_PUBLIC_SUI_RPC_URL || 
    (network === 'testnet' 
      ? 'https://fullnode.testnet.sui.io' 
      : 'https://fullnode.mainnet.sui.io');
  
  const clientConfig: any = {
    network: config.network,
    suiRpcUrl: rpcUrl,
    // Use upload relay for browser-based operations (as recommended by Walrus docs)
    // This helps with resource consumption and ensures successful uploads
    uploadRelayUrl: network === 'testnet'
      ? 'https://upload-relay.testnet.walrus.space'
      : 'https://upload-relay.mainnet.walrus.space',
  };
  
  const client = new WalrusClient(clientConfig);
  
  return client;
}

/**
 * Export WalrusFile for use in hooks
 */
export async function getWalrusFile() {
  const { WalrusFile } = await import('@mysten/walrus');
  return WalrusFile;
}

/**
 * Get the public URL for a Walrus blob
 */
export function getWalrusUrl(blobId: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  const aggregator = network === 'testnet' 
    ? 'https://aggregator.walrus-testnet.walrus.space'
    : 'https://aggregator.walrus.walrus.space';
  
  return `${aggregator}/v1/${blobId}`;
}

/**
 * Get WalrusCan explorer URL
 */
export function getWalrusScanUrl(blobId: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  return `https://walruscan.com/${network}/blob/${blobId}`;
}
