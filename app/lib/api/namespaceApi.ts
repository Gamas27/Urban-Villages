/**
 * Namespace API Client
 * 
 * Handles namespace operations with:
 * - Retry logic
 * - Consistent error handling
 * - Request/response typing
 */

import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { formatNamespace, checkNamespaceAvailability, registerNamespace as registerNamespaceImpl } from '../namespace';
import { ApiResponse, ApiErrorCode, createSuccessResponse, createErrorResponse } from './types';

/**
 * Check if namespace is available
 */
export async function checkNamespace(
  username: string,
  village: string
): Promise<ApiResponse<boolean>> {
  try {
    const isAvailable = await checkNamespaceAvailability(username, village);
    return createSuccessResponse(isAvailable);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(
      `Failed to check namespace availability: ${errorMsg}`,
      ApiErrorCode.UNKNOWN
    );
  }
}

/**
 * Register namespace on-chain (using regular transaction signing)
 * 
 * @param username - Username
 * @param village - Village ID
 * @param profilePicBlobId - Optional profile picture blob ID
 * @param signAndExecute - Transaction signing function from dapp-kit
 * @param sender - Optional sender address (helps with transaction determination)
 */
export async function registerNamespace(
  username: string,
  village: string,
  profilePicBlobId: string | undefined,
  signAndExecute: (params: { transaction: Transaction }) => Promise<{ digest: string }>,
  sender?: string
): Promise<ApiResponse<string>> {
  try {
    // Validate inputs
    if (!username || !village) {
      return createErrorResponse(
        'Username and village are required',
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    if (username.length < 3 || username.length > 20) {
      return createErrorResponse(
        'Username must be between 3 and 20 characters',
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    if (!/^[a-z0-9]+$/.test(username)) {
      return createErrorResponse(
        'Username must contain only lowercase letters and numbers',
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    // Check availability first
    const availabilityCheck = await checkNamespace(username, village);
    if (!availabilityCheck.success || !availabilityCheck.data) {
      return createErrorResponse(
        `Namespace ${formatNamespace(username, village)} is already taken`,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    // Register namespace with retry logic
    let lastError: Error | null = null;
    const maxRetries = 2;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const digest = await registerNamespaceImpl(
          username,
          village,
          profilePicBlobId,
          signAndExecute,
          sender
        );
        
        return createSuccessResponse(digest);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry on validation errors
        if (lastError.message.includes('not deployed') || 
            lastError.message.includes('Invalid')) {
          break;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    return createErrorResponse(
      lastError?.message || 'Failed to register namespace after retries',
      ApiErrorCode.UNKNOWN
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(
      `Failed to register namespace: ${errorMsg}`,
      ApiErrorCode.UNKNOWN
    );
  }
}

/**
 * Resolve namespace to owner address
 */
export async function resolveNamespace(namespace: string): Promise<ApiResponse<string | null>> {
  try {
    // TODO: Implement on-chain query once contract supports it
    return createSuccessResponse(null);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(
      `Failed to resolve namespace: ${errorMsg}`,
      ApiErrorCode.UNKNOWN
    );
  }
}

/**
 * Namespace API client (default export)
 */
export const namespaceApi = {
  checkNamespace,
  registerNamespace,
  resolveNamespace,
};

export default namespaceApi;

