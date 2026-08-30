import { createClient } from '@supabase/supabase-js';

// Support Vercel auto-injected Supabase integration keys and custom VITE_ keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://demo-project.supabase.co');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://demo-project.supabase.co', 'demo-anon-key');

// Helper for Supabase OAuth2 Sign-In (GitHub / Google)
export async function signInWithProvider(provider) {
  if (!isSupabaseConfigured) {
    return { data: { user: { email: `user@${provider}.com`, role: 'user' } }, error: null };
  }
  return await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin }
  });
}

// Helper for Email/Password Sign Up with Email Verification
export async function signUpWithEmail(email, password, fullName) {
  if (!isSupabaseConfigured) {
    return { data: { user: { email, user_metadata: { full_name: fullName } } }, error: null };
  }
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: window.location.origin
    }
  });
}

// Helper for Password Reset Verification Email
export async function sendPasswordResetEmail(email) {
  if (!isSupabaseConfigured) {
    return { data: {}, error: null };
  }
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
}
