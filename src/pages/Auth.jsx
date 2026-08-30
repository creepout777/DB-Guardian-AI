import React, { useState } from 'react';
import { Terminal, Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2, KeyRound, Shield, UserCheck } from 'lucide-react';

export default function Auth({ theme, onLogin }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const isLight = theme === 'light';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'forgot') {
      setResetSent(true);
      return;
    }
    // Default login as Admin
    onLogin({
      name: name || 'Administrator',
      email: email || 'admin@guardian.io',
      role: 'admin'
    });
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
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase">Enterprise Query Guard Platform</p>
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
            onClick={() => { setAuthMode('signin'); setResetSent(false); }}
            className={`flex-1 py-1.5 rounded transition-all text-center ${
              authMode === 'signin' ? 'bg-indigo-600 text-white shadow-sm' : isLight ? 'text-slate-700' : 'text-zinc-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setResetSent(false); }}
            className={`flex-1 py-1.5 rounded transition-all text-center ${
              authMode === 'signup' ? 'bg-indigo-600 text-white shadow-sm' : isLight ? 'text-slate-700' : 'text-zinc-400'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('forgot'); setResetSent(false); }}
            className={`flex-1 py-1.5 rounded transition-all text-center ${
              authMode === 'forgot' ? 'bg-indigo-600 text-white shadow-sm' : isLight ? 'text-slate-700' : 'text-zinc-400'
            }`}
          >
            Reset
          </button>
        </div>

        {/* Forgot Password Confirmation Screen */}
        {authMode === 'forgot' && resetSent ? (
          <div className="space-y-4 text-center py-4 text-xs">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Password Reset Link Sent</h3>
            <p className="text-slate-500">
              We sent a secure password reset token to <strong className="text-indigo-600">{email || 'your email'}</strong>. Please check your inbox.
            </p>
            <button
              onClick={() => { setAuthMode('signin'); setResetSent(false); }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              {authMode === 'signin' && <>Sign In <ArrowRight className="h-4 w-4" /></>}
              {authMode === 'signup' && <>Create Account <ArrowRight className="h-4 w-4" /></>}
              {authMode === 'forgot' && <>Send Reset Email <KeyRound className="h-4 w-4" /></>}
            </button>
          </form>
        )}

        {/* 2 Roles Quick Login Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-zinc-800 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block text-center">
            Demo Account Roles:
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
              <div className="text-[9px] text-slate-400">Full Setup & Policy Access</div>
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
              <div className="text-[9px] text-slate-400">Admin-Assigned View</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
