import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseAdminClient: SupabaseClient | null = null;

function readEnv(name: string) {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

export function getSupabaseAdminClient() {
  const supabaseUrl = readEnv('NEXT_PUBLIC_SUPABASE_URL') || readEnv('SUPABASE_URL');
  const supabaseServiceRoleKey =
    readEnv('SUPABASE_SERVICE_ROLE_KEY') || readEnv('SUPABASE_SECRET_KEY');

  const missingKeys: string[] = [];

  if (!supabaseUrl) {
    missingKeys.push('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL');
  }

  if (!supabaseServiceRoleKey) {
    missingKeys.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY');
  }

  if (missingKeys.length > 0) {
    throw new Error(`Missing Supabase env: ${missingKeys.join(', ')}`);
  }

  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return supabaseAdminClient;
}
