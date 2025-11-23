/**
 * Common API Types
 * Shared types for all API clients
 */

/**
 * Standard API Response format
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

/**
 * API Error Codes
 */
export enum ApiErrorCode {
  UNKNOWN = 'UNKNOWN',
  NETWORK_ERROR = 'NETWORK_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

/**
 * Helper to create success response
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Helper to create error response
 */
export function createErrorResponse(
  error: string,
  errorCode: ApiErrorCode = ApiErrorCode.UNKNOWN
): ApiResponse<never> {
  return {
    success: false,
    error,
    errorCode,
  };
}

