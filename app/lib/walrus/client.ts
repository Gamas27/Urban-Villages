/**
 * Singleton Walrus Client Manager
 * 
 * Creates and reuses a single Walrus client instance across the entire app
 * This prevents creating multiple clients and improves performance
 */

let walrusClientInstance: any = null;
let initializationPromise: Promise<any> | null = null;
let isInitializing = false;

export interface WalrusClientConfig {
  network: 'testnet' | 'mainnet';
  epochs: number;
}

/**
 * Get or create the singleton Walrus client
 * Thread-safe: multiple calls return the same instance
 */
export async function getWalrusClient(
  config: WalrusClientConfig = { network: 'testnet', epochs: 10 }
): Promise<any> {
  // Return existing instance if available
  if (walrusClientInstance) {
    return walrusClientInstance;
  }

  // If already initializing, wait for that promise
  if (isInitializing && initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  isInitializing = true;
  initializationPromise = (async () => {
    try {
      const { createWalrusService } = await import('../walrus');
      const client = await createWalrusService(config);
      walrusClientInstance = client;
      isInitializing = false;
      return client;
    } catch (error) {
      isInitializing = false;
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

/**
 * Reset the singleton (useful for testing or re-initialization)
 */
export function resetWalrusClient(): void {
  walrusClientInstance = null;
  initializationPromise = null;
  isInitializing = false;
}

/**
 * Check if client is initialized
 */
export function isWalrusClientReady(): boolean {
  return walrusClientInstance !== null;
}

