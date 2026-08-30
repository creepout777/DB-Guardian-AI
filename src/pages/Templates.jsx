import React, { useState } from 'react';
import { Sparkles, LayoutGrid, ArrowRight, TrendingUp, ShoppingBag, Landmark, Cpu, Megaphone, UserCheck, RefreshCw, Plus, ShieldCheck } from 'lucide-react';

export default function Templates({ theme, onSelectTemplate }) {
  const [promptInput, setPromptInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const isLight = theme === 'light';

  const [templates, setTemplates] = useState([
    {
      id: 'saas_exec',
      name: 'SaaS Executive Metrics',
      icon: TrendingUp,
      description: 'Analyze Monthly Recurring Revenue (MRR), churn rate, subscriber growth, and LTV profiles.',
      widgetsCount: 4,
      widgets: [
        { title: 'Monthly Recurring Revenue', type: 'metric', query: 'SELECT SUM(amount) FROM subscriptions WHERE status = "active";', value: '$124,500', subtext: '+12.4% vs last month' },
        { title: 'User Signups Over Time', type: 'chart', query: 'SELECT month, COUNT(id) FROM users GROUP BY 1;', chartType: 'bar' },
        { title: 'Churn Risk Segment', type: 'chart', query: 'SELECT segment, COUNT(id) FROM users WHERE risk = "high" GROUP BY 1;', chartType: 'list' },
        { title: 'Average Revenue Per User (ARPU)', type: 'metric', query: 'SELECT AVG(price) FROM subscriptions;', value: '$89.00', subtext: 'Stable' }
      ]
    },
    {
      id: 'ecommerce_sales',
      name: 'E-Commerce Analytics',
      icon: ShoppingBag,
      description: 'Track orders funnel, average checkout value, transaction frequency, and product categories.',
      widgetsCount: 4,
      widgets: [
        { title: 'Total Sales Revenue', type: 'metric', query: 'SELECT SUM(total_price) FROM orders;', value: '$382,900', subtext: '+8.2% vs last week' },
        { title: 'Top Purchasing Countries', type: 'chart', query: 'SELECT country, SUM(total) FROM orders GROUP BY 1 LIMIT 5;', chartType: 'bar' },
        { title: 'Recent Orders Log', type: 'chart', query: 'SELECT id, user_id, total_amount FROM orders LIMIT 3;', chartType: 'list' },
        { title: 'Active Checkout Cart size', type: 'metric', query: 'SELECT AVG(items_count) FROM carts;', value: '3.4 items', subtext: 'Average cart fill' }
      ]
    },
    {
      id: 'financial_audit',
      name: 'Financial Risk Audit',
      icon: Landmark,
      description: 'Monitor payment transactions, defaults, credit risks, and flag suspicious actions.',
      widgetsCount: 3,
      widgets: [
        { title: 'Processed Transactions', type: 'metric', query: 'SELECT COUNT(*) FROM payments WHERE status = "success";', value: '45,210', subtext: 'Last 24 hours' },
        { title: 'Risk Compliance Log', type: 'chart', query: 'SELECT user_id, amount, alert_level FROM transactions WHERE alert_level = "critical";', chartType: 'list' },
        { title: 'Pending Suspicious Audits', type: 'metric', query: 'SELECT COUNT(*) FROM audits WHERE verified = false;', value: '18 audits', subtext: 'Requires manual review' }
      ]
    },
    {
      id: 'marketing_funnel',
      name: 'Marketing Performance',
      icon: Megaphone,
      description: 'Track lead acquisition channels, ad spend ROI, cost per lead, and campaign conversion rates.',
      widgetsCount: 4,
      widgets: [
        { title: 'Total Campaign Leads', type: 'metric', query: 'SELECT COUNT(id) FROM leads WHERE campaign = "Q3_Launch";', value: '8,420', subtext: '+18.5% conversion' },
        { title: 'Acquisition Channels', type: 'chart', query: 'SELECT channel, COUNT(*) FROM leads GROUP BY 1;', chartType: 'bar' },
        { title: 'Recent Qualified Prospects', type: 'chart', query: 'SELECT name, company, score FROM leads WHERE score > 80 LIMIT 4;', chartType: 'list' },
        { title: 'Average Cost Per Lead (CPL)', type: 'metric', query: 'SELECT AVG(cpl) FROM campaign_metrics;', value: '$14.20', subtext: '-5% cost optimization' }
      ]
    },
    {
      id: 'it_system_health',
      name: 'IT System Infrastructure',
      icon: Cpu,
      description: 'Monitor API response times, server resource utilization, database connections, and error logs.',
      widgetsCount: 4,
      widgets: [
        { title: 'Average Query Latency', type: 'metric', query: 'SELECT AVG(execution_time_ms) FROM query_logs;', value: '14.2 ms', subtext: 'Sub-second response' },
        { title: 'Hourly Traffic Load', type: 'chart', query: 'SELECT hour, requests_count FROM server_metrics;', chartType: 'bar' },
        { title: 'System Incident Logs', type: 'chart', query: 'SELECT timestamp, error_code, component FROM system_logs WHERE level = "ERROR";', chartType: 'list' },
        { title: 'Active DB Connection Pool', type: 'metric', query: 'SELECT COUNT(*) FROM active_connections;', value: '42 / 100', subtext: 'Optimal capacity' }
      ]
    },
    {
      id: 'hr_cohort',
      name: 'HR & Employee Retention',
      icon: UserCheck,
      description: 'Track team headcount growth, tenure distributions, department allocations, and onboarding queues.',
      widgetsCount: 3,
      widgets: [
        { title: 'Total Active Headcount', type: 'metric', query: 'SELECT COUNT(id) FROM employees WHERE status = "active";', value: '342 Employees', subtext: '+14 this month' },
        { title: 'Headcount by Department', type: 'chart', query: 'SELECT dept_name, COUNT(*) FROM employees GROUP BY 1;', chartType: 'bar' },
        { title: 'Pending Onboarding List', type: 'chart', query: 'SELECT name, role, start_date FROM new_hires WHERE status = "pending";', chartType: 'list' }
      ]
    }
  ]);

  const handleGenerateCustomTemplate = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const titleClean = promptInput.charAt(0).toUpperCase() + promptInput.slice(1);
      
      const newCustomTemplate = {
        id: `custom_${Date.now()}`,
        name: `${titleClean} (AI Template)`,
        icon: Sparkles,
        description: `Custom layout template generated for "${promptInput}". Built exclusively using DB-Guardian standard metric cards, bar charts, and log detail views.`,
        widgetsCount: 4,
        widgets: [
          { title: `${titleClean} KPI Metric`, type: 'metric', query: 'SELECT COUNT(*) FROM main_table;', value: '1,250', subtext: 'Calculated via policy engine' },
          { title: 'Distribution Analysis', type: 'chart', query: 'SELECT category, COUNT(*) FROM main_table GROUP BY 1;', chartType: 'bar' },
          { title: 'Audit Trail Records', type: 'chart', query: 'SELECT id, created_at, status FROM main_table LIMIT 5;', chartType: 'list' },
          { title: 'Efficiency Rate', type: 'metric', query: 'SELECT AVG(score) FROM performance_table;', value: '94.8%', subtext: 'High performance' }
        ]
      };

      setTemplates([newCustomTemplate, ...templates]);
      setPromptInput('');
    }, 1400);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
          <LayoutGrid className="h-5 w-5 text-indigo-600" />
          Dashboard Templates Catalog
        </h1>
      </div>

      {/* AI Custom Template Generator */}
      <div className={`p-4 rounded-lg border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-xs">
            <Sparkles className="h-4 w-4" />
            AI Custom Template Generator
          </div>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
            APPROVED ELEMENTS ONLY
          </span>
        </div>

        <form onSubmit={handleGenerateCustomTemplate} className="flex flex-col sm:flex-row gap-2 mt-3">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g. Customer Support template with ticket volume, CSAT score, and priority queues"
            className={`flex-1 px-3 py-1.5 border rounded-md text-xs transition-colors focus:outline-none focus:border-indigo-600 ${
              isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
            }`}
          />
          <button
            type="submit"
            disabled={generating || !promptInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-md px-4 py-1.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Structuring...
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Generate Layout
              </>
            )}
          </button>
        </form>
      </div>

      {/* Templates Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <div
              key={tpl.id}
              className={`p-4 rounded-lg border flex flex-col justify-between transition-all group ${
                isLight ? 'bg-white border-slate-300 shadow-sm hover:border-indigo-400' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`h-9 w-9 rounded-md flex items-center justify-center border ${
                    isLight ? 'bg-slate-100 border-slate-300 text-indigo-600' : 'bg-zinc-950 border-zinc-800 text-indigo-400'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {tpl.id.startsWith('custom_') && (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                      Custom AI Preset
                    </span>
                  )}
                </div>

                <h3 className={`text-sm font-bold mt-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{tpl.name}</h3>
                <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{tpl.description}</p>
                <div className="text-[11px] text-slate-500 mt-2 font-mono font-medium">
                  {tpl.widgetsCount} Checked Elements
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-zinc-800">
                <button
                  onClick={() => onSelectTemplate(tpl)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-md py-1.5 px-3 text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  Instantiate Layout
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
