import React, { useState } from 'react';
import { Terminal, Lock, Mail, User, ArrowRight, CheckCircle2, KeyRound, Shield, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase, signInWithProvider, signUpWithEmail, sendPasswordResetEmail } from '../lib/supabase';

export default function Auth({ theme, onLogin }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const isLight = theme === 'light';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (authMode === 'forgot') {
        const { error } = await sendPasswordResetEmail(email);
        if (error) throw error;
        setResetSent(true);
      } else if (authMode === 'signup') {
        const { data, error } = await signUpWithEmail(email, password, name);
        if (error) throw error;
        setVerificationSent(true);
      } else {
        // Sign In
        if (!import.meta.env.VITE_SUPABASE_URL) {
          // Demo fallback
          onLogin({
            name: email.startsWith('admin') ? 'Administrator' : 'Regular User',
            email: email,
            role: email.startsWith('admin') ? 'admin' : 'user'
          });
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          const userRole = data.user?.user_metadata?.role || (email.includes('admin') ? 'admin' : 'user');
          onLogin({
            name: data.user?.user_metadata?.full_name || data.user?.email.split('@')[0],
            email: data.user?.email,
            role: userRole
          });
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        onLogin({
          name: `${provider.toUpperCase()} User`,
          email: `user@${provider}.com`,
          role: 'user'
        });
      } else {
        const { error } = await signInWithProvider(provider);
        if (error) throw error;
      }
    } catch (err) {
      setErrorMessage(err.message || `${provider} login failed.`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleLogin = (roleName, roleEmail, roleType) => {
    onLogin({
      name: roleName,
      email: roleEmail,
      role: roleType
    });
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 transition-colors ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-zinc-950 text-zinc-100'
    }`}>
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
          <Terminal className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight uppercase">DB-Guardian AI</h1>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase">Supabase Protected Data Platform</p>
        </div>
      </div>

      <div className={`w-full max-w-md rounded-xl border p-6 shadow-xl ${
        isLight ? 'bg-white border-slate-300' : 'bg-zinc-900 border-zinc-800'
      }`}>
        {/* Auth Mode Tabs */}
        <div className={`flex rounded-lg p-1 border mb-6 text-xs font-semibold ${
          isLight ? 'bg-slate-100 border-slate-300' : 'bg-zinc-950 border-zinc-800'
        }`}>
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setVerificationSent(false); setResetSent(false); setErrorMessage(''); }}
            className={`flex-1 py-1.5 rounded transition-all text-center ${
              authMode === 'signin' ? 'bg-indigo-600 text-white shadow-sm' : isLight ? 'text-slate-700' : 'text-zinc-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setVerificationSent(false); setResetSent(false); setErrorMessage(''); }}
            className={`flex-1 py-1.5 rounded transition-all text-center ${
              authMode === 'signup' ? 'bg-indigo-600 text-white shadow-sm' : isLight ? 'text-slate-700' : 'text-zinc-400'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('forgot'); setVerificationSent(false); setResetSent(false); setErrorMessage(''); }}
            className={`flex-1 py-1.5 rounded transition-all text-center ${
              authMode === 'forgot' ? 'bg-indigo-600 text-white shadow-sm' : isLight ? 'text-slate-700' : 'text-zinc-400'
            }`}
          >
            Reset
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Supabase Email Verification Screen */}
        {authMode === 'signup' && verificationSent ? (
          <div className="space-y-4 text-center py-4 text-xs">
            <div className="h-12 w-12 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 mx-auto flex items-center justify-center">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Verification Email Sent</h3>
            <p className="text-slate-500">
              We sent a Supabase confirmation link to <strong className="text-indigo-600">{email}</strong>. Please check your inbox and verify your email to log in.
            </p>
            <button
              onClick={() => { setAuthMode('signin'); setVerificationSent(false); }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        ) : authMode === 'forgot' && resetSent ? (
          <div className="space-y-4 text-center py-4 text-xs">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Password Reset Link Sent</h3>
            <p className="text-slate-500">
              We sent a Supabase password reset link to <strong className="text-indigo-600">{email}</strong>. Please check your inbox.
            </p>
            <button
              onClick={() => { setAuthMode('signin'); setResetSent(false); }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Supabase OAuth2 Buttons */}
            {authMode !== 'forgot' && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('github')}
                  disabled={loading}
                  className={`p-2 rounded-md border flex items-center justify-center gap-2 font-semibold transition-colors ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                  }`}
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub OAuth
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loading}
                  className={`p-2 rounded-md border flex items-center justify-center gap-2 font-semibold transition-colors ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                  }`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Google OAuth
                </button>
              </div>
            )}

            {authMode !== 'forgot' && (
              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-slate-200/60 dark:border-zinc-800"></div>
                <span className="px-2 text-[10px] text-slate-400 font-mono uppercase">Or with Email</span>
                <div className="flex-1 border-t border-slate-200/60 dark:border-zinc-800"></div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 border rounded-md transition-colors focus:outline-none focus:border-indigo-600 ${
                        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                      }`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="user@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 border rounded-md transition-colors focus:outline-none focus:border-indigo-600 ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                    }`}
                  />
                </div>
              </div>

              {authMode !== 'forgot' && (
                <div>
                  <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 border rounded-md transition-colors focus:outline-none focus:border-indigo-600 ${
                        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                      }`}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {authMode === 'signin' && <>Sign In <ArrowRight className="h-4 w-4" /></>}
                    {authMode === 'signup' && <>Create Account & Verify Email <ArrowRight className="h-4 w-4" /></>}
                    {authMode === 'forgot' && <>Send Password Reset Email <KeyRound className="h-4 w-4" /></>}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* 2 Roles Demo Quick Login Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-zinc-800 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block text-center">
            Instant Demo Account Switcher:
          </span>
          <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => handleQuickRoleLogin('Administrator', 'admin@guardian.io', 'admin')}
              className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                isLight ? 'bg-slate-50 border-slate-300 hover:bg-indigo-50 hover:border-indigo-400' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <Shield className="h-4 w-4 text-indigo-600" />
              <div className="text-indigo-600 font-bold">Admin</div>
              <div className="text-[9px] text-slate-400">Full Setup Access</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleLogin('Sarah Jenkins', 'sarah.j@company.com', 'user')}
              className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                isLight ? 'bg-slate-50 border-slate-300 hover:bg-indigo-50 hover:border-indigo-400' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <div className="text-emerald-600 font-bold">Regular User</div>
              <div className="text-[9px] text-slate-400">Isolated User Data</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
