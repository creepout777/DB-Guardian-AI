import { createClient } from '@supabase/supabase-js';

// Support localStorage overrides (for dynamic in-app configuration) as well as Vite/Vercel env variables
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('GUARDIAN_SUPABASE_URL') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('GUARDIAN_SUPABASE_ANON_KEY') : null;

export const supabaseUrl = storedUrl ||
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';

export const supabaseAnonKey = storedKey ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  supabaseUrl !== 'https://demo-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createClient('https://demo-project.supabase.co', 'demo-anon-key');

/**
 * Format raw Supabase User object into Guardian app user representation
 */
export function formatGuardianUser(user) {
  if (!user) return null;
  const meta = user.user_metadata || {};
  const email = user.email || '';
  
  // Extract role from metadata, default to 'admin' if email contains 'admin', otherwise 'user'
  const role = meta.role || (email.toLowerCase().includes('admin') ? 'admin' : 'user');
  const name = meta.full_name || meta.name || email.split('@')[0] || 'User';

  return {
    id: user.id,
    email: email,
    name: name,
    role: role,
    avatarUrl: meta.avatar_url || null,
    provider: user.app_metadata?.provider || 'email',
    createdAt: user.created_at,
    lastSignIn: user.last_sign_in_at
  };
}

/**
 * Helper to fetch active session on app boot
 */
export async function getCurrentSession() {
  if (!isSupabaseConfigured) {
    const savedDemoUser = typeof window !== 'undefined' ? localStorage.getItem('GUARDIAN_DEMO_USER') : null;
    if (savedDemoUser) {
      try {
        return { session: { user: JSON.parse(savedDemoUser) }, error: null };
      } catch (e) {
        // Fall back to null if parse fails
      }
    }
    return { session: null, error: null };
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data?.session, error };
  } catch (err) {
    console.error('Error fetching Supabase session:', err);
    return { session: null, error: err };
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured) {
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
    const name = email.toLowerCase().includes('admin') ? 'Administrator' : 'Regular User';
    const mockUser = { id: 'demo-user-id', email, name, role, provider: 'demo' };
    localStorage.setItem('GUARDIAN_DEMO_USER', JSON.stringify(mockUser));
    return { data: { user: mockUser }, error: null };
  }

  return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign Up with Email, Password, Full Name and Optional Role
 */
export async function signUpWithEmail(email, password, fullName, role = 'user') {
  if (!isSupabaseConfigured) {
    const mockUser = {
      id: 'demo-user-id',
      email,
      name: fullName || email.split('@')[0],
      role: role || (email.toLowerCase().includes('admin') ? 'admin' : 'user'),
      provider: 'demo'
    };
    localStorage.setItem('GUARDIAN_DEMO_USER', JSON.stringify(mockUser));
    return { data: { user: mockUser, session: { user: mockUser } }, error: null };
  }

  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role
      },
      emailRedirectTo: window.location.origin
    }
  });
}

/**
 * Supabase OAuth2 Sign-In (GitHub / Google)
 */
export async function signInWithProvider(provider) {
  if (!isSupabaseConfigured) {
    const mockUser = {
      id: `demo-${provider}-user`,
      email: `user@${provider}.com`,
      name: `${provider.toUpperCase()} Developer`,
      role: 'user',
      provider: provider
    };
    localStorage.setItem('GUARDIAN_DEMO_USER', JSON.stringify(mockUser));
    return { data: { user: mockUser }, error: null };
  }

  return await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin }
  });
}

/**
 * Sign Out active user
 */
export async function signOutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('GUARDIAN_DEMO_USER');
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }
  }
}

/**
 * Helper for Password Reset Verification Email
 */
export async function sendPasswordResetEmail(email) {
  if (!isSupabaseConfigured) {
    return { data: {}, error: null };
  }

  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  });
}

/**
 * Update authenticated user's password
 */
export async function updateUserPassword(newPassword) {
  if (!isSupabaseConfigured) {
    return { data: {}, error: null };
  }

  return await supabase.auth.updateUser({ password: newPassword });
}

/**
 * Update user metadata (full name, role)
 */
export async function updateUserProfile(updates) {
  if (!isSupabaseConfigured) {
    const saved = localStorage.getItem('GUARDIAN_DEMO_USER');
    if (saved) {
      const parsed = { ...JSON.parse(saved), ...updates };
      localStorage.setItem('GUARDIAN_DEMO_USER', JSON.stringify(parsed));
      return { data: { user: parsed }, error: null };
    }
    return { data: { user: updates }, error: null };
  }

  return await supabase.auth.updateUser({
    data: updates
  });
}

/**
 * Listen for Supabase Auth state transitions
 */
export function subscribeToAuthChanges(callback) {
  if (!isSupabaseConfigured) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

/**
 * Save manual Supabase Credentials to localStorage and reload
 */
export function saveSupabaseCredentials(url, anonKey) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('GUARDIAN_SUPABASE_URL', url.trim());
    localStorage.setItem('GUARDIAN_SUPABASE_ANON_KEY', anonKey.trim());
    window.location.reload();
  }
}

/**
 * Clear manual Supabase credentials from localStorage
 */
export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('GUARDIAN_SUPABASE_URL');
    localStorage.removeItem('GUARDIAN_SUPABASE_ANON_KEY');
    window.location.reload();
  }
}
