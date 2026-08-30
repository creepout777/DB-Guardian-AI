import React, { useState, useEffect } from 'react';
import { Play, Sparkles, ShieldCheck, ShieldAlert, BarChart3, Terminal, Plus, Layout, Trash2, RefreshCw, X, Activity, Maximize2, Minimize2, ArrowLeft, ArrowRight, Eye, GripVertical } from 'lucide-react';

export default function Dashboard({ theme, preloadedTemplate, clearPreloadedTemplate }) {
  const [activeMode, setActiveMode] = useState('builder');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const isLight = theme === 'light';
  
  // 8 Enterprise Dashboard Widgets Gallery with Span & Order Metadata
  const [widgets, setWidgets] = useState([
    {
      id: 1,
      title: 'Total Active Subscriptions',
      type: 'metric',
      span: 1,
      query: 'SELECT SUM(amount) FROM subscriptions WHERE status = "active";',
      value: '$48,210',
      subtext: '+4.5% vs last month',
      chartType: 'none'
    },
    {
      id: 2,
      title: 'User Signups Over Time',
      type: 'chart',
      chartType: 'bar',
      span: 2,
      query: 'SELECT DATE_TRUNC("month", created_at), COUNT(id) FROM users GROUP BY 1;',
      chartData: [
        { label: 'Jan', value: 120 },
        { label: 'Feb', value: 210 },
        { label: 'Mar', value: 340 },
        { label: 'Apr', value: 290 },
        { label: 'May', value: 480 },
        { label: 'Jun', value: 610 }
      ]
    },
    {
      id: 3,
      title: 'Customer Churn Risk Segment',
      type: 'segment',
      span: 1,
      query: 'SELECT risk_tier, COUNT(*) FROM customer_analytics GROUP BY 1;',
      segments: [
        { label: 'Low Risk', value: 65, color: 'bg-emerald-500' },
        { label: 'Medium Risk', value: 25, color: 'bg-amber-500' },
        { label: 'High Risk', value: 10, color: 'bg-rose-500' }
      ]
    },
    {
      id: 4,
      title: 'Average Order Value (AOV)',
      type: 'metric',
      span: 1,
      query: 'SELECT AVG(total_price) FROM orders WHERE checkout_status = "completed";',
      value: '$142.50',
      subtext: '+12.8% checkout growth',
      chartType: 'none'
    },
    {
      id: 5,
      title: 'Top Purchasing Regions',
      type: 'chart',
      chartType: 'bar',
      span: 2,
      query: 'SELECT region_code, COUNT(order_id) FROM orders GROUP BY 1 LIMIT 4;',
      chartData: [
        { label: 'US-East', value: 450 },
        { label: 'EU-West', value: 310 },
        { label: 'APAC', value: 240 },
        { label: 'LATAM', value: 120 }
      ]
    },
    {
      id: 6,
      title: 'API Response Latency SLA',
      type: 'metric',
      span: 1,
      query: 'SELECT AVG(duration_ms) FROM gateway_logs WHERE timestamp >= NOW() - INTERVAL "1 HOUR";',
      value: '14.2 ms',
      subtext: '99.98% System Uptime SLA',
      chartType: 'none'
    },
    {
      id: 7,
      title: 'High-Value Transaction Audit',
      type: 'chart',
      chartType: 'list',
      span: 2,
      query: 'SELECT transaction_id, user_id, amount FROM transactions WHERE amount > 5000 LIMIT 3;'
    },
    {
      id: 8,
      title: 'Net Recurring Revenue (NRR)',
      type: 'metric',
      span: 2,
      query: 'SELECT (arr_expansion - arr_churn) / arr_baseline FROM financial_ledger;',
      value: '118.4%',
      subtext: 'Top decile SaaS expansion',
      chartType: 'none'
    }
  ]);

  useEffect(() => {
    if (preloadedTemplate) {
      const templateWidgets = preloadedTemplate.widgets.map((w, idx) => ({
        id: Date.now() + idx,
        title: w.title,
        type: w.type,
        span: 1,
        query: w.query,
        value: w.value || null,
        subtext: w.subtext || null,
        chartType: w.chartType || 'none',
        chartData: w.chartType === 'bar' ? [
          { label: 'Q1', value: 340 },
          { label: 'Q2', value: 580 },
          { label: 'Q3', value: 720 },
          { label: 'Q4', value: 910 }
        ] : null
      }));
      setWidgets(templateWidgets);
      setActiveMode('builder');
      if (clearPreloadedTemplate) clearPreloadedTemplate();
    }
  }, [preloadedTemplate]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newWidget, setNewWidget] = useState({
    title: '',
    nlPrompt: '',
    generatedSql: '',
    type: 'metric',
    chartType: 'bar',
    span: 1,
    value: '$0.00',
    subtext: 'Calculated in real-time',
    astCheck: 'idle',
    astError: ''
  });

  const [studioQuery, setStudioQuery] = useState('Show monthly user signups in 2026');
  const [studioLoading, setStudioLoading] = useState(false);
  const [studioResult, setStudioResult] = useState(null);

  // HTML5 Drag-and-Drop Handlers for Widget Reordering
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...widgets];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    setWidgets(updated);
    setDraggedIndex(null);
  };

  // Admin Controls: Move Widget Position Button Fallback
  const moveWidget = (index, direction) => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= widgets.length) return;
    const newArr = [...widgets];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;
    setWidgets(newArr);
  };

  // Admin Controls: Change Widget Grid Span Size
  const changeWidgetSpan = (id, spanSize) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, span: spanSize } : w));
  };

  const handleTranslateWidgetQuery = () => {
    if (!newWidget.nlPrompt.trim()) return;
    setNewWidget(prev => ({ ...prev, astCheck: 'validating' }));
    
    setTimeout(() => {
      const promptLower = newWidget.nlPrompt.toLowerCase();
      if (promptLower.includes('password') || promptLower.includes('ssn') || promptLower.includes('card_number') || promptLower.includes('purge') || promptLower.includes('override')) {
        setNewWidget(prev => ({
          ...prev,
          astCheck: 'failed',
          astError: 'AST Policy Violation: Access to restricted table/column pattern denied.'
        }));
      } else {
        setNewWidget(prev => ({
          ...prev,
          astCheck: 'passed',
          generatedSql: prev.type === 'metric' 
            ? 'SELECT SUM(revenue) FROM orders WHERE created_at >= \'2026-01-01\';' 
            : 'SELECT segment_name, COUNT(*) FROM customers GROUP BY 1;',
          value: '$12,480',
          subtext: 'Auto-synchronized query result'
        }));
      }
    }, 1200);
  };

  const handleSaveWidget = () => {
    setWidgets([
      ...widgets,
      {
        id: Date.now(),
        title: newWidget.title || 'New Policy-Checked Widget',
        type: newWidget.type,
        chartType: newWidget.chartType,
        span: parseInt(newWidget.span) || 1,
        query: newWidget.generatedSql || 'SELECT 1;',
        value: newWidget.value,
        subtext: newWidget.subtext,
        chartData: newWidget.chartType === 'bar' ? [
          { label: 'Jan', value: 80 },
          { label: 'Feb', value: 140 },
          { label: 'Mar', value: 210 },
          { label: 'Apr', value: 180 }
        ] : null
      }
    ]);
    setShowAddModal(false);
    setNewWidget({
      title: '',
      nlPrompt: '',
      generatedSql: '',
      type: 'metric',
      chartType: 'bar',
      span: 1,
      value: '$0.00',
      subtext: 'Calculated in real-time',
      astCheck: 'idle',
      astError: ''
    });
  };

  const handleRemoveWidget = (id) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const handleRunStudioQuery = (e) => {
    e.preventDefault();
    if (!studioQuery.trim()) return;

    setStudioLoading(true);
    setStudioResult(null);

    setTimeout(() => {
      setStudioLoading(false);
      const queryLower = studioQuery.toLowerCase();

      if (queryLower.includes('purge') || queryLower.includes('procedure') || queryLower.includes('override')) {
        setStudioResult({
          status: 'blocked',
          violation: 'Stored Procedure Exec Denied',
          message: 'Execution of stored procedures [purge_inactive_accounts, override_credit_limits] is blocked by policy.',
          code: 'PROC_EXEC_BLOCKED',
          astParseTime: '1.4ms',
          generatedSql: 'CALL purge_inactive_accounts();'
        });
      } else if (queryLower.includes('password') || queryLower.includes('ssn') || queryLower.includes('card_number')) {
        setStudioResult({
          status: 'blocked',
          violation: 'AST Guardrail Policy Violation',
          message: 'Access to columns containing restricted patterns [password_hash, card_number] is strictly blocked.',
          code: 'BLOCK_RULE_192',
          astParseTime: '1.2ms',
          generatedSql: 'SELECT email, password_hash FROM users WHERE created_at > \'2026-01-01\';'
        });
      } else if (queryLower.includes('transaction') || queryLower.includes('payment')) {
        setStudioResult({
          status: 'blocked',
          violation: 'Table Restriction Enforced',
          message: 'The table [transactions] has been completely blocked by administrative security policy.',
          code: 'TABLE_BLOCKED_ERR',
          astParseTime: '0.9ms',
          generatedSql: 'SELECT * FROM transactions LIMIT 10;'
        });
      } else if (queryLower.includes('email') || queryLower.includes('user')) {
        setStudioResult({
          status: 'success',
          astParseTime: '2.4ms',
          generatedSql: 'SELECT id, email, created_at FROM users WHERE created_at >= \'2026-01-01\' ORDER BY created_at DESC;',
          cols: ['id', 'email', 'created_at'],
          rows: [
            { id: 101, email: 'a***@example.com', created_at: '2026-08-28' },
            { id: 102, email: 'b***@domain.com', created_at: '2026-08-27' },
            { id: 103, email: 'j***@gmail.com', created_at: '2026-08-25' }
          ],
          maskedFields: ['email'],
          chartType: 'list'
        });
      } else {
        setStudioResult({
          status: 'success',
          astParseTime: '3.1ms',
          generatedSql: 'SELECT DATE_TRUNC(\'month\', created_at) AS month, COUNT(id) AS signups FROM users WHERE created_at >= \'2026-01-01\' GROUP BY 1 ORDER BY 1;',
          cols: ['month', 'signups'],
          chartData: [
            { label: 'Jan', value: 120 },
            { label: 'Feb', value: 210 },
            { label: 'Mar', value: 340 },
            { label: 'Apr', value: 290 },
            { label: 'May', value: 480 },
            { label: 'Jun', value: 610 }
          ],
          chartType: 'bar'
        });
      }
    }, 1500);
  };

  const getSpanClass = (span) => {
    if (span === 4) return 'col-span-1 md:col-span-2 lg:col-span-4';
    if (span === 2) return 'col-span-1 md:col-span-2';
    return 'col-span-1';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 ${
        isLight ? 'border-slate-300' : 'border-zinc-800'
      }`}>
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
            <Layout className="h-5 w-5 text-indigo-600" />
            Dashboard Studio
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Full Screen Presentation View Button */}
          <button
            onClick={() => setIsFullScreen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md px-3 py-1.5 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Full Screen Presentation View
          </button>

          <div className={`flex p-1 rounded-md border ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-zinc-900 border-zinc-800'}`}>
            <button
              onClick={() => setActiveMode('builder')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
                activeMode === 'builder' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : isLight ? 'text-slate-800 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layout className="h-3.5 w-3.5" />
              Visual Builder ({widgets.length})
            </button>
            <button
              onClick={() => setActiveMode('studio')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
                activeMode === 'studio' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : isLight ? 'text-slate-800 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              Query Studio
            </button>
          </div>
        </div>
      </div>

      {/* Visual Builder Workspace */}
      {activeMode === 'builder' && (
        <div className="space-y-4">
          <div className="flex justify-end items-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md px-3 py-1.5 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Policy-Checked Widget
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {widgets.map((widget, index) => (
              <div
                key={widget.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`${getSpanClass(widget.span)} p-4 rounded-lg border flex flex-col justify-between group transition-all ${
                  draggedIndex === index ? 'opacity-40 border-dashed border-indigo-500' : ''
                } ${
                  isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                {/* Admin Widget Header Controls Bar (Draggable Handle) */}
                <div className="flex items-center justify-between border-b pb-2 mb-2.5 border-slate-200/60 dark:border-zinc-800 cursor-grab active:cursor-grabbing">
                  <div className={`text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 ${
                    isLight ? 'text-slate-700' : 'text-zinc-400'
                  }`}>
                    <GripVertical className="h-3.5 w-3.5 text-indigo-500" />
                    <Activity className="h-3 w-3 text-indigo-600" />
                    {widget.type === 'metric' ? 'KPI Value' : widget.type === 'segment' ? 'Segment Gauge' : 'Visual Chart'}
                  </div>

                  {/* Admin Controls: Move Left/Right, Change Span, Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveWidget(index, 'left')}
                      disabled={index === 0}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                      title="Move Left/Up"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => moveWidget(index, 'right')}
                      disabled={index === widgets.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                      title="Move Right/Down"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </button>

                    {/* Span Adjuster Dropdown */}
                    <select
                      value={widget.span}
                      onChange={(e) => changeWidgetSpan(widget.id, parseInt(e.target.value))}
                      className={`text-[10px] rounded border px-1 py-0.5 font-mono ${
                        isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-zinc-950 border-zinc-800 text-zinc-200'
                      }`}
                      title="Adjust Grid Column Span"
                    >
                      <option value={1}>1 Col</option>
                      <option value={2}>2 Col Wide</option>
                      <option value={4}>4 Col Full</option>
                    </select>

                    <button
                      onClick={() => handleRemoveWidget(widget.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 ml-1"
                      title="Remove Widget"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'} mb-2`}>{widget.title}</h3>

                  {widget.type === 'metric' && (
                    <div className="space-y-0.5 my-2">
                      <div className={`text-2xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{widget.value || '$0.00'}</div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">{widget.subtext}</div>
                    </div>
                  )}

                  {widget.type === 'segment' && widget.segments && (
                    <div className="space-y-2 my-2">
                      <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-zinc-800">
                        {widget.segments.map((seg, idx) => (
                          <div key={idx} style={{ width: `${seg.value}%` }} className={seg.color}></div>
                        ))}
                      </div>
                      <div className="space-y-1 text-[11px] font-mono">
                        {widget.segments.map((seg, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className={`flex items-center gap-1 ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                              <span className={`h-2 w-2 rounded-full ${seg.color}`}></span>
                              {seg.label}
                            </span>
                            <span className="font-bold">{seg.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {widget.type === 'chart' && widget.chartType === 'bar' && (
                    <div className={`h-24 flex items-end justify-between gap-1.5 border-b pb-1.5 my-2 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
                      {widget.chartData ? widget.chartData.map((d, idx) => {
                        const maxVal = Math.max(...widget.chartData.map(o => o.value));
                        const pctHeight = `${(d.value / maxVal) * 80}%`;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                            <div style={{ height: pctHeight }} className="w-full bg-indigo-600 rounded-t-sm"></div>
                            <span className={`text-[9px] font-mono font-semibold ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>{d.label}</span>
                          </div>
                        );
                      }) : null}
                    </div>
                  )}

                  {widget.type === 'chart' && widget.chartType === 'list' && (
                    <div className={`p-2.5 rounded border text-xs font-mono space-y-1 my-2 ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                    }`}>
                      <div className={`border-b pb-1 font-bold ${isLight ? 'border-slate-300 text-slate-900' : 'border-zinc-800 text-zinc-100'}`}>Log output:</div>
                      <div>• txn_8921 - $8,500 (Clean)</div>
                      <div>• txn_8922 - $12,400 (Masked)</div>
                    </div>
                  )}
                </div>

                <div className={`mt-2 border-t pt-2 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
                  <code className={`text-[10px] font-mono block truncate ${isLight ? 'text-slate-700' : 'text-zinc-400'}`} title={widget.query}>
                    {widget.query}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULL-SCREEN PRESENTATION OVERLAY (FOR END-USERS) */}
      {isFullScreen && (
        <div className={`fixed inset-0 z-50 overflow-y-auto p-6 flex flex-col space-y-6 ${
          isLight ? 'bg-slate-50' : 'bg-zinc-950'
        }`}>
          {/* Top Stable Full Screen Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between shadow-lg ${
            isLight ? 'bg-white border-slate-300' : 'bg-zinc-900 border-zinc-800'
          }`}>
            <div className="flex items-center gap-3">
              <div>
                <h2 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
                  <Eye className="h-5 w-5 text-indigo-600" />
                  DASHBOARD PRESENTATION MODE
                </h2>
              </div>
            </div>

            <button
              onClick={() => setIsFullScreen(false)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg px-4 py-2 flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Minimize2 className="h-4 w-4" />
              Exit Presentation View
            </button>
          </div>

          {/* Stable Presentation Grid View (No Admin Edit Controls) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 flex-1">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`${getSpanClass(widget.span)} p-5 rounded-xl border flex flex-col justify-between ${
                  isLight ? 'bg-white border-slate-300 shadow-md' : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider mb-1">
                    {widget.type === 'metric' ? 'KPI Value' : widget.type === 'segment' ? 'Segment Gauge' : 'Visual Chart'}
                  </div>
                  <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'} mb-3`}>{widget.title}</h3>

                  {widget.type === 'metric' && (
                    <div className="space-y-1 my-3">
                      <div className={`text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{widget.value || '$0.00'}</div>
                      <div className="text-xs text-emerald-600 font-semibold">{widget.subtext}</div>
                    </div>
                  )}

                  {widget.type === 'segment' && widget.segments && (
                    <div className="space-y-3 my-3">
                      <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-zinc-800">
                        {widget.segments.map((seg, idx) => (
                          <div key={idx} style={{ width: `${seg.value}%` }} className={seg.color}></div>
                        ))}
                      </div>
                      <div className="space-y-1.5 text-xs font-mono">
                        {widget.segments.map((seg, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                              <span className={`h-2.5 w-2.5 rounded-full ${seg.color}`}></span>
                              {seg.label}
                            </span>
                            <span className="font-bold">{seg.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {widget.type === 'chart' && widget.chartType === 'bar' && (
                    <div className={`h-32 flex items-end justify-between gap-2 border-b pb-2 my-3 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
                      {widget.chartData ? widget.chartData.map((d, idx) => {
                        const maxVal = Math.max(...widget.chartData.map(o => o.value));
                        const pctHeight = `${(d.value / maxVal) * 80}%`;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                            <div style={{ height: pctHeight }} className="w-full bg-indigo-600 rounded-t-sm"></div>
                            <span className={`text-[10px] font-mono font-semibold ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>{d.label}</span>
                          </div>
                        );
                      }) : null}
                    </div>
                  )}

                  {widget.type === 'chart' && widget.chartType === 'list' && (
                    <div className={`p-3 rounded-lg border text-xs font-mono space-y-1.5 my-3 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-zinc-950 border-zinc-800 text-zinc-200'
                    }`}>
                      <div className={`border-b pb-1 font-bold ${isLight ? 'border-slate-300 text-slate-900' : 'border-zinc-800 text-zinc-100'}`}>Audit Stream:</div>
                      <div>• txn_8921 - $8,500 (Clean)</div>
                      <div>• txn_8922 - $12,400 (Masked)</div>
                    </div>
                  )}
                </div>

                <div className={`pt-2 border-t text-[11px] font-mono ${isLight ? 'border-slate-200 text-slate-500' : 'border-zinc-800 text-zinc-400'}`}>
                  Auto-Synchronized Policy Query
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Query Studio Mode */}
      {activeMode === 'studio' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-5">
            <div className={`p-4 rounded-lg border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
              <form onSubmit={handleRunStudioQuery} className="space-y-2">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                  Ask DB-Guardian AI
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studioQuery}
                    onChange={(e) => setStudioQuery(e.target.value)}
                    placeholder="e.g. Show monthly sales signups in 2026"
                    className={`w-full border rounded-md pl-3 pr-24 py-2 text-xs transition-colors focus:outline-none focus:border-indigo-600 ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                    }`}
                  />
                  <div className="absolute right-1 top-1">
                    <button
                      type="submit"
                      disabled={studioLoading}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded px-3 py-1 text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      {studioLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                      Analyze
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-3 flex flex-wrap gap-2 text-xs items-center">
                <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Test Queries:</span>
                <button onClick={() => setStudioQuery('Show monthly signups in 2026')} className={`border rounded px-2 py-0.5 text-[11px] font-medium ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-800 hover:border-slate-400' : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                }`}>
                  "Monthly signups" (Safe)
                </button>
                <button onClick={() => setStudioQuery('Show me user password hashes')} className={`border rounded px-2 py-0.5 text-[11px] font-medium ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-800 hover:border-slate-400' : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                }`}>
                  "Password hashes" (Blocked Column)
                </button>
                <button onClick={() => setStudioQuery('Execute purge_inactive_accounts()')} className={`border rounded px-2 py-0.5 text-[11px] font-medium ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-800 hover:border-slate-400' : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                }`}>
                  "purge_inactive_accounts()" (Blocked Routine)
                </button>
              </div>
            </div>

            {studioLoading && (
              <div className={`p-8 rounded-lg border flex flex-col items-center justify-center space-y-2 ${
                isLight ? 'bg-white border-slate-300' : 'bg-zinc-900 border-zinc-800'
              }`}>
                <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin" />
                <span className={`text-xs font-mono ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Transpiling SQL & verifying AST nodes...</span>
              </div>
            )}

            {studioResult && studioResult.status === 'success' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>Insight Visualization</h2>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Passed AST Check</span>
                  </div>
                  
                  {studioResult.chartType === 'bar' && (
                    <div className="h-40 flex items-end justify-between gap-3 border-b pb-1.5 border-slate-200/50 dark:border-zinc-800">
                      {studioResult.chartData.map((d, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                          <div style={{ height: `${(d.value / 610) * 80}%` }} className="w-full bg-indigo-600 rounded-t-sm"></div>
                          <span className={`text-[10px] mt-1 font-mono font-medium ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>{d.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {studioResult.chartType === 'list' && (
                    <div className={`border rounded overflow-hidden text-xs ${isLight ? 'border-slate-300' : 'border-zinc-800'}`}>
                      <table className="w-full text-left">
                        <thead>
                          <tr className={`border-b font-semibold ${isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-zinc-950 border-zinc-800 text-zinc-200'}`}>
                            <th className="px-3 py-1.5 font-mono">id</th>
                            <th className="px-3 py-1.5 font-mono">email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studioResult.rows.map((row) => (
                            <tr key={row.id} className="border-b border-slate-200/50 dark:border-zinc-800/50">
                              <td className={`px-3 py-1.5 font-mono ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>{row.id}</td>
                              <td className="px-3 py-1.5 font-mono text-amber-700 bg-amber-500/10 dark:text-amber-400 font-medium">{row.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-lg border font-mono text-xs bg-slate-950 text-indigo-300 border-slate-800 shadow-sm">
                  <div className="text-slate-400 mb-1.5 border-b border-slate-800 pb-1.5 flex justify-between text-[10px]">
                    <span>Transpiled SQL Query</span>
                    <span>AST Latency: {studioResult.astParseTime}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{studioResult.generatedSql}</div>
                </div>
              </div>
            )}

            {studioResult && studioResult.status === 'blocked' && (
              <div className="border border-rose-500/40 bg-rose-500/10 rounded-lg p-4 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold">
                  <ShieldAlert className="h-4 w-4" />
                  {studioResult.violation}
                </div>
                <p className={`font-medium ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>{studioResult.message}</p>
                <div className={`p-2.5 rounded border font-mono text-[11px] space-y-0.5 ${
                  isLight ? 'bg-white border-rose-200' : 'bg-zinc-950 border-zinc-800'
                }`}>
                  <div><span className="text-slate-500">AST Verification Code:</span> <span className="text-rose-600 font-bold">{studioResult.code}</span></div>
                  <div><span className="text-slate-500">Execution Status:</span> <span className="text-rose-600 font-bold">ABORTED IN INTERCEPTOR</span></div>
                </div>
              </div>
            )}
          </div>

          <div className={`p-4 rounded-lg border h-fit space-y-2.5 ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
            <h3 className={`font-bold text-xs flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              AST Validation Engine
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
              Every statement is transpiled into an AST node tree and evaluated against table, column, and procedure policies prior to DB execution.
            </p>
          </div>
        </div>
      )}

      {/* Add Widget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-lg overflow-hidden border shadow-xl ${
            isLight ? 'bg-white border-slate-300' : 'bg-zinc-900 border-zinc-800'
          }`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-zinc-950 border-zinc-800'
            }`}>
              <h3 className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5`}>
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                Add Policy-Checked Widget
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                  Widget Title
                </label>
                <input
                  type="text"
                  placeholder="Sales Growth Metric"
                  value={newWidget.title}
                  onChange={(e) => setNewWidget({ ...newWidget, title: e.target.value })}
                  className={`w-full px-3 py-1.5 border rounded-md ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                    Representation
                  </label>
                  <select
                    value={newWidget.type}
                    onChange={(e) => setNewWidget({ ...newWidget, type: e.target.value })}
                    className={`w-full px-2.5 py-1.5 border rounded-md ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                    }`}
                  >
                    <option value="metric">Single Metric Card</option>
                    <option value="chart">Visual Charts Grid</option>
                  </select>
                </div>
                <div>
                  <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                    Grid Column Span
                  </label>
                  <select
                    value={newWidget.span}
                    onChange={(e) => setNewWidget({ ...newWidget, span: parseInt(e.target.value) })}
                    className={`w-full px-2.5 py-1.5 border rounded-md ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                    }`}
                  >
                    <option value={1}>1 Column Span</option>
                    <option value={2}>2 Columns Wide</option>
                    <option value={4}>4 Columns Full Width</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
                  Natural Language Query
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Total active subscriptions"
                    value={newWidget.nlPrompt}
                    onChange={(e) => setNewWidget({ ...newWidget, nlPrompt: e.target.value })}
                    className={`w-full px-3 pr-20 py-1.5 border rounded-md ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
                    }`}
                  />
                  <button
                    onClick={handleTranslateWidgetQuery}
                    className="absolute right-1 top-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded transition-colors"
                  >
                    Validate AST
                  </button>
                </div>
              </div>

              {newWidget.astCheck === 'validating' && (
                <div className="p-2.5 border rounded-md flex items-center gap-2 text-slate-500">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                  <span>Validating AST policies...</span>
                </div>
              )}

              {newWidget.astCheck === 'passed' && (
                <div className="space-y-1.5">
                  <div className="p-2 border border-emerald-500/30 bg-emerald-500/10 rounded-md flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" /> AST Check Passed
                  </div>
                  <div className="p-2 rounded border font-mono text-[10px] bg-slate-950 text-indigo-300 border-slate-800">
                    {newWidget.generatedSql}
                  </div>
                </div>
              )}

              {newWidget.astCheck === 'failed' && (
                <div className="p-2 border border-rose-500/30 bg-rose-500/10 rounded-md text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" /> {newWidget.astError}
                </div>
              )}
            </div>

            <div className={`px-4 py-2.5 border-t flex justify-end gap-2 ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-zinc-950 border-zinc-800'
            }`}>
              <button
                onClick={() => setShowAddModal(false)}
                className={`px-3 py-1 rounded-md text-xs font-semibold border ${
                  isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWidget}
                disabled={newWidget.astCheck !== 'passed'}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-md transition-colors disabled:opacity-50"
              >
                Place Widget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
