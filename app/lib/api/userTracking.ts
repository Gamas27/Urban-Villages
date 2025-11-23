/**
 * User Tracking Utilities
 * 
 * Helper functions to track user activity, onboarding, and transactions
 * These integrate with the backend API routes
 */

/**
 * Track onboarding event
 */
export async function trackOnboardingEvent(
  walletAddress: string,
  eventType: 'wallet_connected' | 'village_selected' | 'namespace_claimed' | 'profile_pic_uploaded' | 'completed',
  metadata?: Record<string, any>
) {
  try {
    const response = await fetch('/api/users/onboarding/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        eventType,
        metadata,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[trackOnboardingEvent] Error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[trackOnboardingEvent] Failed to track event:', error);
    // Don't throw - tracking failures shouldn't break the app
    return null;
  }
}

/**
 * Save or update user profile
 */
export async function saveUserProfile(data: {
  walletAddress: string;
  username?: string;
  village?: string;
  namespaceId?: string;
  profilePicBlobId?: string;
  onboardingCompleted?: boolean;
}) {
  try {
    const response = await fetch('/api/users/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[saveUserProfile] Error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[saveUserProfile] Failed to save profile:', error);
    return null;
  }
}

/**
 * Log blockchain transaction
 */
export async function logTransaction(data: {
  walletAddress: string;
  transactionType: 'purchase' | 'mint_nft' | 'mint_token' | 'namespace_claim';
  transactionDigest: string;
  nftId?: string;
  tokenAmount?: number;
  metadata?: Record<string, any>;
}) {
  try {
    const response = await fetch('/api/users/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[logTransaction] Error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[logTransaction] Failed to log transaction:', error);
    // Don't throw - logging failures shouldn't break the app
    return null;
  }
}

/**
 * Get user profile by wallet address
 */
export async function getUserProfile(walletAddress: string) {
  try {
    const response = await fetch(
      `/api/users/profile?walletAddress=${encodeURIComponent(walletAddress)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // User not found
      }
      const error = await response.json();
      console.error('[getUserProfile] Error:', error);
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('[getUserProfile] Failed to fetch profile:', error);
    return null;
  }
}

/**
 * Get analytics (admin only)
 */
export async function getAnalytics(period: 'hour' | 'day' | 'all' = 'all') {
  try {
    const response = await fetch(`/api/admin/analytics?period=${period}`);

    if (!response.ok) {
      const error = await response.json();
      console.error('[getAnalytics] Error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[getAnalytics] Failed to fetch analytics:', error);
    return null;
  }
}

