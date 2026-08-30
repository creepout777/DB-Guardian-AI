import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Connectors from './pages/Connectors';
import Policies from './pages/Policies';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import { 
  Sparkles, 
  LayoutGrid, 
  Database, 
  Shield, 
  Users as UsersIcon, 
  Settings as SettingsIcon, 
  User, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Terminal,
  LogOut
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState({
    name: 'Administrator',
    email: 'admin@guardian.io',
    role: 'admin' // 'admin' | 'user'
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('light', nextTheme === 'light');
  };

  // Base navigation tabs list
  const allTabs = [
    { id: 'dashboard', name: 'Dashboard Studio', icon: Sparkles, adminOnly: false },
    { id: 'templates', name: 'Templates Catalog', icon: LayoutGrid, adminOnly: false },
    { id: 'connectors', name: 'DB Connectors', icon: Database, adminOnly: true }, // RESTRICTED TO ADMIN ONLY
    { id: 'policies', name: 'Guardrail Policies', icon: Shield, adminOnly: true },     // RESTRICTED TO ADMIN ONLY
    { id: 'users', name: 'Access & Portals', icon: UsersIcon, adminOnly: true },       // RESTRICTED TO ADMIN ONLY
    { id: 'settings', name: 'System Settings', icon: SettingsIcon, adminOnly: false },
    { id: 'profile', name: 'My Profile', icon: User, adminOnly: false },
  ];

  // Role-Based Access Control Filter: Standard users cannot see DB Connectors or Policies
  const tabs = allTabs.filter(t => currentUser?.role === 'admin' || !t.adminOnly);

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setActiveTab('dashboard');
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard theme={theme} preloadedTemplate={selectedTemplate} clearPreloadedTemplate={() => setSelectedTemplate(null)} />;
      case 'templates':
        return <Templates theme={theme} onSelectTemplate={handleSelectTemplate} />;
      case 'connectors':
        return currentUser?.role === 'admin' ? <Connectors theme={theme} /> : <Dashboard theme={theme} />;
      case 'policies':
        return currentUser?.role === 'admin' ? <Policies theme={theme} /> : <Dashboard theme={theme} />;
      case 'users':
        return currentUser?.role === 'admin' ? <Users theme={theme} /> : <Dashboard theme={theme} />;
      case 'settings':
        return <Settings theme={theme} />;
      case 'profile':
        return <Profile theme={theme} />;
      default:
        return <Dashboard theme={theme} />;
    }
  };

  if (!currentUser) {
    return <Auth theme={theme} onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-zinc-950 text-zinc-100'}`}>
      
      {/* Navigation Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed md:static inset-y-0 left-0 z-40 w-64 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-900 border-zinc-800'} border-r flex flex-col justify-between transition-all duration-200`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Header */}
          <div className={`h-16 flex items-center px-6 gap-3 border-b ${theme === 'light' ? 'border-slate-200 bg-slate-50/50' : 'border-zinc-800 bg-zinc-900/50'}`}>
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight uppercase">DB-Guardian</h1>
              <p className="text-[10px] text-indigo-500 font-semibold tracking-wider uppercase">Enterprise Query Guard</p>
            </div>
            <button 
              className="md:hidden ml-auto text-slate-400 hover:text-slate-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Items (Role-Filtered) */}
          <nav className="p-3 space-y-1 flex-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? theme === 'light'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'bg-zinc-800 text-white font-semibold'
                      : theme === 'light'
                        ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? (theme === 'light' ? 'text-indigo-600' : 'text-indigo-400') : 'text-slate-400'}`} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Role Card & Logout */}
        <div className={`p-4 border-t ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-zinc-800 bg-zinc-950/40'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-xs font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{currentUser.name}</div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase font-mono ${
                currentUser.role === 'admin'
                  ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600'
                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
              }`}>
                {currentUser.role === 'admin' ? 'GLOBAL ADMIN' : 'RESTRICTED USER'}
              </span>
            </div>
            <button
              onClick={() => setCurrentUser(null)}
              className="p-1.5 rounded text-slate-400 hover:text-rose-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className={`h-16 border-b ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-900 border-zinc-800'} sticky top-0 z-30 flex items-center justify-between px-6 transition-colors`}>
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-slate-400 hover:text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Theme Switcher & Profile menu */}
          <div className="flex items-center gap-3">
            {/* Quick Switch Role (for live demoing) */}
            <button
              onClick={() => setCurrentUser(prev => prev.role === 'admin' 
                ? { name: 'Sarah Jenkins', email: 'sarah.j@company.com', role: 'user' }
                : { name: 'Administrator', email: 'admin@guardian.io', role: 'admin' }
              )}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200'
                  : 'bg-indigo-600 text-white border-indigo-600'
              }`}
            >
              Switch Role ({currentUser.role === 'admin' ? 'View as User' : 'View as Admin'})
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${
                theme === 'light'
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            <div className="flex items-center gap-2 border-l pl-3 border-slate-200/60 dark:border-zinc-800">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}
