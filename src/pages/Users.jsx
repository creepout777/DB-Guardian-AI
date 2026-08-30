import React, { useState } from 'react';
import { Users as UsersIcon, UserPlus, FileText, Activity, Shield, Eye, ShieldCheck, ShieldAlert, X } from 'lucide-react';

export default function Users({ theme }) {
  const [usersList, setUsersList] = useState([
    {
      id: 1,
      name: 'Sarah Jenkins',
      email: 'sarah.j@company.com',
      role: 'Sales Representative',
      dashboard: 'Sales Performance',
      privileges: 'Limited (Sales data only)',
      queryLimit: '100 / day',
      status: 'active'
    },
    {
      id: 2,
      name: 'David Chen',
      email: 'david.c@company.com',
      role: 'Marketing Analyst',
      dashboard: 'Customer Acquisition',
      privileges: 'Custom (No PII columns)',
      queryLimit: '500 / day',
      status: 'active'
    },
    {
      id: 3,
      name: 'Marcus Miller',
      email: 'marcus.m@company.com',
      role: 'Business Ops Intern',
      dashboard: 'Operational Overview',
      privileges: 'Strict (Aggregate reads only)',
      queryLimit: '20 / day',
      status: 'suspended'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState(null);
  const isLight = theme === 'light';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Sales Analyst',
    dashboard: 'Default Dashboard',
    privileges: 'Limited',
    queryLimit: '50',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setUsersList([
      ...usersList,
      {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        dashboard: formData.dashboard,
        privileges: formData.privileges,
        queryLimit: `${formData.queryLimit} / day`,
        status: 'active'
      }
    ]);
    setShowAddForm(false);
    setFormData({
      name: '',
      email: '',
      role: 'Sales Analyst',
      dashboard: 'Default Dashboard',
      privileges: 'Limited',
      queryLimit: '50',
    });
  };

  const toggleStatus = (userId) => {
    setUsersList(usersList.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
            <UsersIcon className="h-5 w-5 text-indigo-600" />
            User Access & Directory
          </h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add User
        </button>
      </div>

      {showAddForm && (
        <div className={`p-5 rounded-lg border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Provision User Account</h2>
          <form onSubmit={handleAddUser} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-1.5 rounded-md border ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john.doe@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-1.5 rounded-md border ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full px-2.5 py-1.5 rounded-md border ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                >
                  <option value="Sales Analyst">Sales Analyst</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Operations Associate">Operations Associate</option>
                  <option value="Executive Principal">Executive Principal</option>
                </select>
              </div>
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Template</label>
                <select
                  name="dashboard"
                  value={formData.dashboard}
                  onChange={handleInputChange}
                  className={`w-full px-2.5 py-1.5 rounded-md border ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                >
                  <option value="Sales Performance">Sales Performance</option>
                  <option value="Customer Acquisition">Customer Acquisition</option>
                  <option value="Operations Overview">Operations Overview</option>
                </select>
              </div>
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Policy</label>
                <select
                  name="privileges"
                  value={formData.privileges}
                  onChange={handleInputChange}
                  className={`w-full px-2.5 py-1.5 rounded-md border ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                >
                  <option value="Limited">Limited (Own Dept)</option>
                  <option value="Custom (No PII)">Custom (No PII columns)</option>
                  <option value="Strict">Strict Aggregate Only</option>
                </select>
              </div>
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Daily Quota</label>
                <input
                  type="number"
                  name="queryLimit"
                  required
                  placeholder="100"
                  value={formData.queryLimit}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-1.5 rounded-md border ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={`px-3 py-1 rounded-md border text-xs font-semibold ${
                  isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-md px-3.5 py-1 text-xs font-semibold transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users directory table */}
      <div className={`rounded-lg border overflow-hidden ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b font-semibold uppercase ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-zinc-950 border-zinc-800 text-zinc-200'
              }`}>
                <th className="px-4 py-2.5">User</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Template</th>
                <th className="px-4 py-2.5">Policy</th>
                <th className="px-4 py-2.5">Quota</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3">
                    <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{user.name}</div>
                    <div className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{user.email}</div>
                  </td>
                  <td className={`px-4 py-3 font-medium ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>{user.role}</td>
                  <td className="px-4 py-3">
                    <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[11px] px-2 py-0.5 rounded font-semibold font-mono">
                      {user.dashboard}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>{user.privileges}</td>
                  <td className={`px-4 py-3 font-mono font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>{user.queryLimit}</td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2 items-center">
                    <button
                      onClick={() => setImpersonatedUser(user)}
                      className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      <Eye className="h-3 w-3" /> Impersonate
                    </button>
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase border transition-colors ${
                        user.status === 'active'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {user.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Impersonation Portal Modal Preview */}
      {impersonatedUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-3xl rounded-lg overflow-hidden border shadow-2xl flex flex-col h-[75vh] ${
            isLight ? 'bg-white border-slate-300' : 'bg-zinc-900 border-zinc-800'
          }`}>
            <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-medium">
              <span className="flex items-center gap-1.5 font-bold font-mono">
                IMPERSONATING: {impersonatedUser.name.toUpperCase()} ({impersonatedUser.role.toUpperCase()})
              </span>
              <button onClick={() => setImpersonatedUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className={`flex-1 p-5 overflow-y-auto space-y-4 ${isLight ? 'bg-slate-50' : 'bg-zinc-950'}`}>
              <div className="flex justify-between items-center border-b pb-2.5 border-slate-200 dark:border-zinc-800">
                <div>
                  <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{impersonatedUser.dashboard}</h3>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Policy: {impersonatedUser.privileges}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                  Policy Enforced
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className={`p-3.5 rounded border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Sales ARR KPI</div>
                  <h4 className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>Monthly ARR</h4>
                  <div className="mt-2">
                    {impersonatedUser.id === 3 ? (
                      <div className="text-rose-700 dark:text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 p-1.5 rounded text-[10px]">
                        Access Restricted
                      </div>
                    ) : (
                      <div>
                        <div className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>$14,890</div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Sub-dept cleared</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`p-3.5 rounded border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Signups Chart</div>
                  <h4 className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>Signups Trend</h4>
                  <div className="mt-2 h-10 flex items-end justify-between gap-1 border-b pb-1 border-slate-200">
                    {[34, 52, 68, 71, 95].map((v, i) => (
                      <div key={i} style={{ height: `${v}%` }} className="flex-1 bg-indigo-600 rounded-t-sm"></div>
                    ))}
                  </div>
                </div>

                <div className={`p-3.5 rounded border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">PII Contact Records</div>
                  <h4 className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>Contact Queries</h4>
                  <div className="mt-2 font-mono text-[11px] space-y-1">
                    {impersonatedUser.id === 1 ? (
                      <>
                        <div className="text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-[10px] w-fit">
                          Data Masked Rule
                        </div>
                        <div className={`font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>• Email: a***@company.com</div>
                      </>
                    ) : (
                      <div className="text-rose-700 dark:text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 p-1.5 rounded text-[10px]">
                        Blocked Table Policy
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={`px-4 py-2.5 border-t flex justify-end ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-zinc-950 border-zinc-800'
            }`}>
              <button
                onClick={() => setImpersonatedUser(null)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-md transition-colors"
              >
                Exit Impersonation Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
