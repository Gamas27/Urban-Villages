/**
 * Namespace Service for Urban Villages
 * Handles username.village namespace registration and queries
 * Uses Enoki wallets via dapp-kit hooks
 */

import { Transaction } from '@mysten/sui/transactions';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

// TODO: Replace with actual package ID and registry ID after deploying namespace contract
const NAMESPACE_PACKAGE_ID = process.env.NEXT_PUBLIC_NAMESPACE_PACKAGE_ID || '0x0';
const NAMESPACE_REGISTRY_ID = process.env.NEXT_PUBLIC_NAMESPACE_REGISTRY_ID || '0x0';

const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet' | 'devnet';

// Create SuiClient instance for queries
const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
});

/**
 * Format namespace string: username.village
 */
export function formatNamespace(username: string, village: string): string {
  return `${username}.${village}`;
}

/**
 * Parse namespace string into username and village
 */
export function parseNamespace(namespace: string): { username: string; village: string } | null {
  const parts = namespace.split('.');
  if (parts.length !== 2) return null;
  return { username: parts[0], village: parts[1] };
}

/**
 * Check if a namespace is available for registration
 * 
 * @param username - Username (alphanumeric, lowercase)
 * @param village - Village ID (e.g., 'lisbon', 'porto')
 * @returns true if namespace is available, false if taken
 */
export async function checkNamespaceAvailability(
  username: string,
  village: string
): Promise<boolean> {
  try {
    // TODO: Once namespace contract is deployed, query the registry
    // For now, return true (available) as placeholder
    
    if (!NAMESPACE_REGISTRY_ID || NAMESPACE_REGISTRY_ID === '0x0') {
      // Contract not deployed yet - allow all namespaces
      return true;
    }

    // Query registry to check if namespace exists
    // const namespaceStr = formatNamespace(username, village);
    // const registry = await suiClient.getObject({
    //   id: NAMESPACE_REGISTRY_ID,
    //   options: { showContent: true },
    // });
    // 
    // // Check if namespace exists in registry
    // // Implementation depends on contract structure
    // return !namespaceExists;

    return true; // Placeholder
  } catch (error) {
    console.error('Error checking namespace availability:', error);
    return false;
  }
}

/**
 * Register a namespace on-chain (using regular transaction signing)
 * 
 * @param username - Username (alphanumeric, lowercase)
 * @param village - Village ID (e.g., 'lisbon', 'porto')
 * @param profilePicBlobId - Walrus blob ID for profile picture (optional)
 * @param signAndExecute - Transaction signing function from dapp-kit
 * @returns Transaction digest
 */
export async function registerNamespace(
  username: string,
  village: string,
  profilePicBlobId: string | undefined,
  signAndExecute: (params: { transaction: Transaction }) => Promise<{ digest: string }>
): Promise<string> {
  // Validate inputs
  if (!username || !village) {
    throw new Error('Username and village are required');
  }

  if (username.length < 3 || username.length > 20) {
    throw new Error('Username must be between 3 and 20 characters');
  }

  // Validate username format (alphanumeric only)
  if (!/^[a-z0-9]+$/.test(username)) {
    throw new Error('Username must contain only lowercase letters and numbers');
  }

  // Check availability first
  const isAvailable = await checkNamespaceAvailability(username, village);
  if (!isAvailable) {
    throw new Error(`Namespace ${formatNamespace(username, village)} is already taken`);
  }

  // Create transaction
  const tx = new Transaction();

  // TODO: Once namespace contract is deployed, use actual contract call
  if (!NAMESPACE_PACKAGE_ID || NAMESPACE_PACKAGE_ID === '0x0') {
    // Contract not deployed yet - throw error
    throw new Error(
      'Namespace contract not deployed yet. ' +
      'Set NEXT_PUBLIC_NAMESPACE_PACKAGE_ID and NEXT_PUBLIC_NAMESPACE_REGISTRY_ID in .env.local'
    );
  }

  // Format namespace string: username.village
  const namespaceStr = formatNamespace(username, village);

  // Convert strings to bytes for Move contract
  // Move expects vector<u8>, but dapp-kit's tx.pure.string() handles this
  tx.moveCall({
    target: `${NAMESPACE_PACKAGE_ID}::namespace::register`,
    arguments: [
      tx.object(NAMESPACE_REGISTRY_ID),           // Registry
      tx.pure.string(namespaceStr),               // Full namespace: "username.village"
      tx.pure.string(username),                   // Username
      tx.pure.string(village),                    // Village
      tx.pure.string(profilePicBlobId || ''),     // Profile pic blob ID
      tx.object('0x6'),                           // Clock object (standard Sui system object)
    ],
  });

  // Execute transaction (user pays gas)
  const result = await signAndExecute({ transaction: tx });
  return result.digest;
}

/**
 * Resolve a namespace to owner address
 * 
 * @param namespace - Namespace string (e.g., 'username.village')
 * @returns Owner address if namespace exists, null otherwise
 */
export async function resolveNamespace(namespace: string): Promise<string | null> {
  try {
    const parsed = parseNamespace(namespace);
    if (!parsed) {
      return null;
    }

    // TODO: Once namespace contract is deployed, query on-chain
    // For now, return null as placeholder
    
    if (!NAMESPACE_REGISTRY_ID || NAMESPACE_REGISTRY_ID === '0x0') {
      return null;
    }

    // Query registry for namespace owner
    // const registry = await suiClient.getObject({
    //   id: NAMESPACE_REGISTRY_ID,
    //   options: { showContent: true },
    // });
    // 
    // // Extract owner from namespace object
    // // Implementation depends on contract structure
    // return ownerAddress || null;

    return null; // Placeholder
  } catch (error) {
    console.error('Error resolving namespace:', error);
    return null;
  }
}

/**
 * Get namespace metadata (owner, profilePicBlobId, etc.)
 * 
 * @param namespace - Namespace string (e.g., 'username.village')
 * @returns Namespace metadata or null if not found
 */
export async function getNamespaceMetadata(namespace: string): Promise<{
  username: string;
  village: string;
  owner: string;
  profilePicBlobId?: string;
  createdAt?: number;
} | null> {
  try {
    const parsed = parseNamespace(namespace);
    if (!parsed) {
      return null;
    }

    // TODO: Once namespace contract is deployed, query on-chain
    // For now, return null as placeholder
    
    if (!NAMESPACE_REGISTRY_ID || NAMESPACE_REGISTRY_ID === '0x0') {
      return null;
    }

    // Query registry for namespace metadata
    // Implementation depends on contract structure
    
    return null; // Placeholder
  } catch (error) {
    console.error('Error getting namespace metadata:', error);
    return null;
  }
}

/**
 * React hook for namespace registration
 * Uses Enoki sponsored transactions via useSponsoredTransaction hook
 */
export function useNamespaceRegistration() {
  // Components should use useSponsoredTransaction hook and pass executeSponsoredTransaction
  // to registerNamespace along with the sender address
  return {
    registerNamespace,
    checkNamespaceAvailability,
    resolveNamespace,
    getNamespaceMetadata,
    formatNamespace,
    parseNamespace,
  };
}

