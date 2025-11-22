/**
 * zkLogin Service for Urban Villages
 * Allows non-web3 users to authenticate using OAuth providers (Google, etc.)
 */

export interface ZkLoginConfig {
  clientId: string;
  redirectUrl: string;
  network: 'testnet' | 'mainnet';
}

export interface ZkLoginUser {
  sub: string; // OAuth subject identifier
  email?: string;
  name?: string;
  picture?: string;
  address?: string; // SUI address derived from zkLogin
}

/**
 * Initialize Google OAuth login for zkLogin
 */
export function initiateGoogleLogin(): void {
  if (typeof window === 'undefined') return;
  
  // Generate a random nonce for security
  const nonce = generateNonce();
  sessionStorage.setItem('zklogin_nonce', nonce);

  // For demo purposes, we'll simulate the OAuth flow
  // In production, this would redirect to Google OAuth
  console.log('🔐 zkLogin: Initiating Google OAuth...');
  
  // Simulate OAuth redirect
  setTimeout(() => {
    completeGoogleLogin();
  }, 1000);
}

/**
 * Complete the OAuth login and derive SUI address
 */
function completeGoogleLogin(): void {
  if (typeof window === 'undefined') return;
  
  // In production, this would:
  // 1. Parse JWT token from OAuth callback
  // 2. Get zkLogin signature from proving service
  // 3. Derive ephemeral address using zkLogin
  
  const mockUser: ZkLoginUser = {
    sub: 'google_' + Math.random().toString(36).substring(7),
    email: 'user@example.com',
    name: 'Cork Enthusiast',
    picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    address: generateMockSuiAddress(),
  };

  // Store user in session
  sessionStorage.setItem('zklogin_user', JSON.stringify(mockUser));
  
  // Trigger custom event for app to react
  window.dispatchEvent(new CustomEvent('zklogin_complete', { detail: mockUser }));
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('zklogin_user') !== null;
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): ZkLoginUser | null {
  if (typeof window === 'undefined') return null;
  
  const userJson = sessionStorage.getItem('zklogin_user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as ZkLoginUser;
  } catch {
    return null;
  }
}

/**
 * Logout user
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  
  sessionStorage.removeItem('zklogin_user');
  sessionStorage.removeItem('zklogin_nonce');
  window.dispatchEvent(new CustomEvent('zklogin_logout'));
}

/**
 * Helper: Generate random nonce
 */
function generateNonce(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Helper: Generate mock SUI address
 */
function generateMockSuiAddress(): string {
  // Generate a valid-looking SUI address (0x + 64 hex chars)
  const randomHex = Array.from(
    { length: 64 }, 
    () => Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return `0x${randomHex}`;
}

/**
 * Sign transaction using zkLogin
 * In production, this would use the zkLogin signature service
 */
export async function signTransaction(txData: any): Promise<string> {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  // Simulate signing delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock signature
  return 'zklogin_sig_' + Math.random().toString(36).substring(7);
}

/**
 * Integration info for hackathon judges
 */
export const ZKLOGIN_INFO = {
  description: 'zkLogin enables users to authenticate with OAuth providers (Google, Facebook, etc.) without needing a crypto wallet',
  benefits: [
    'No wallet installation required',
    'Familiar OAuth login experience',
    'Lower barrier to entry for non-web3 users',
    'Automatic SUI address derivation',
  ],
  production_requirements: [
    'Google OAuth Client ID',
    'zkLogin proving service endpoint',
    'Salt generation and management',
    'JWT token validation',
  ],
};