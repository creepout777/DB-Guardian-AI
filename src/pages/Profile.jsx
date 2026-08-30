import React, { useState } from 'react';
import { User, Shield, Key, Clock, Laptop, Smartphone, Copy, Check } from 'lucide-react';

export default function Profile({ theme }) {
  const [profileName, setProfileName] = useState('Administrator');
  const [profileEmail, setProfileEmail] = useState('admin@guardian.io');
  const [copiedToken, setCopiedToken] = useState(false);
  const [personalToken] = useState('db_g_tok_8f7b235ee289bc1912a7f80');
  const isLight = theme === 'light';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(personalToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
          <User className="h-5 w-5 text-indigo-600" />
          My Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4 text-xs">
          <div className={`p-5 rounded-lg border space-y-4 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
            <div className={`flex items-center gap-3 border-b pb-4 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
              <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                AD
              </div>
              <div>
                <h2 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{profileName}</h2>
                <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded mt-0.5 inline-block font-mono">
                  GLOBAL ADMIN
                </span>
              </div>
            </div>

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
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:border-indigo-600 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
            </div>
          </div>

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
                  <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>MFA Enforcement</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">ENFORCED</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>Password Status</h3>
                </div>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">VALID</span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border space-y-2.5 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5`}>
              <Clock className="h-3.5 w-3.5 text-indigo-600" />
              Active Sessions
            </h2>
            <div className="border-t pt-2.5 space-y-2 border-slate-200/50 dark:border-zinc-800">
              <div className="flex gap-2">
                <Laptop className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>Berlin, DE (Current)</h3>
                  <p className="text-slate-500 text-[10px] font-mono">192.168.1.45</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Smartphone className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>iPhone 15 Pro</h3>
                  <p className="text-slate-500 text-[10px] font-mono">Safari Mobile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
