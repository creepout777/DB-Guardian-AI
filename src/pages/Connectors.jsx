import React, { useState } from 'react';
import { Database, ShieldCheck, RefreshCw, Plus, Server, Lock, Play, CheckCircle2, Key, Terminal } from 'lucide-react';

export default function Connectors({ theme }) {
  const [dbType, setDbType] = useState('postgresql');
  const [connectionState, setConnectionState] = useState('idle');
  const [createdUser, setCreatedUser] = useState(null);
  const [connections, setConnections] = useState([
    {
      id: 1,
      name: 'Production Warehouse',
      type: 'postgresql',
      host: 'db.prod.internal',
      database: 'sales_warehouse',
      restrictedUser: 'db_guardian_prod_82a',
      status: 'active',
      latency: '12ms',
      queries: 1420
    },
    {
      id: 2,
      name: 'Analytics Replica',
      type: 'mysql',
      host: 'mysql-replica.prod.internal',
      database: 'customer_metrics',
      restrictedUser: 'db_guardian_analytics_1a',
      status: 'active',
      latency: '18ms',
      queries: 890
    },
    {
      id: 3,
      name: 'Snowflake Data Lake',
      type: 'snowflake',
      host: 'xy12345.snowflakecomputing.com',
      database: 'ANALYTICS_DB',
      restrictedUser: 'db_guardian_sf_90',
      status: 'active',
      latency: '34ms',
      queries: 3120
    },
    {
      id: 4,
      name: 'Supabase Application DB',
      type: 'supabase',
      host: 'db.xyz.supabase.co',
      database: 'postgres',
      restrictedUser: 'db_guardian_supa_12',
      status: 'active',
      latency: '8ms',
      queries: 4520
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: '',
    database: '',
    adminUser: '',
    adminPassword: '',
  });

  const isLight = theme === 'light';

  // Authentic Official Brand SVG Logos for Database Engines
  const dbEngines = [
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      tag: 'POSTGRES',
      svg: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.53 1.03 1.53 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" fill="#336791"/>
        </svg>
      )
    },
    {
      id: 'supabase',
      name: 'Supabase',
      tag: 'SUPABASE',
      svg: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path d="M13.35 2.05a1.5 1.5 0 0 0-2.7 0L2.35 15.65A1.5 1.5 0 0 0 3.65 17.8h7.25l-1.2 5.15a1.5 1.5 0 0 0 2.7 1l8.3-13.6a1.5 1.5 0 0 0-1.3-2.15H13.15l.2-6.15z" fill="#3ECF8E"/>
        </svg>
      )
    },
    {
      id: 'mysql',
      name: 'MySQL',
      tag: 'MYSQL',
      svg: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="#00758F"/>
          <path d="M16.5 12a4.5 4.5 0 0 1-9 0" stroke="#F29111" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'snowflake',
      name: 'Snowflake',
      tag: 'SNOWFLAKE',
      svg: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="#29B5E8" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      tag: 'MONGODB',
      svg: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C11.5 5 8 8.5 8 13.5c0 3.5 2.5 6.5 4 8.5 1.5-2 4-5 4-8.5C16 8.5 12.5 5 12 2z" fill="#47A248"/>
          <path d="M12 2v20" stroke="#3F9142" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      id: 'redis',
      name: 'Redis DB',
      tag: 'REDIS',
      svg: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path d="M4 6l8-4 8 4v12l-8 4-8-4V6z" fill="#DC382D"/>
          <path d="M4 6l8 4 8-4M12 10v12" stroke="#B82B21" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      id: 'sqlserver',
      name: 'SQL Server',
      tag: 'MSSQL',
      svg: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="#CC292B"/>
          <path d="M7 8h10M7 12h10M7 16h6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'oracle',
      name: 'Oracle DB',
      tag: 'ORACLE',
      svg: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="12" rx="6" fill="#F80000"/>
          <rect x="5" y="8.5" width="14" height="7" rx="3.5" fill="#FFFFFF"/>
          <rect x="7" y="10" width="10" height="4" rx="2" fill="#F80000"/>
        </svg>
      )
    },
    {
      id: 'redshift',
      name: 'AWS Redshift',
      tag: 'REDSHIFT',
      svg: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 3l9 5v8l-9 5-9-5V8l9-5z" fill="#8C4FFF"/>
          <path d="M12 3v18M3 8l9 5 9-5" stroke="#FFFFFF" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      id: 'bigquery',
      name: 'Google BigQuery',
      tag: 'BIGQUERY',
      svg: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" fill="#4285F4"/>
          <circle cx="12" cy="12" r="5" fill="#FFFFFF"/>
          <circle cx="12" cy="12" r="3" fill="#34A853"/>
        </svg>
      )
    },
    {
      id: 'clickhouse',
      name: 'ClickHouse',
      tag: 'CLICKHOUSE',
      svg: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path d="M3 4h3v16H3V4zm5 0h3v16H8V4zm5 0h3v16h-3V4zm5 0h3v16h-3V4z" fill="#FFCC00"/>
        </svg>
      )
    },
    {
      id: 'sqlite',
      name: 'SQLite',
      tag: 'SQLITE',
      svg: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path d="M4 5h16v14H4V5z" fill="#003B5C"/>
          <path d="M7 9h10M7 12h10M7 15h6" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  const getEngineSvg = (type) => {
    const found = dbEngines.find(e => e.id === type);
    if (found) return found.svg;
    return <Database className="h-6 w-6 text-indigo-500" />;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTestConnection = (e) => {
    e.preventDefault();
    setConnectionState('testing');
    setTimeout(() => {
      setConnectionState('success');
      setCreatedUser({
        username: `db_guardian_${(formData.database || 'main').toLowerCase().substring(0, 8)}_${Math.random().toString(36).substring(2, 5)}`,
        password: Math.random().toString(36).substring(2, 15) + '!' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        permissions: ['CONNECT', 'SELECT_SCOPED_BY_RLS', 'AST_GUARDRAIL_INTERCEPT']
      });

      setConnections([
        ...connections,
        {
          id: Date.now(),
          name: formData.name || `${dbType.toUpperCase()} Gateway`,
          type: dbType,
          host: formData.host || 'localhost',
          database: formData.database || 'production_db',
          restrictedUser: `db_guardian_${(formData.database || 'db').substring(0, 6)}_user`,
          status: 'active',
          latency: '15ms',
          queries: 0
        }
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className={`flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-300' : 'border-zinc-800'}`}>
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
            <Database className="h-5 w-5 text-indigo-600" />
            Database Connectors & Zero-Trust Provisioner
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect production database engines. DB-Guardian AI provisions a dedicated scoped user account with 2-layer isolation.
          </p>
        </div>
      </div>

      {/* Grid: Provisioner Form + Connected Gateways */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Provisioner Card Form */}
        <div className={`lg:col-span-1 p-5 rounded-xl border space-y-4 ${
          isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-zinc-800">
            <h2 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
              <Plus className="h-4 w-4 text-indigo-600" />
              Provision New Connector
            </h2>
            <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
              2-TIER RLS
            </span>
          </div>

          <form onSubmit={handleTestConnection} className="space-y-4 text-xs">
            {/* Database Engine Selector */}
            <div>
              <label className={`block font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                Select Database Engine
              </label>
              <div className="grid grid-cols-4 gap-2">
                {dbEngines.slice(0, 8).map((engine) => (
                  <button
                    key={engine.id}
                    type="button"
                    onClick={() => setDbType(engine.id)}
                    className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      dbType === engine.id
                        ? 'border-indigo-600 bg-indigo-500/10 shadow-sm ring-1 ring-indigo-600'
                        : isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    {engine.svg}
                    <span className="text-[10px] font-bold font-mono truncate max-w-[55px] text-slate-700 dark:text-zinc-300">
                      {engine.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Connection Inputs */}
            <div>
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Connection Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Production Analytics Replica"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-600 ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Host / Endpoint</label>
                <input
                  type="text"
                  name="host"
                  required
                  placeholder="db.example.com"
                  value={formData.host}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-600 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Port</label>
                <input
                  type="text"
                  name="port"
                  placeholder="5432"
                  value={formData.port}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-600 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Database Name</label>
              <input
                type="text"
                name="database"
                required
                placeholder="sales_production"
                value={formData.database}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-600 ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Admin User</label>
                <input
                  type="text"
                  name="adminUser"
                  required
                  placeholder="postgres"
                  value={formData.adminUser}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-600 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Admin Password</label>
                <input
                  type="password"
                  name="adminPassword"
                  required
                  placeholder="••••••••••••"
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-600 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={connectionState === 'testing'}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-md transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {connectionState === 'testing' ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Testing & Provisioning Scoped Credentials...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Provision Scoped Connection
                </>
              )}
            </button>
          </form>

          {/* Provisioning Credentials Output Notice */}
          {createdUser && (
            <div className={`p-3.5 rounded-lg border font-mono text-[11px] space-y-2 ${
              isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between font-bold border-b pb-1.5 border-emerald-500/20">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Scoped User Account Provisioned!
                </span>
              </div>
              <div>
                <span className="text-slate-400">DB User:</span> <span className="font-bold">{createdUser.username}</span>
              </div>
              <div className="truncate">
                <span className="text-slate-400">Generated Password:</span> <span className="font-bold text-amber-500">{createdUser.password}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                • Scoped RLS Policy Applied automatically.
              </div>
            </div>
          )}
        </div>

        {/* Connected Database Engine Gateways */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Active Database Gateways ({connections.length})
            </h2>
            <span className="text-xs font-mono text-slate-400">AST Interceptor Enabled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((conn) => (
              <div
                key={conn.id}
                className={`p-4 rounded-xl border space-y-3 transition-all ${
                  isLight ? 'bg-white border-slate-300 shadow-sm hover:border-slate-400' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg border ${
                      isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950 border-zinc-800'
                    }`}>
                      {getEngineSvg(conn.type)}
                    </div>
                    <div>
                      <h3 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{conn.name}</h3>
                      <div className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">{conn.host}</div>
                    </div>
                  </div>

                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    CONNECTED
                  </span>
                </div>

                <div className="border-t pt-3 space-y-1.5 font-mono text-[11px] border-slate-200 dark:border-zinc-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Database:</span>
                    <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>{conn.database}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scoped User:</span>
                    <span className="text-indigo-500 font-bold truncate max-w-[140px]">{conn.restrictedUser}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gateway Latency:</span>
                    <span className="text-emerald-500 font-bold">{conn.latency}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-2.5 text-[10px] font-mono border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-400">Total Queries Intercepted: <strong className="text-slate-700 dark:text-zinc-200">{conn.queries}</strong></span>
                  <button
                    onClick={() => setConnections(connections.filter(c => c.id !== conn.id))}
                    className="text-rose-500 hover:underline font-semibold"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
