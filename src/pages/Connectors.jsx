import React, { useState } from 'react';
import { Database, ShieldCheck, RefreshCw, Plus, Server, Lock, Play, CheckCircle2 } from 'lucide-react';

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

  // SVG Brand Icons for DB Engines
  const dbEngines = [
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      tag: 'POSTGRES',
      svg: (
        <svg className="h-5 w-5 fill-current text-indigo-500" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5l4.5 2.5-4.5 2.5z"/>
        </svg>
      )
    },
    {
      id: 'mysql',
      name: 'MySQL',
      tag: 'MYSQL',
      svg: (
        <svg className="h-5 w-5 fill-current text-blue-500" viewBox="0 0 24 24">
          <path d="M12 3C6.477 3 2 7.477 2 13c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v6.5z"/>
        </svg>
      )
    },
    {
      id: 'sqlserver',
      name: 'SQL Server',
      tag: 'MSSQL',
      svg: (
        <svg className="h-5 w-5 fill-current text-red-500" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4h2v4zm0-6h-2V7h2v4z"/>
        </svg>
      )
    },
    {
      id: 'snowflake',
      name: 'Snowflake',
      tag: 'SNOW',
      svg: (
        <svg className="h-5 w-5 fill-current text-sky-400" viewBox="0 0 24 24">
          <path d="M12 2L9.5 7h5L12 2zm0 20l2.5-5h-5l2.5 5zM2 12l5 2.5v-5L2 12zm20 0l-5-2.5v5l5-2.5zM6 6l4 4-4 4V6zm12 0v8l-4-4 4-4z"/>
        </svg>
      )
    },
    {
      id: 'clickhouse',
      name: 'ClickHouse',
      tag: 'CLICK',
      svg: (
        <svg className="h-5 w-5 fill-current text-amber-500" viewBox="0 0 24 24">
          <path d="M4 4h4v16H4V4zm6 0h4v16h-4V4zm6 0h4v16h-4V4z"/>
        </svg>
      )
    },
    {
      id: 'sqlite',
      name: 'SQLite',
      tag: 'SQLITE',
      svg: (
        <svg className="h-5 w-5 fill-current text-emerald-500" viewBox="0 0 24 24">
          <path d="M4 6h16v12H4V6zm2 2v8h12V8H6z"/>
        </svg>
      )
    },
    {
      id: 'oracle',
      name: 'Oracle DB',
      tag: 'ORACLE',
      svg: (
        <svg className="h-5 w-5 fill-current text-rose-500" viewBox="0 0 24 24">
          <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/>
        </svg>
      )
    },
    {
      id: 'redshift',
      name: 'Amazon Redshift',
      tag: 'REDSHIFT',
      svg: (
        <svg className="h-5 w-5 fill-current text-purple-500" viewBox="0 0 24 24">
          <path d="M12 3L2 8v8l10 5 10-5V8l-10-5zm0 15.5L4 14.5v-5l8 4 8-4v5l-8 4z"/>
        </svg>
      )
    }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTestConnection = (e) => {
    e.preventDefault();
    setConnectionState('testing');
    setTimeout(() => {
      setConnectionState('success');
      setCreatedUser({
        username: `db_guardian_${formData.database.toLowerCase().substring(0, 8)}_${Math.random().toString(36).substring(2, 5)}`,
        password: Math.random().toString(36).substring(2, 15) + '!' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        privileges: 'GRANT SELECT ON ALL TABLES IN SCHEMA public TO guardian;'
      });
      
      setConnections([
        ...connections,
        {
          id: Date.now(),
          name: formData.name || 'New Connection',
          type: dbType,
          host: formData.host,
          database: formData.database,
          restrictedUser: `db_guardian_${formData.database.toLowerCase().substring(0, 8)}`,
          status: 'active',
          latency: '15ms',
          queries: 0
        }
      ]);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
          <Database className="h-5 w-5 text-indigo-600" />
          Database Connectors
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Setup Form */}
        <div className={`lg:col-span-2 p-5 rounded-lg border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          <h2 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'} mb-4 flex items-center gap-2 border-b pb-3 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
            <Plus className="h-4 w-4 text-indigo-500" />
            Provision Engine Connection
          </h2>
          
          <form onSubmit={handleTestConnection} className="space-y-4 text-xs">
            <div>
              <label className={`block font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                Target Engine ({dbEngines.length} Supported)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {dbEngines.map((db) => (
                  <button
                    key={db.id}
                    type="button"
                    onClick={() => setDbType(db.id)}
                    className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      dbType === db.id 
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold dark:bg-indigo-950/60 dark:text-indigo-300' 
                        : isLight 
                          ? 'border-slate-300 bg-slate-50 text-slate-800 hover:border-slate-400' 
                          : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {db.svg}
                    <span className="text-[11px] font-semibold">{db.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                  Connection Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Production Warehouse"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border transition-colors focus:outline-none focus:border-indigo-600 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                  Host Endpoint
                </label>
                <input
                  type="text"
                  name="host"
                  required
                  placeholder="db.prod.internal"
                  value={formData.host}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border transition-colors focus:outline-none focus:border-indigo-600 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                  Port
                </label>
                <input
                  type="number"
                  name="port"
                  required
                  placeholder="5432"
                  value={formData.port}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border transition-colors focus:outline-none focus:border-indigo-600 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                  Database
                </label>
                <input
                  type="text"
                  name="database"
                  required
                  placeholder="sales_warehouse"
                  value={formData.database}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border transition-colors focus:outline-none focus:border-indigo-600 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                  Bootstrap User
                </label>
                <input
                  type="text"
                  name="adminUser"
                  required
                  placeholder="admin_role"
                  value={formData.adminUser}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border transition-colors focus:outline-none focus:border-indigo-600 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                Bootstrap Password
              </label>
              <input
                type="password"
                name="adminPassword"
                required
                placeholder="••••••••••••"
                value={formData.adminPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md border transition-colors focus:outline-none focus:border-indigo-600 ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                }`}
              />
            </div>

            <div className={`p-3 rounded-md border flex items-center gap-2.5 font-mono text-[11px] ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-zinc-950 border-zinc-800 text-zinc-300'
            }`}>
              <Lock className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>Bootstrap credentials held in volatile memory to execute role grant SQL DDL.</span>
            </div>

            <button
              type="submit"
              disabled={connectionState === 'testing'}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-md py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {connectionState === 'testing' ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Testing & Provisioning Low-Privilege Role...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Bootstrap Connection
                </>
              )}
            </button>
          </form>

          {/* Provisioned Role Result Box */}
          {connectionState === 'success' && createdUser && (
            <div className="mt-4 border border-emerald-500/40 bg-emerald-500/10 rounded-md p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="h-4 w-4" /> Provisioned Restricted Role
              </div>
              <div className={`grid grid-cols-2 gap-2 p-2.5 rounded border font-mono text-[11px] ${
                isLight ? 'bg-white border-emerald-200 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
              }`}>
                <div>
                  <span className="text-slate-500 block uppercase">Role Name</span>
                  <span className="text-indigo-600 font-bold">{createdUser.username}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Access Key</span>
                  <span className="text-emerald-600 font-bold">{createdUser.password}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Existing Connections Fleet */}
        <div className={`p-5 rounded-lg border h-fit ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          <h2 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'} mb-4 flex items-center gap-2 border-b pb-3 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
            <Server className="h-4 w-4 text-indigo-500" />
            Connection Fleet ({connections.length})
          </h2>
          <div className="space-y-3">
            {connections.map((conn) => (
              <div key={conn.id} className={`p-3 rounded-md border text-xs space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-300' : 'bg-zinc-950 border-zinc-800'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>{conn.name}</h3>
                    <p className="text-slate-500 font-mono text-[10px]">{conn.host}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
                    {conn.latency}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 border-t pt-2 border-slate-200/50 dark:border-zinc-800">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Restricted Role</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 truncate block text-[11px]">{conn.restrictedUser}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Queries</span>
                    <span className={`font-mono font-bold text-[11px] ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>{conn.queries.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
