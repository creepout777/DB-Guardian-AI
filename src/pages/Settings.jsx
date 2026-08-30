import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Cpu, ShieldAlert, Save, CheckCircle2 } from 'lucide-react';

export default function Settings({ theme }) {
  const [apiKey, setApiKey] = useState('sk-proj-••••••••••••••••••••');
  const [model, setModel] = useState('gpt-4o');
  const [temp, setTemp] = useState(0.0);
  const [auditLogRetention, setAuditLogRetention] = useState('90');
  const [enableBlockAlerts, setEnableBlockAlerts] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const isLight = theme === 'light';

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
          <SettingsIcon className="h-5 w-5 text-indigo-600" />
          System Settings
        </h1>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
        {/* API Credentials */}
        <div className={`p-5 rounded-lg border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5 border-b pb-2 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
            <Key className="h-4 w-4 text-indigo-600" />
            AI Provider Credentials
          </h2>
          <div>
            <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>LLM API Key (OpenAI / Anthropic)</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border text-xs font-mono transition-colors focus:outline-none focus:border-indigo-600 ${
                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
              }`}
              placeholder="sk-proj-..."
            />
          </div>
        </div>

        {/* Engine Configuration */}
        <div className={`p-5 rounded-lg border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5 border-b pb-2 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
            <Cpu className="h-4 w-4 text-indigo-600" />
            Inference Model Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Default Model Engine</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border text-xs transition-colors focus:outline-none focus:border-indigo-600 ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                }`}
              >
                <option value="gpt-4o">GPT-4o (High-Precision SQL)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="llama-3-70b">Llama 3 70B (Local Enterprise)</option>
              </select>
            </div>
            <div>
              <label className={`block font-semibold uppercase tracking-wider mb-1 flex justify-between ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                <span>Model Temperature</span>
                <span className="font-mono text-indigo-600 font-bold">{temp}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2.5 bg-slate-300 dark:bg-zinc-800"
              />
            </div>
          </div>
        </div>

        {/* Audits & Alerts */}
        <div className={`p-5 rounded-lg border space-y-3 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          <h2 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5 border-b pb-2 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
            <ShieldAlert className="h-4 w-4 text-indigo-600" />
            Audit Logs & Alerts
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>AST Violation Webhook Alerts</h3>
            </div>
            <input
              type="checkbox"
              checked={enableBlockAlerts}
              onChange={() => setEnableBlockAlerts(!enableBlockAlerts)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
          </div>

          <div>
            <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Audit Log Retention</label>
            <select
              value={auditLogRetention}
              onChange={(e) => setAuditLogRetention(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border text-xs transition-colors focus:outline-none focus:border-indigo-600 ${
                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
              }`}
            >
              <option value="30">30 Days</option>
              <option value="90">90 Days (SOC2 Standard Compliance)</option>
              <option value="365">365 Days (Enterprise Archive)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-md px-4 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            Save Settings
          </button>
          
          {saveSuccess && (
            <div className="text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Settings updated!
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
