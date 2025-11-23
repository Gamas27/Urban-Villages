/**
 * Supabase Client Setup
 * 
 * Creates typed Supabase clients for server and client usage
 */

import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (safe to expose anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase environment variables not set. Backend features will be disabled.\n' +
    '   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

/**
 * Client-side Supabase client
 * Use this in React components and client-side code
 */
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Server-side Supabase client with service role key (if needed)
 * Only use this in API routes where you need admin access
 */
export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase admin credentials not configured');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

/**
 * Database types (update these as your schema evolves)
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          wallet_address: string;
          username: string | null;
          village: string | null;
          namespace_id: string | null;
          profile_pic_blob_id: string | null;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          username?: string | null;
          village?: string | null;
          namespace_id?: string | null;
          profile_pic_blob_id?: string | null;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          username?: string | null;
          village?: string | null;
          namespace_id?: string | null;
          profile_pic_blob_id?: string | null;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      onboarding_events: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          metadata: Record<string, any> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: string;
          metadata?: Record<string, any> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_type?: string;
          metadata?: Record<string, any> | null;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          transaction_type: string;
          transaction_digest: string;
          nft_id: string | null;
          token_amount: string | null; // bigint stored as string
          metadata: Record<string, any> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          transaction_type: string;
          transaction_digest: string;
          nft_id?: string | null;
          token_amount?: string | null;
          metadata?: Record<string, any> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          transaction_type?: string;
          transaction_digest?: string;
          nft_id?: string | null;
          token_amount?: string | null;
          metadata?: Record<string, any> | null;
          created_at?: string;
        };
      };
      nft_ownership: {
        Row: {
          id: string;
          user_id: string;
          nft_id: string;
          bottle_number: number | null;
          wine_name: string | null;
          village: string | null;
          minted_at: string | null;
          transaction_digest: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nft_id: string;
          bottle_number?: number | null;
          wine_name?: string | null;
          village?: string | null;
          minted_at?: string | null;
          transaction_digest?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nft_id?: string;
          bottle_number?: number | null;
          wine_name?: string | null;
          village?: string | null;
          minted_at?: string | null;
          transaction_digest?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

