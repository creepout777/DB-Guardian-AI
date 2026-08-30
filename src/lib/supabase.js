import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper for Supabase OAuth2 Sign-In (GitHub / Google)
export async function signInWithProvider(provider) {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    return { data: { user: { email: `user@${provider}.com`, role: 'user' } }, error: null };
  }
  return await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin }
  });
}

// Helper for Email/Password Sign Up with Email Verification
export async function signUpWithEmail(email, password, fullName) {
  if (!import.meta.env.VITE_SUPABASE_URL) {
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
  if (!import.meta.env.VITE_SUPABASE_URL) {
    return { data: {}, error: null };
  }
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
}
