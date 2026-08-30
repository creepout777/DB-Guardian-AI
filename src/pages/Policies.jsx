import React, { useState } from 'react';
import { Shield, EyeOff, Lock, Unlock, Search, Terminal, Move, Network, Key, Layers, ListFilter, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function Policies({ theme }) {
  const [viewMode, setViewMode] = useState('canvas'); // 'canvas' | 'tree'
  const [searchTerm, setSearchTerm] = useState('');
  const isLight = theme === 'light';

  // Pan & Zoom viewport state
  const [zoomScale, setZoomScale] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Tables with ERD node positions and complete column type schema
  const [tables, setTables] = useState([
    {
      name: 'users',
      status: 'restricted',
      x: 30,
      y: 40,
      columns: [
        { name: 'id', type: 'BIGINT', isPk: true, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'email', type: 'VARCHAR(255)', isPk: false, isFk: false, status: 'masked', masking: 'email' },
        { name: 'password_hash', type: 'VARCHAR(255)', isPk: false, isFk: false, status: 'blocked', masking: 'none' },
        { name: 'created_at', type: 'TIMESTAMP', isPk: false, isFk: false, status: 'allowed', masking: 'none' }
      ]
    },
    {
      name: 'orders',
      status: 'allowed',
      x: 430,
      y: 40,
      columns: [
        { name: 'order_id', type: 'BIGINT', isPk: true, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'user_id', type: 'BIGINT', isPk: false, isFk: true, fkRef: 'users.id', status: 'allowed', masking: 'none' },
        { name: 'total_amount', type: 'DECIMAL(10,2)', isPk: false, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'card_number', type: 'VARCHAR(16)', isPk: false, isFk: false, status: 'blocked', masking: 'none' }
      ]
    },
    {
      name: 'transactions',
      status: 'blocked',
      x: 830,
      y: 40,
      columns: [
        { name: 'id', type: 'BIGINT', isPk: true, isFk: false, status: 'blocked', masking: 'none' },
        { name: 'order_id', type: 'BIGINT', isPk: false, isFk: true, fkRef: 'orders.order_id', status: 'blocked', masking: 'none' },
        { name: 'amount', type: 'DECIMAL(10,2)', isPk: false, isFk: false, status: 'blocked', masking: 'none' },
        { name: 'payment_gateway_token', type: 'VARCHAR(128)', isPk: false, isFk: false, status: 'blocked', masking: 'none' }
      ]
    },
    {
      name: 'products',
      status: 'allowed',
      x: 430,
      y: 320,
      columns: [
        { name: 'id', type: 'BIGINT', isPk: true, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'product_name', type: 'VARCHAR(100)', isPk: false, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'price', type: 'DECIMAL(10,2)', isPk: false, isFk: false, status: 'allowed', masking: 'none' },
        { name: 'stock_quantity', type: 'INTEGER', isPk: false, isFk: false, status: 'allowed', masking: 'none' }
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
    if (e.target.closest('.table-node')) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!draggingTableName) return;
    const dx = (e.clientX - dragStart.x) / zoomScale;
    const dy = (e.clientY - dragStart.y) / zoomScale;

    setTables(tables.map(t => {
      if (t.name === draggingTableName) {
        return {
          ...t,
          x: Math.max(0, t.x + dx),
          y: Math.max(0, t.y + dy)
        };
      }
      return t;
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDraggingTableName(null);
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoomScale(prev => Math.min(2.0, Math.max(0.4, parseFloat((prev * zoomFactor).toFixed(2)))));
  };

  const handleZoomIn = () => setZoomScale(prev => Math.min(2.0, parseFloat((prev + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoomScale(prev => Math.max(0.4, parseFloat((prev - 0.15).toFixed(2))));
  const handleResetZoom = () => {
    setZoomScale(1.0);
    setPanOffset({ x: 0, y: 0 });
  };

  const toggleTableStatus = (tableName) => {
    setTables(tables.map(table => {
      if (table.name === tableName) {
        const nextStatus = table.status === 'allowed' ? 'restricted' : table.status === 'restricted' ? 'blocked' : 'allowed';
        const updatedColumns = table.columns.map(col => ({
          ...col,
          status: nextStatus === 'blocked' ? 'blocked' : col.status
        }));
        return { ...table, status: nextStatus, columns: updatedColumns };
      }
      return table;
    }));
  };

  const toggleColumnStatus = (tableName, columnName) => {
    setTables(tables.map(table => {
      if (table.name === tableName) {
        const updatedColumns = table.columns.map(col => {
          if (col.name === columnName) {
            const nextStatus = col.status === 'allowed' ? 'blocked' : col.status === 'blocked' ? 'masked' : 'allowed';
            return { ...col, status: nextStatus, masking: nextStatus === 'masked' ? 'email' : 'none' };
          }
          return col;
        });
        const allBlocked = updatedColumns.every(c => c.status === 'blocked');
        const allAllowed = updatedColumns.every(c => c.status === 'allowed');
        const status = allBlocked ? 'blocked' : allAllowed ? 'allowed' : 'restricted';
        return { ...table, status, columns: updatedColumns };
      }
      return table;
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

  // Helper to compute SVG connector curve paths
  const getTable = (name) => tables.find(t => t.name === name) || { x: 0, y: 0 };
  
  const usersTable = getTable('users');
  const ordersTable = getTable('orders');
  const transactionsTable = getTable('transactions');

  // Curve 1: orders.user_id (FK) -> users.id (PK)
  const path1_startX = ordersTable.x;
  const path1_startY = ordersTable.y + 72;
  const path1_endX = usersTable.x + 320;
  const path1_endY = usersTable.y + 45;
  const path1_d = `M ${path1_startX} ${path1_startY} C ${path1_startX - 60} ${path1_startY}, ${path1_endX + 60} ${path1_endY}, ${path1_endX} ${path1_endY}`;

  // Curve 2: transactions.order_id (FK) -> orders.order_id (PK)
  const path2_startX = transactionsTable.x;
  const path2_startY = transactionsTable.y + 72;
  const path2_endX = ordersTable.x + 320;
  const path2_endY = ordersTable.y + 45;
  const path2_d = `M ${path2_startX} ${path2_startY} C ${path2_startX - 60} ${path2_startY}, ${path2_endX + 60} ${path2_endY}, ${path2_endX} ${path2_endY}`;

  return (
    <div className="space-y-6" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200/50 dark:border-zinc-800">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
            <Shield className="h-5 w-5 text-indigo-600" />
            IAM Guardrail Policies & Schema ERD
          </h1>
        </div>

        <div className={`flex p-1 rounded-md border ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-zinc-900 border-zinc-800'}`}>
          <button
            onClick={() => setViewMode('canvas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
              viewMode === 'canvas' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : isLight ? 'text-slate-800 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            Interactive ERD Schema Canvas
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
              viewMode === 'tree' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : isLight ? 'text-slate-800 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ListFilter className="h-3.5 w-3.5" />
            Policy Tree View
          </button>
        </div>
      </div>

      {/* Quick stats banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-3.5 rounded-lg border flex items-center gap-3 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          <div className="p-2 rounded bg-emerald-500/10 text-emerald-600 font-bold">
            <Unlock className="h-4 w-4" />
          </div>
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Accessible Tables</div>
            <div className={`text-base font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{tables.filter(t => t.status === 'allowed').length}</div>
          </div>
        </div>
        <div className={`p-3.5 rounded-lg border flex items-center gap-3 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          <div className="p-2 rounded bg-amber-500/10 text-amber-600 font-bold">
            <EyeOff className="h-4 w-4" />
          </div>
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Restricted / Masked</div>
            <div className={`text-base font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{tables.filter(t => t.status === 'restricted').length}</div>
          </div>
        </div>
        <div className={`p-3.5 rounded-lg border flex items-center gap-3 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          <div className="p-2 rounded bg-rose-500/10 text-rose-600 font-bold">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Blocked Assets</div>
            <div className={`text-base font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {tables.filter(t => t.status === 'blocked').length + procedures.filter(p => p.status === 'blocked').length}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive ERD Schema Canvas */}
      {viewMode === 'canvas' && (
        <div className="space-y-3">
          {/* Top Control Bar with Zoom Buttons & Hints */}
          <div className={`p-3 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono ${
            isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
          }`}>
            <span className="flex items-center gap-1.5 font-semibold">
              <Move className="h-3.5 w-3.5 text-indigo-600" />
              Scroll wheel to Zoom. Drag background to Pan. Drag node headers to move tables.
            </span>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                className={`p-1 rounded border transition-colors ${
                  isLight ? 'bg-white border-slate-300 hover:bg-slate-200 text-slate-800' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-800 text-zinc-200'
                }`}
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="px-2 py-0.5 font-mono font-bold text-[11px] text-indigo-600 min-w-[48px] text-center">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className={`p-1 rounded border transition-colors ${
                  isLight ? 'bg-white border-slate-300 hover:bg-slate-200 text-slate-800' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-800 text-zinc-200'
                }`}
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className={`p-1 ml-1 rounded border transition-colors flex items-center gap-1 text-[11px] font-bold ${
                  isLight ? 'bg-white border-slate-300 hover:bg-slate-200 text-slate-800' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-800 text-zinc-200'
                }`}
                title="Reset View 100%"
              >
                <Maximize2 className="h-3 w-3" /> Fit View
              </button>
            </div>
          </div>

          {/* Interactive ERD Canvas Workspace */}
          <div
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            className={`relative h-[600px] w-full rounded-xl border overflow-hidden select-none cursor-grab active:cursor-grabbing ${
              isLight ? 'bg-slate-100/70 border-slate-300' : 'bg-zinc-950 border-zinc-800'
            }`}
            style={{
              backgroundImage: isLight ? 'radial-gradient(#cbd5e1 1px, transparent 1px)' : 'radial-gradient(#27272a 1px, transparent 1px)',
              backgroundSize: `${16 * zoomScale}px ${16 * zoomScale}px`,
              backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
            }}
          >
            {/* Viewport Transform Container */}
            <div
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                transformOrigin: '0 0',
                width: '100%',
                height: '100%'
              }}
            >
              {/* SVG Relationship Connector Lines Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
                  </marker>
                </defs>
                
                {/* Line 1: orders.user_id -> users.id */}
                <path
                  d={path1_d}
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="6 3"
                  markerEnd="url(#arrow)"
                />

                {/* Line 2: transactions.order_id -> orders.order_id */}
                <path
                  d={path2_d}
                  stroke="#10b981"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="6 3"
                  markerEnd="url(#arrow)"
                />
              </svg>

              {/* Table Nodes */}
              {tables.map((table) => (
                <div
                  key={table.name}
                  style={{ position: 'absolute', left: `${table.x}px`, top: `${table.y}px`, zIndex: draggingTableName === table.name ? 30 : 20 }}
                  className={`table-node w-80 rounded-lg border shadow-md transition-shadow ${
                    isLight ? 'bg-white border-slate-300 hover:shadow-lg' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Node Header (Draggable) */}
                  <div
                    onMouseDown={(e) => handleMouseDown(e, table.name)}
                    className={`px-3.5 py-2 flex justify-between items-center cursor-move border-b ${
                      isLight ? 'bg-slate-100 border-slate-300' : 'bg-zinc-950 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <Layers className="h-3.5 w-3.5 text-indigo-600" />
                      <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{table.name}</span>
                    </div>
                    <button
                      onClick={() => toggleTableStatus(table.name)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border transition-all ${
                        table.status === 'allowed'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : table.status === 'restricted'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {table.status}
                    </button>
                  </div>

                  {/* Column Node Rows */}
                  <div className="divide-y divide-slate-200 dark:divide-zinc-800/60 text-xs">
                    {table.columns.map((col) => (
                      <div
                        key={col.name}
                        onClick={() => toggleColumnStatus(table.name, col.name)}
                        className={`px-3.5 py-2 flex items-center justify-between cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-zinc-800/50 transition-colors ${
                          col.status === 'blocked' ? 'bg-rose-500/5' : col.status === 'masked' ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-mono">
                          {col.isPk && (
                            <span className="text-[9px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-1 rounded">
                              PK
                            </span>
                          )}
                          {col.isFk && (
                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 px-1 rounded" title={`Foreign Key ➔ ${col.fkRef}`}>
                              FK
                            </span>
                          )}
                          <span className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>{col.name}</span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[10px]">
                          <span className="text-slate-400">{col.type}</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                            col.status === 'allowed'
                              ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10'
                              : col.status === 'masked'
                              ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10'
                              : 'text-rose-700 dark:text-rose-400 bg-rose-500/10'
                          }`}>
                            {col.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Foreign Key Mappings Panel */}
          <div className={`p-4 rounded-lg border text-xs font-mono space-y-2 ${
            isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'
          }`}>
            <div className={`font-bold border-b pb-2 uppercase tracking-wider ${isLight ? 'text-slate-900 border-slate-200' : 'text-white border-zinc-800'} flex items-center gap-1.5`}>
              <Key className="h-3.5 w-3.5 text-indigo-600" />
              Active Foreign Key Relationships
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-zinc-300">
              <div className="p-2 rounded border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-center justify-between">
                <span>• <strong className="text-indigo-600">orders.user_id</strong> ➔ users.id</span>
                <span className="text-[10px] text-indigo-500 font-bold">SVG BLUE LINE</span>
              </div>
              <div className="p-2 rounded border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-center justify-between">
                <span>• <strong className="text-emerald-600">transactions.order_id</strong> ➔ orders.order_id</span>
                <span className="text-[10px] text-emerald-500 font-bold">SVG GREEN LINE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Policy Tree List View */}
      {viewMode === 'tree' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className={`xl:col-span-2 p-5 rounded-lg border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
            <div className={`flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between border-b pb-3 ${
              isLight ? 'border-slate-200' : 'border-zinc-800'
            }`}>
              <h2 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5`}>
                <Shield className="h-4 w-4 text-indigo-600" />
                Table & Column Rules
              </h2>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter schemas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1 rounded border text-xs focus:outline-none focus:border-indigo-600 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              {tables
                .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.columns.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())))
                .map((table) => (
                  <div key={table.name} className={`rounded-md border overflow-hidden ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-zinc-950/60 border-zinc-800'
                  }`}>
                    <div className={`px-3 py-2 flex justify-between items-center border-b ${
                      isLight ? 'bg-slate-100 border-slate-300' : 'bg-zinc-900/60 border-zinc-800'
                    }`}>
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className={`font-semibold uppercase ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>TABLE</span>
                        <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{table.name}</span>
                      </div>
                      <button
                        onClick={() => toggleTableStatus(table.name)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border transition-all ${
                          table.status === 'allowed'
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : table.status === 'restricted'
                            ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                            : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {table.status}
                      </button>
                    </div>

                    <div className="divide-y divide-slate-200 dark:divide-zinc-800 px-3">
                      {table.columns.map((column) => (
                        <div key={column.name} className="py-2 flex items-center justify-between">
                          <span className={`font-mono font-medium ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>{column.name}</span>
                          <button
                            onClick={() => toggleColumnStatus(table.name, column.name)}
                            disabled={table.status === 'blocked'}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                              column.status === 'allowed'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : column.status === 'masked'
                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {column.status === 'allowed' ? 'Visible' : column.status === 'masked' ? 'Masked' : 'Blocked'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className={`p-5 rounded-lg border h-fit ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
            <div className={`border-b pb-3 mb-3 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
              <h2 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5`}>
                <Terminal className="h-4 w-4 text-indigo-600" />
                Stored Procedures Guard
              </h2>
            </div>

            <div className="space-y-2.5 text-xs">
              {procedures.map((proc) => (
                <div key={proc.name} className={`p-3 rounded-md border ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-zinc-950 border-zinc-800'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-mono text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{proc.name}</h4>
                      <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{proc.description}</p>
                    </div>
                    <button
                      onClick={() => toggleProcedureStatus(proc.name)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border transition-all ${
                        proc.status === 'allowed'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {proc.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
