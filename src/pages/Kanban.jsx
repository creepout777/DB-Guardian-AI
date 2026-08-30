import React, { useState } from 'react';
import { Kanban as KanbanIcon, CheckCircle2, Clock, Shield, Sparkles, UserCheck } from 'lucide-react';

export default function Kanban({ theme }) {
  const isLight = theme === 'light';

  // Agile Kanban Board Tasks State with Simple Supabase Auth & 2-Layer Data Stories
  const [columns, setColumns] = useState([
    {
      id: 'backlog',
      title: 'Product Backlog',
      badgeColor: 'bg-slate-500/10 border-slate-500/20 text-slate-600',
      tasks: [
        { id: 'US-201', title: 'As a User, I want to log in with GitHub or Google OAuth2 via Supabase so that I can sign in instantly without typing passwords.', points: 5, epic: 'Supabase Auth', priority: 'High', roleTag: 'User' },
        { id: 'US-202', title: 'As a System, I want Layer-1 Postgres RLS policies so that each user can physically read only their own DB rows.', points: 8, epic: 'DB Security Layer', priority: 'High', roleTag: 'Database' },
        { id: 'US-301', title: 'As a System, I want Layer-2 Backend API session middleware so that every API endpoint filters queries by the user\'s token.', points: 8, epic: 'Backend Security Layer', priority: 'High', roleTag: 'Backend' },
        { id: 'US-501', title: 'As an Admin, I want an interactive ERD canvas so that I can visually inspect foreign keys and table access rules.', points: 8, epic: 'ERD Canvas', priority: 'Medium', roleTag: 'Admin' }
      ]
    },
    {
      id: 'sprint1',
      title: 'Sprint 1: Supabase Auth & Data Isolation (In Progress)',
      badgeColor: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600',
      tasks: [
        { id: 'US-101', title: 'As a User, I want to sign up with email and password so that Supabase sends a confirmation email to verify my account.', points: 5, epic: 'Supabase Auth', priority: 'High', roleTag: 'User' },
        { id: 'US-102', title: 'As a User, I want a forgot password reset link sent to my email so that I can safely recover my account via Supabase.', points: 3, epic: 'Supabase Auth', priority: 'High', roleTag: 'User' },
        { id: 'US-103', title: 'As an Admin, I want full setup access so that I can configure DB connections, security rules, and user accounts.', points: 5, epic: 'RBAC', priority: 'High', roleTag: 'Admin' },
        { id: 'US-104', title: 'As a Regular User, I want 2-layer data isolation so that I can only see and access my own assigned data.', points: 8, epic: '2-Layer Security', priority: 'High', roleTag: 'User' }
      ]
    },
    {
      id: 'review',
      title: 'Code Review & QA',
      badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-600',
      tasks: [
        { id: 'US-401', title: 'As a User, I want a full-screen presentation view so that I can display stable dashboards on wall monitors.', points: 5, epic: 'Dashboard Studio', priority: 'Medium', roleTag: 'User' },
        { id: 'US-402', title: 'As an Admin, I want to drag and drop widgets so that I can easily customize dashboard layout positions.', points: 3, epic: 'Dashboard Studio', priority: 'Medium', roleTag: 'Admin' }
      ]
    },
    {
      id: 'done',
      title: 'Completed',
      badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
      tasks: [
        { id: 'US-001', title: 'As a User, I want a Light/Dark theme toggle so that I can switch modes for visual comfort.', points: 3, epic: 'Design System', priority: 'High', roleTag: 'UI/UX' },
        { id: 'US-002', title: 'As an Admin, I want an 8-engine DB connector selector so that I can connect PostgreSQL, MySQL, and Snowflake.', points: 5, epic: 'DB Connectors', priority: 'High', roleTag: 'Admin' },
        { id: 'US-003', title: 'As an Admin, I want a 2-tier role model so that I can configure custom permissions for regular users.', points: 5, epic: 'Auth & RBAC', priority: 'High', roleTag: 'Security' }
      ]
    }
  ]);

  const moveTask = (taskId, targetColId) => {
    let movedTask = null;
    const newCols = columns.map(col => {
      const taskIndex = col.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        movedTask = col.tasks[taskIndex];
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
      }
      return col;
    });

    if (movedTask) {
      setColumns(newCols.map(col => {
        if (col.id === targetColId) {
          return { ...col, tasks: [...col.tasks, movedTask] };
        }
        return col;
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
          <KanbanIcon className="h-5 w-5 text-indigo-600" />
          Agile Kanban Board
        </h1>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start select-none">
        {columns.map((col) => (
          <div
            key={col.id}
            className={`p-4 rounded-xl border flex flex-col space-y-3 min-h-[500px] ${
              isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b pb-2.5 border-slate-200/60 dark:border-zinc-800">
              <h3 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{col.title}</h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${col.badgeColor}`}>
                {col.tasks.length} Stories
              </span>
            </div>

            {/* Tasks Cards Container */}
            <div className="space-y-3 flex-1">
              {col.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-lg border flex flex-col justify-between space-y-2.5 transition-all shadow-sm ${
                    isLight ? 'bg-slate-50 border-slate-300 hover:border-indigo-400' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                      {task.id}
                    </span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                      task.priority === 'High' ? 'text-rose-600 bg-rose-500/10 border border-rose-500/20' : 'text-slate-500 bg-slate-500/10'
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  <h4 className={`text-xs font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>{task.title}</h4>

                  <div className="flex items-center justify-between text-[10px] font-mono border-t pt-2 border-slate-200/50 dark:border-zinc-800">
                    <span className="text-slate-400">{task.epic}</span>
                    <span className="font-bold text-indigo-600">{task.points} pts</span>
                  </div>

                  {/* Quick Shift Controls */}
                  <div className="flex justify-between items-center pt-1 text-[10px]">
                    {col.id !== 'backlog' ? (
                      <button
                        onClick={() => moveTask(task.id, col.id === 'sprint1' ? 'backlog' : col.id === 'review' ? 'sprint1' : 'review')}
                        className="text-slate-400 hover:text-indigo-600 font-mono font-semibold"
                      >
                        ← Move Left
                      </button>
                    ) : <div></div>}
                    {col.id !== 'done' && (
                      <button
                        onClick={() => moveTask(task.id, col.id === 'backlog' ? 'sprint1' : col.id === 'sprint1' ? 'review' : 'done')}
                        className="text-indigo-600 hover:text-indigo-500 font-mono font-semibold flex items-center gap-0.5"
                      >
                        Move Right →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
