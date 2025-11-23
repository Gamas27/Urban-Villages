import { NextResponse } from 'next/server';

/**
 * Test endpoint to verify environment variables
 * 
 * This endpoint checks which environment variables are set.
 * Useful for debugging deployment issues.
 * 
 * Access at: /api/test-env
 */

export async function GET() {
  const required = {
    'NEXT_PUBLIC_SUI_NETWORK': process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet (default)',
    'NEXT_PUBLIC_NAMESPACE_PACKAGE_ID': process.env.NEXT_PUBLIC_NAMESPACE_PACKAGE_ID || 'NOT SET',
    'NEXT_PUBLIC_NAMESPACE_REGISTRY_ID': process.env.NEXT_PUBLIC_NAMESPACE_REGISTRY_ID || 'NOT SET',
    'NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID': process.env.NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID || 'NOT SET',
    'NEXT_PUBLIC_CORK_TREASURY_ID': process.env.NEXT_PUBLIC_CORK_TREASURY_ID || 'NOT SET',
    'NEXT_PUBLIC_CORK_ADMIN_CAP_ID': process.env.NEXT_PUBLIC_CORK_ADMIN_CAP_ID || 'NOT SET',
    'NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID': process.env.NEXT_PUBLIC_BOTTLE_NFT_PACKAGE_ID || 'NOT SET',
    'NEXT_PUBLIC_BOTTLE_REGISTRY_ID': process.env.NEXT_PUBLIC_BOTTLE_REGISTRY_ID || 'NOT SET',
    'NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID': process.env.NEXT_PUBLIC_BOTTLE_ADMIN_CAP_ID || 'NOT SET',
    'ADMIN_PRIVATE_KEY': process.env.ADMIN_PRIVATE_KEY ? 'SET (hidden)' : 'NOT SET',
    'NEXT_PUBLIC_ENOKI_API_KEY': process.env.NEXT_PUBLIC_ENOKI_API_KEY || 'NOT SET',
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID': process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'NOT SET',
  };

  const optional = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET',
    'ENOKI_PRIVATE_API_KEY': process.env.ENOKI_PRIVATE_API_KEY ? 'SET (hidden)' : 'NOT SET',
    'NEXT_PUBLIC_BASE_URL': process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET (defaults to localhost:3000)',
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => value === 'NOT SET')
    .map(([key]) => key);

  const criticalMissing = missing.filter(key => 
    key.includes('PACKAGE_ID') || 
    key.includes('REGISTRY_ID') || 
    key.includes('TREASURY_ID') || 
    key.includes('ADMIN_CAP_ID') ||
    key === 'ADMIN_PRIVATE_KEY'
  );

  return NextResponse.json({
    status: missing.length === 0 ? 'all_set' : 'missing_variables',
    required,
    optional,
    missing,
    criticalMissing,
    summary: {
      totalRequired: Object.keys(required).length,
      missingCount: missing.length,
      criticalMissingCount: criticalMissing.length,
      allCriticalSet: criticalMissing.length === 0,
    },
  }, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

