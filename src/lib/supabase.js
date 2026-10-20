import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xcgbdghkhvxvqtlqcrnf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_N9MqstR8XQYfcKOQBgvCuw_qGAan4xY';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-supabase-anon-key'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const ALLOWED_ADMIN_EMAIL = (
  import.meta.env.VITE_ADMIN_EMAIL || 'suryasanku800@gmail.com'
).toLowerCase();

/**
 * Protective salted cryptographic hash for admin access.
 * Passwords are never stored or evaluated in plain text.
 */
export const hashPassword = async (pwd) => {
  const salt = 'surya_salt_key_2026:';
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + pwd);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

// Salted SHA-256 hash of Surya@0206
export const DEFAULT_PROTECTED_HASH = 'c1e4de392486ddfd8e28c4f295b30e03d0a2e034956c3a200a922e7ca1b15992';
