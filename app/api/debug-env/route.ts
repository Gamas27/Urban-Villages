import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check environment variables
 * 
 * Visit: /api/debug-env
 * 
 * This helps verify if NEXT_PUBLIC_GOOGLE_CLIENT_ID is available in Vercel
 */

export async function GET() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  return NextResponse.json({
    hasGoogleClientId: !!googleClientId,
    googleClientIdLength: googleClientId?.length || 0,
    googleClientIdPrefix: googleClientId ? `${googleClientId.substring(0, 20)}...` : 'NOT SET',
    googleClientIdSuffix: googleClientId ? `...${googleClientId.substring(googleClientId.length - 10)}` : 'NOT SET',
    allNextPublicVars: Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC_'))
      .sort()
      .map(key => ({
        name: key,
        hasValue: !!process.env[key],
        valueLength: process.env[key]?.length || 0,
      })),
    environment: process.env.NODE_ENV,
  }, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}


