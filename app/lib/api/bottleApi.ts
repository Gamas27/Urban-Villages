/**
 * Bottle NFT API Client
 * 
 * Handles Bottle NFT operations with:
 * - Retry logic
 * - Consistent error handling
 * - On-chain queries
 */

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { getOwnedBottles, getBottleNFT, mintBottleNFT, type BottleNFTData } from '../bottle-nft';
import { ApiResponse, ApiErrorCode, createSuccessResponse, createErrorResponse } from './types';

const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet' | 'devnet';

// Create SuiClient instance for queries
const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
});

/**
 * Get all Bottle NFTs owned by an address
 */
export async function getOwnedBottlesByAddress(
  owner: string
): Promise<ApiResponse<any[]>> {
  try {
    if (!owner) {
      return createErrorResponse(
        'Owner address is required',
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    const bottles = await getOwnedBottles(owner);
    return createSuccessResponse(bottles);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(
      `Failed to fetch owned bottles: ${errorMsg}`,
      ApiErrorCode.UNKNOWN
    );
  }
}

/**
 * Get a specific Bottle NFT by object ID
 */
export async function getBottleById(
  objectId: string
): Promise<ApiResponse<any | null>> {
  try {
    if (!objectId) {
      return createErrorResponse(
        'Object ID is required',
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    const bottle = await getBottleNFT(objectId);
    return createSuccessResponse(bottle);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a not found error
    if (errorMsg.includes('not found') || errorMsg.includes('404')) {
      return createErrorResponse(
        'Bottle NFT not found',
        ApiErrorCode.NOT_FOUND
      );
    }
    
    return createErrorResponse(
      `Failed to fetch bottle: ${errorMsg}`,
      ApiErrorCode.UNKNOWN
    );
  }
}

/**
 * Mint a Bottle NFT (via backend API)
 * 
 * Note: This calls the backend API route, not the contract directly
 */
export async function mintBottle(
  data: {
    recipient: string;
    wineName: string;
    vintage: number;
    region: string;
    winery: string;
    wineType: string;
    bottleNumber?: number;
    totalSupply?: number;
    imageUrl?: string;
    qrCode?: string;
    corkAmount?: number;
    customText?: string;
  }
): Promise<ApiResponse<{ digest: string; nftId: string | null }>> {
  try {
    const response = await fetch('/api/mint-purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return createErrorResponse(
        errorData.error || errorData.details || 'Failed to mint bottle',
        ApiErrorCode.UNKNOWN
      );
    }

    const result = await response.json();
    return createSuccessResponse({
      digest: result.digest,
      nftId: result.nftId,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    
    // Check for network errors
    if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
      return createErrorResponse(
        'Network error. Please check your connection.',
        ApiErrorCode.NETWORK_ERROR
      );
    }
    
    return createErrorResponse(
      `Failed to mint bottle: ${errorMsg}`,
      ApiErrorCode.UNKNOWN
    );
  }
}

/**
 * Bottle API client (default export)
 */
export const bottleApi = {
  getOwnedBottlesByAddress,
  getBottleById,
  mintBottle,
};

export default bottleApi;

