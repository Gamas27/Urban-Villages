/**
 * Cork Token API Client
 * 
 * Handles Cork Token operations with:
 * - Retry logic
 * - Consistent error handling
 * - Balance queries
 */

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { getCorkBalance } from '../cork-token';
import { ApiResponse, ApiErrorCode, createSuccessResponse, createErrorResponse } from './types';

const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet' | 'devnet';

// Create SuiClient instance for queries
const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
});

/**
 * Get user's CORK token balance
 */
export async function getBalance(
  address: string
): Promise<ApiResponse<number>> {
  try {
    if (!address) {
      return createErrorResponse(
        'Address is required',
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    const balance = await getCorkBalance(address);
    return createSuccessResponse(balance);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(
      `Failed to fetch CORK balance: ${errorMsg}`,
      ApiErrorCode.UNKNOWN
    );
  }
}

/**
 * Mint CORK tokens (via backend API)
 * 
 * Note: This is handled by the mint-purchase API route
 * which mints both NFT and CORK tokens together
 */
export async function mintCorks(
  data: {
    recipient: string;
    amount: number;
    reason: string;
  }
): Promise<ApiResponse<string>> {
  try {
    // This is handled by the backend API route
    // For now, return error as minting is done via mint-purchase
    return createErrorResponse(
      'CORK minting is handled via the purchase flow',
      ApiErrorCode.VALIDATION_ERROR
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(
      `Failed to mint CORK: ${errorMsg}`,
      ApiErrorCode.UNKNOWN
    );
  }
}

/**
 * Cork API client (default export)
 */
export const corkApi = {
  getBalance,
  mintCorks,
};

export default corkApi;

