import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Clock,
  Laptop,
  Copy,
  Check,
  Save,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  updateUserProfile,
  updateUserPassword,
  isSupabaseConfigured
} from '../lib/supabase';

export default function Profile({ theme, currentUser, onUpdateUser }) {
  const [profileName, setProfileName] = useState(currentUser?.name || 'Administrator');
  const [profileEmail] = useState(currentUser?.email || 'admin@guardian.io');
  const [newPassword, setNewPassword] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);
  const [personalToken] = useState(currentUser?.id ? `db_g_tok_${currentUser.id.slice(0, 16)}` : 'db_g_tok_8f7b235ee289bc1912a7f80');
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isLight = theme === 'light';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(personalToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setErrorMessage('');
    setProfileSuccess(false);

    try {
      await updateUserProfile({ full_name: profileName });
      if (onUpdateUser) {
        onUpdateUser({ name: profileName });
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setSavingProfile(true);
    setErrorMessage('');
    setPasswordSuccess(false);

    try {
      const { error } = await updateUserPassword(newPassword);
      if (error) throw error;
      setPasswordSuccess(true);
      setNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update password.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
          <User className="h-5 w-5 text-indigo-600" />
          My Profile & Supabase Security
        </h1>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {profileSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Profile details updated successfully!</span>
        </div>
      )}

      {passwordSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Password changed successfully in Supabase Auth!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4 text-xs">
          {/* User Info Form */}
          <div className={`p-5 rounded-lg border space-y-4 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
            <div className={`flex items-center gap-3 border-b pb-4 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
              <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm overflow-hidden">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-full w-full object-cover" />
                ) : (
                  (profileName || 'U').substring(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <h2 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{profileName}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                    currentUser?.role === 'admin'
                      ? 'text-indigo-700 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                      : 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                  }`}>
                    {currentUser?.role === 'admin' ? 'GLOBAL ADMIN' : 'RESTRICTED USER'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Provider: {currentUser?.provider || 'Email'}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateName} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Display Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:border-indigo-600 ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Email Address</label>
                  <input
                    type="email"
                    readOnly
                    value={profileEmail}
                    className={`w-full px-3 py-2 rounded-md border opacity-75 cursor-not-allowed ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-md px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                >
                  {savingProfile ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Profile
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className={`p-5 rounded-lg border space-y-3 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5 border-b pb-2 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
              <Lock className="h-3.5 w-3.5 text-indigo-600" />
              Update Supabase Password
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password (min. 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:border-indigo-600 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile || !newPassword}
                  className="bg-slate-800 hover:bg-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-md px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* Bearer API Token Card */}
          <div className={`p-5 rounded-lg border space-y-2.5 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5 border-b pb-2 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
              <Key className="h-3.5 w-3.5 text-indigo-600" />
              Bearer API Token
            </h2>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={personalToken}
                className={`w-full font-mono text-xs px-3 py-2 rounded-md border ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-200'
                }`}
              />
              <button
                onClick={copyToClipboard}
                className={`absolute right-1 top-1 p-1 rounded transition-colors ${
                  isLight ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {copiedToken ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className={`p-4 rounded-lg border space-y-2.5 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5`}>
              <Shield className="h-3.5 w-3.5 text-indigo-600" />
              Security Status
            </h2>
            <div className="border-t pt-2.5 space-y-2 border-slate-200/50 dark:border-zinc-800">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>Supabase Auth</h3>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono ${
                  isSupabaseConfigured
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}>
                  {isSupabaseConfigured ? 'CONNECTED' : 'SANDBOX'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>Session Token</h3>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  JWT ACTIVE
                </span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border space-y-2.5 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5`}>
              <Clock className="h-3.5 w-3.5 text-indigo-600" />
              Active Session
            </h2>
            <div className="border-t pt-2.5 space-y-2 border-slate-200/50 dark:border-zinc-800">
              <div className="flex gap-2">
                <Laptop className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>
                    {currentUser?.id ? `ID: ${currentUser.id.slice(0, 8)}...` : 'Local Browser Client'}
                  </h3>
                  <p className="text-slate-500 text-[10px] font-mono">
                    {currentUser?.createdAt ? `Member since ${new Date(currentUser.createdAt).toLocaleDateString()}` : 'Active Session'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
