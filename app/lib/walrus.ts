import { WalrusClient } from '@mysten/walrus';

export interface WalrusServiceConfig {
  network: 'testnet' | 'mainnet';
  epochs: number;
}

/**
 * Creates a Walrus client for file uploads
 * Network: testnet
 * Storage duration: 10 epochs (~30 days on testnet)
 */
export function createWalrusService(config: WalrusServiceConfig = { network: 'testnet', epochs: 10 }) {
  return new WalrusClient({
    network: config.network,
  });
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
