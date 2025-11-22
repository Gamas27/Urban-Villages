/**
 * Enoki Integration for Urban Villages
 * Managed wallet infrastructure with transaction sponsorship
 * 
 * Enoki integrates with @mysten/dapp-kit's WalletProvider
 * Enoki wallets appear as regular wallets in the wallet selector
 * Enables Google login and embedded wallets without extensions
 */

import { registerEnokiWallets, type RegisterEnokiWalletsOptions } from '@mysten/enoki';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

// Enoki configuration
export interface EnokiConfig {
  apiKey: string;
  network: 'testnet' | 'mainnet' | 'devnet';
  googleClientId?: string;
}

// Default Enoki configuration
const DEFAULT_ENOKI_CONFIG: EnokiConfig = {
  apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY || '',
  network: (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet' | 'devnet',
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
};

let enokiInitialized = false;

/**
 * Initialize Enoki wallets
 * This registers Enoki wallets with @mysten/dapp-kit's WalletProvider
 * Call this once when the app loads, before rendering WalletProvider
 */
export function initEnoki(config?: Partial<EnokiConfig>): void {
  if (enokiInitialized) {
    console.warn('Enoki already initialized');
    return;
  }

  const finalConfig = { ...DEFAULT_ENOKI_CONFIG, ...config };

  if (!finalConfig.apiKey) {
    console.warn(
      '⚠️ Enoki API key not found. Set NEXT_PUBLIC_ENOKI_API_KEY in .env.local.\n' +
      '   Wallet connection will still work with regular wallets.\n' +
      '   Sign up at https://enoki.mystenlabs.com to get an API key for embedded wallets.'
    );
    enokiInitialized = true;
    return;
  }

  if (!finalConfig.googleClientId) {
    console.warn(
      '⚠️ Google Client ID not found. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local.\n' +
      '   Enoki will be available but Google login option may not appear.\n' +
      '   Get your Client ID from: https://console.cloud.google.com/apis/credentials'
    );
  }

  try {
    // Create SuiClient for the network
    const suiClient = new SuiClient({
      url: getFullnodeUrl(finalConfig.network),
    });

    // Register Enoki wallets
    // This makes Enoki wallets available in the wallet selector
    const providers = finalConfig.googleClientId
      ? {
          google: {
            clientId: finalConfig.googleClientId,
          },
        }
      : undefined;

    console.log('🔧 Enoki config:', {
      network: finalConfig.network,
      hasApiKey: !!finalConfig.apiKey,
      apiKeyPrefix: finalConfig.apiKey ? `${finalConfig.apiKey.substring(0, 20)}...` : 'not set',
      hasGoogleClientId: !!finalConfig.googleClientId,
      googleClientId: finalConfig.googleClientId ? `${finalConfig.googleClientId.substring(0, 20)}...` : 'not set',
    });
    
    if (!finalConfig.googleClientId) {
      console.error('❌ Google Client ID is missing! This will cause 400 errors.');
    }

    registerEnokiWallets({
      client: suiClient,
      network: finalConfig.network,
      apiKey: finalConfig.apiKey,
      providers,
    });

    enokiInitialized = true;
    console.log('✅ Enoki initialized successfully');
    
    if (!finalConfig.googleClientId) {
      console.warn(
        '⚠️ Google Client ID not configured. Google login will not be available.\n' +
        '   Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local and restart the server.'
      );
    }
  } catch (error) {
    console.error('❌ Failed to initialize Enoki:', error);
    // Don't throw - allow app to continue with regular wallets
    console.warn('⚠️ Enoki initialization failed - regular wallets will still work');
  }
}

/**
 * Get Enoki configuration
 */
export function getEnokiConfig(): EnokiConfig {
  return { ...DEFAULT_ENOKI_CONFIG };
}

/**
 * Check if Enoki is available (API key configured)
 */
export function isEnokiAvailable(): boolean {
  return !!DEFAULT_ENOKI_CONFIG.apiKey && enokiInitialized;
}

/**
 * Check if current account is an Enoki wallet
 * Useful for showing different UI or using gas sponsorship
 */
export function isEnokiWallet(address: string): boolean {
  // Enoki wallets can be identified by their address pattern
  // Or we can check wallet metadata if available
  // For now, this is a placeholder - we'll enhance it as needed
  return false;
}

