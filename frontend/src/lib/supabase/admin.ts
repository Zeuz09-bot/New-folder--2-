// ──────────────────────────────────────────────
// Supabase Admin Client (Service Role — bypasses RLS)
// ──────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

/**
 * Admin client using the service role key.
 * Use ONLY in server-side API routes — never expose to the browser.
 * Bypasses Row Level Security for admin operations.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
