/**
 * Cork Token Service
 * Handles CORK token operations (mint, burn, transfer, balance queries)
 * Uses Enoki wallets via dapp-kit hooks
 */

import { Transaction } from '@mysten/sui/transactions';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const CORK_TOKEN_PACKAGE_ID = process.env.NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID || '0x0';
const CORK_TREASURY_ID = process.env.NEXT_PUBLIC_CORK_TREASURY_ID || '0x0';

const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet' | 'devnet';

// Create SuiClient instance for queries
const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
});

// CORK token has 6 decimals
const CORK_DECIMALS = 6;

/**
 * Convert CORK amount to smallest unit (micro-CORK)
 */
export function toMicroCork(amount: number): bigint {
  return BigInt(Math.floor(amount * 10 ** CORK_DECIMALS));
}

/**
 * Convert micro-CORK to CORK amount
 */
export function fromMicroCork(amount: bigint | string): number {
  const bigIntAmount = typeof amount === 'string' ? BigInt(amount) : amount;
  return Number(bigIntAmount) / 10 ** CORK_DECIMALS;
}

/**
 * Mint Cork tokens
 * 
 * @param adminCapId - AdminCap object ID (owned by deployer/admin)
 * @param recipient - Address to receive tokens
 * @param amount - Amount in CORK (will be converted to micro-CORK)
 * @param reason - Reason for minting (e.g., "bottle_purchase")
 * @param signAndExecute - Transaction signing function from dapp-kit
 * @returns Transaction digest
 */
export async function mintCorks(
  adminCapId: string,
  recipient: string,
  amount: number,
  reason: string,
  signAndExecute: (params: { transaction: Transaction }) => Promise<{ digest: string }>
): Promise<string> {
  if (!CORK_TOKEN_PACKAGE_ID || CORK_TOKEN_PACKAGE_ID === '0x0') {
    throw new Error('Cork Token contract not deployed. Set NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID in .env.local');
  }

  if (!CORK_TREASURY_ID || CORK_TREASURY_ID === '0x0') {
    throw new Error('Cork Token Treasury not configured. Set NEXT_PUBLIC_CORK_TREASURY_ID in .env.local');
  }

  const tx = new Transaction();
  const microCork = toMicroCork(amount);

  tx.moveCall({
    target: `${CORK_TOKEN_PACKAGE_ID}::cork_token::mint`,
    arguments: [
      tx.object(adminCapId),           // AdminCap (owned by admin)
      tx.object(CORK_TREASURY_ID),     // Treasury (shared object)
      tx.pure.address(recipient),      // Recipient address
      tx.pure.u64(microCork),          // Amount in micro-CORK
      tx.pure.string(reason),          // Reason for minting
    ],
  });

  const result = await signAndExecute({ transaction: tx });
  return result.digest;
}

/**
 * Get user's CORK token balance
 * 
 * @param address - User's wallet address
 * @returns Balance in CORK (not micro-CORK)
 */
export async function getCorkBalance(address: string): Promise<number> {
  if (!CORK_TOKEN_PACKAGE_ID || CORK_TOKEN_PACKAGE_ID === '0x0') {
    return 0;
  }

  try {
    const coinType = `${CORK_TOKEN_PACKAGE_ID}::cork_token::CORK_TOKEN`;
    const coins = await suiClient.getCoins({
      owner: address,
      coinType,
    });

    // Sum all coin balances
    let totalBalance = BigInt(0);
    for (const coin of coins.data) {
      totalBalance += BigInt(coin.balance);
    }

    return fromMicroCork(totalBalance);
  } catch (error) {
    return 0;
  }
}

/**
 * Get total supply of CORK tokens
 * 
 * @returns Total supply in CORK
 */
export async function getTotalSupply(): Promise<number> {
  if (!CORK_TREASURY_ID || CORK_TREASURY_ID === '0x0') {
    return 0;
  }

  try {
    // Query the Treasury object to get total supply
    const treasury = await suiClient.getObject({
      id: CORK_TREASURY_ID,
      options: { showContent: true },
    });

    // The total supply would be available via a view function
    // For now, we'll need to call the contract's total_supply function
    // This requires a read-only call which might not be directly available
    // We'll implement this when needed
    
    return 0; // Placeholder
  } catch (error) {
    return 0;
  }
}

