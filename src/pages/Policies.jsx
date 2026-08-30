import React, { useState } from 'react';
import { Shield, EyeOff, Lock, Unlock, Search, Terminal, Move, Network, Key, Layers, ListFilter, ZoomIn, ZoomOut, Maximize2, RefreshCw } from 'lucide-react';

export default function Policies({ theme }) {
  const [viewMode, setViewMode] = useState('canvas'); // 'canvas' | 'tree'
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const isLight = theme === 'light';

  // Pan & Zoom viewport state
  const [zoomScale, setZoomScale] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Tables with ERD node positions and complete column type schema
  const [tables, setTables] = useState([
    {
      name: 'users (auth.users)',
      status: 'restricted',
      x: 30,
      y: 40,
      columns: [
        { name: 'id', type: 'UUID', isPk: true, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'email', type: 'VARCHAR(255)', isPk: false, isFk: false, status: 'masked', masking: 'email' },
        { name: 'encrypted_password', type: 'VARCHAR(255)', isPk: false, isFk: false, status: 'blocked', masking: 'none' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isPk: false, isFk: false, status: 'allowed', masking: 'none' }
      ]
    },
    {
      name: 'profiles',
      status: 'allowed',
      x: 430,
      y: 40,
      columns: [
        { name: 'id', type: 'UUID', isPk: true, isFk: true, fkRef: 'users.id', status: 'allowed', masking: 'none' },
        { name: 'full_name', type: 'TEXT', isPk: false, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'role', type: 'VARCHAR(50)', isPk: false, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isPk: false, isFk: false, status: 'allowed', masking: 'none' }
      ]
    },
    {
      name: 'dashboards',
      status: 'allowed',
      x: 830,
      y: 40,
      columns: [
        { name: 'id', type: 'UUID', isPk: true, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'user_id', type: 'UUID', isPk: false, isFk: true, fkRef: 'profiles.id', status: 'allowed', masking: 'none' },
        { name: 'title', type: 'VARCHAR(255)', isPk: false, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'layout_config', type: 'JSONB', isPk: false, isFk: false, status: 'allowed', masking: 'none' }
      ]
    },
    {
      name: 'orders',
      status: 'allowed',
      x: 30,
      y: 340,
      columns: [
        { name: 'order_id', type: 'BIGINT', isPk: true, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'user_id', type: 'UUID', isPk: false, isFk: true, fkRef: 'users.id', status: 'allowed', masking: 'none' },
        { name: 'total_amount', type: 'DECIMAL(10,2)', isPk: false, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'card_number', type: 'VARCHAR(16)', isPk: false, isFk: false, status: 'blocked', masking: 'none' }
      ]
    },
    {
      name: 'policy_audit_logs',
      status: 'allowed',
      x: 430,
      y: 340,
      columns: [
        { name: 'id', type: 'UUID', isPk: true, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'user_id', type: 'UUID', isPk: false, isFk: true, fkRef: 'users.id', status: 'allowed', masking: 'none' },
        { name: 'action', type: 'VARCHAR(100)', isPk: false, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isPk: false, isFk: false, status: 'allowed', masking: 'none' }
      ]
    },
    {
      name: 'vercel_test_logs',
      status: 'allowed',
      x: 830,
      y: 340,
      columns: [
        { name: 'id', type: 'UUID', isPk: true, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'message', type: 'TEXT', isPk: false, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'status', type: 'VARCHAR(50)', isPk: false, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isPk: false, isFk: false, status: 'allowed', masking: 'none' }
      ]
    }
  ]);

  const [procedures, setProcedures] = useState([
    { name: 'calculate_monthly_dividends()', status: 'allowed', description: 'Computes interest payouts' },
    { name: 'purge_inactive_accounts()', status: 'blocked', description: 'Hard-deletes stale user logins' },
    { name: 'override_credit_limits()', status: 'blocked', description: 'Updates risk profile metadata' }
  ]);

  // Node dragging state
  const [draggingTableName, setDraggingTableName] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const handleWheelNonPassive = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setZoomScale(prev => Math.min(2.0, Math.max(0.4, parseFloat((prev * zoomFactor).toFixed(2)))));
    };

    canvasEl.addEventListener('wheel', handleWheelNonPassive, { passive: false });
    return () => {
      canvasEl.removeEventListener('wheel', handleWheelNonPassive);
    };
  }, []);

  const handleMouseDown = (e, tableName) => {
    e.stopPropagation();
    setDraggingTableName(tableName);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseDown = (e) => {
    if (e.target.closest('.table-node-card')) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (draggingTableName) {
      const dx = (e.clientX - dragStart.x) / zoomScale;
      const dy = (e.clientY - dragStart.y) / zoomScale;

      setTables(prevTables =>
        prevTables.map(tbl => {
          if (tbl.name === draggingTableName) {
            return { ...tbl, x: Math.max(0, tbl.x + dx), y: Math.max(0, tbl.y + dy) };
          }
          return tbl;
        })
      );
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingTableName(null);
    setIsPanning(false);
  };

  const handleSyncSchema = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const toggleTableStatus = (tableName) => {
    setTables(tables.map(t => {
      if (t.name === tableName) {
        const nextStatus = t.status === 'allowed' ? 'restricted' : t.status === 'restricted' ? 'blocked' : 'allowed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const toggleColumnStatus = (tableName, colName) => {
    setTables(tables.map(t => {
      if (t.name === tableName) {
        const updatedCols = t.columns.map(c => {
          if (c.name === colName) {
            const nextStatus = c.status === 'allowed' ? 'masked' : c.status === 'masked' ? 'blocked' : 'allowed';
            return { ...c, status: nextStatus };
          }
          return c;
        });
        return { ...t, columns: updatedCols };
      }
      return t;
    }));
  };

  const toggleProcedureStatus = (procName) => {
    setProcedures(procedures.map(p => {
      if (p.name === procName) {
        return { ...p, status: p.status === 'allowed' ? 'blocked' : 'allowed' };
      }
      return p;
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'allowed':
        return <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono">ALLOWED</span>;
      case 'masked':
        return <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono">MASKED</span>;
      case 'restricted':
        return <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono">RESTRICTED</span>;
      case 'blocked':
        return <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono">BLOCKED</span>;
      default:
        return null;
    }
  };

  // Helper to calculate foreign key SVG Bezier curve paths between tables
  const renderRelationships = () => {
    const lines = [];

    tables.forEach(sourceTable => {
      sourceTable.columns.forEach((col, colIdx) => {
        if (col.isFk && col.fkRef) {
          const [targetTableName, targetColName] = col.fkRef.split('.');
          const targetTable = tables.find(t => t.name.startsWith(targetTableName));

          if (targetTable) {
            const rowHeight = 28;
            const headerHeight = 44;

            // Source FK attachment point (Right side of source table card)
            const x1 = sourceTable.x + 320;
            const y1 = sourceTable.y + headerHeight + (colIdx * rowHeight) + 14;

            // Target PK attachment point (Left side of target table card)
            const targetColIdx = targetTable.columns.findIndex(c => c.name === targetColName);
            const x2 = targetTable.x;
            const y2 = targetTable.y + headerHeight + (Math.max(0, targetColIdx) * rowHeight) + 14;

            // Smooth Bezier Curve Control Points
            const dx = Math.abs(x2 - x1) * 0.4;
            const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

            lines.push(
              <g key={`${sourceTable.name}-${col.name}-${targetTable.name}`}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={isLight ? '#6366f1' : '#818cf8'}
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            );
          }
        }
      });
    });

    return lines;
  };

  const filteredTables = tables.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.columns.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 ${
        isLight ? 'border-slate-300' : 'border-zinc-800'
      }`}>
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
            <Shield className="h-5 w-5 text-indigo-600" />
            IAM Guardrail Policies & Schema Visualizer
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSyncSchema}
            disabled={isSyncing}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all flex items-center gap-1.5 ${
              isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100' : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
            Sync Database Schema
          </button>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search table or field..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-8 pr-3 py-1.5 text-xs border rounded-md focus:outline-none focus:border-indigo-600 ${
                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
              }`}
            />
          </div>

          <div className={`flex p-1 rounded-md border ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-zinc-900 border-zinc-800'}`}>
            <button
              onClick={() => setViewMode('canvas')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1 ${
                viewMode === 'canvas' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : isLight ? 'text-slate-700 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              ERD Canvas
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1 ${
                viewMode === 'tree' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : isLight ? 'text-slate-700 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Tree View
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE: INTERACTIVE ERD CANVAS WITH PAN & ZOOM */}
      {viewMode === 'canvas' && (
        <div className="space-y-3">
          {/* Controls Bar for Zoom & Pan */}
          <div className={`p-2.5 rounded-lg border flex flex-wrap items-center justify-between gap-3 text-xs ${
            isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-[11px] font-bold uppercase ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                Viewport Zoom: {(zoomScale * 100).toFixed(0)}%
              </span>
              <button
                onClick={() => setZoomScale(prev => Math.min(2.0, parseFloat((prev + 0.1).toFixed(2))))}
                className={`p-1 rounded border transition-colors ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                }`}
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(prev => Math.max(0.4, parseFloat((prev - 0.1).toFixed(2))))}
                className={`p-1 rounded border transition-colors ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                }`}
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => { setZoomScale(1.0); setPanOffset({ x: 0, y: 0 }); }}
                className={`px-2 py-0.5 rounded border text-[11px] font-mono font-semibold transition-colors ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                }`}
              >
                Reset 100%
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>• Click & Drag Header to Reposition Node</span>
              <span>• Drag Canvas Background to Pan Viewport</span>
            </div>
          </div>

          {/* Interactive Canvas Board */}
          <div
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className={`relative h-[650px] w-full rounded-xl border overflow-hidden cursor-grab active:cursor-grabbing select-none transition-colors ${
              isLight ? 'bg-slate-100/70 border-slate-300' : 'bg-zinc-950 border-zinc-800'
            }`}
            style={{
              backgroundImage: isLight 
                ? 'radial-gradient(#cbd5e1 1px, transparent 1px)' 
                : 'radial-gradient(#27272a 1px, transparent 1px)',
              backgroundSize: `${24 * zoomScale}px ${24 * zoomScale}px`
            }}
          >
            {/* SVG Layer for Relationship Curves */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                transformOrigin: '0 0'
              }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 8 3, 0 6"
                    fill={isLight ? '#6366f1' : '#818cf8'}
                  />
                </marker>
              </defs>
              {renderRelationships()}
            </svg>

            {/* Transformable Canvas Workspace */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                transformOrigin: '0 0'
              }}
            >
              {filteredTables.map((table) => (
                <div
                  key={table.name}
                  style={{
                    left: `${table.x}px`,
                    top: `${table.y}px`,
                    position: 'absolute'
                  }}
                  className={`table-node-card w-80 rounded-lg border shadow-lg pointer-events-auto transition-shadow ${
                    isLight ? 'bg-white border-slate-300' : 'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  {/* Table Header Card (Draggable Handle) */}
                  <div
                    onMouseDown={(e) => handleMouseDown(e, table.name)}
                    className={`h-11 px-3.5 border-b flex items-center justify-between cursor-move rounded-t-lg ${
                      table.status === 'blocked' 
                        ? 'bg-rose-500/10 border-rose-500/30' 
                        : table.status === 'restricted'
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Move className="h-3.5 w-3.5 text-slate-400" />
                      <span className={`font-mono text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {table.name}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleTableStatus(table.name)}
                      className="cursor-pointer"
                      title="Toggle Table Policy Status"
                    >
                      {getStatusBadge(table.status)}
                    </button>
                  </div>

                  {/* Column Schema Rows */}
                  <div className="p-2 space-y-1 text-xs">
                    {table.columns.map((col) => (
                      <div
                        key={col.name}
                        className={`h-7 px-2.5 rounded flex items-center justify-between font-mono text-[11px] transition-colors ${
                          col.status === 'blocked' 
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                            : col.status === 'masked'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800/60 text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {col.isPk ? (
                            <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1 rounded">PK</span>
                          ) : col.isFk ? (
                            <span className="text-[9px] font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-1 rounded">FK</span>
                          ) : (
                            <span className="w-5"></span>
                          )}

                          <span className="font-semibold truncate">{col.name}</span>
                          <span className="text-[9px] text-slate-400">({col.type})</span>
                        </div>

                        <button
                          onClick={() => toggleColumnStatus(table.name, col.name)}
                          className="cursor-pointer shrink-0 ml-2"
                          title="Toggle Field Masking/Access"
                        >
                          {col.status === 'allowed' && <Unlock className="h-3 w-3 text-emerald-500" />}
                          {col.status === 'masked' && <EyeOff className="h-3 w-3 text-amber-500" />}
                          {col.status === 'blocked' && <Lock className="h-3 w-3 text-rose-500" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: TREE LIST VIEW */}
      {viewMode === 'tree' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 p-5 rounded-xl border space-y-4 ${
            isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'
          }`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Database Entity Access Tree
            </h2>

            <div className="space-y-3">
              {filteredTables.map((table) => (
                <div key={table.name} className={`p-4 rounded-lg border space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'
                }`}>
                  <div className="flex items-center justify-between border-b pb-2 border-slate-200/60 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-indigo-600" />
                      <span className={`font-mono text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {table.name}
                      </span>
                    </div>
                    {getStatusBadge(table.status)}
                  </div>

                  <div className="space-y-1 font-mono text-xs">
                    {table.columns.map((col) => (
                      <div key={col.name} className="flex justify-between items-center py-1">
                        <span className={`text-[11px] ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>
                          {col.name} <span className="text-slate-400">({col.type})</span>
                        </span>
                        {getStatusBadge(col.status)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-5 rounded-xl border space-y-4 h-fit ${
            isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'
          }`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Stored Procedures & Functions
            </h2>

            <div className="space-y-3">
              {procedures.map((proc) => (
                <div key={proc.name} className={`p-3 rounded-lg border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'
                }`}>
                  <div>
                    <div className={`font-mono text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{proc.name}</div>
                    <div className="text-[10px] text-slate-400">{proc.description}</div>
                  </div>

                  <button onClick={() => toggleProcedureStatus(proc.name)}>
                    {getStatusBadge(proc.status)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
