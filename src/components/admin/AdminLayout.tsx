import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { COMPANY_DETAILS } from '../../constants/assets';
import {
  ShieldAlert,
  Users,
  Receipt,
  Headphones,
  FileCheck2,
  ListFilter,
  Settings,
  LayoutDashboard,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { activePage, setActivePage, currentRole, login, logout, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Admin login gate states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const isAuthorized = currentRole === 'ADMIN' || currentRole === 'MANAGER';

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const result = login(adminUsername, adminPassword);
    if (!result.success) {
      setLoginError(result.message || 'Invalid administrator credentials. Access restricted.');
    }
  };

  // If not authorized as ADMIN or MANAGER, show credential login gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#06080D] flex items-center justify-center p-4">
        <div className="bg-[#0B0F19] border border-[#2B3547] rounded-xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
          <div className="text-center space-y-3">
            <Logo size="md" />
            <div className="pt-2">
              <div className="text-xs font-mono text-[#FFA000] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>RESTRICTED EXECUTIVE ACCESS</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">Administrator Gate</h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter authorized credentials to access management and compliance systems.
              </p>
            </div>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-slate-300">Username or Manager Email</label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => {
                  setAdminUsername(e.target.value);
                  setLoginError(null);
                }}
                placeholder="Enter authorized administrator username or email"
                className="w-full bg-[#080B11] border border-slate-800 text-white rounded p-3 text-sm focus:outline-hidden focus:border-[#FFA000]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300">Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setLoginError(null);
                }}
                placeholder="••••••••••••"
                className="w-full bg-[#080B11] border border-slate-800 text-white rounded p-3 text-sm focus:outline-hidden focus:border-[#FFA000]"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded text-rose-300 text-xs font-sans">
                {loginError}
              </div>
            )}

            <div className="p-3 bg-[#080B11] border border-slate-800/80 rounded text-[11px] text-slate-400 font-sans flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FFA000] shrink-0" />
              <span>Restricted to authorized administrative personnel. All authentication events are logged to the cryptographic compliance audit ledger.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Authenticate Administrator Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setActivePage('home')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const adminNav = [
    { id: 'admin-dashboard', label: 'Overview Console', icon: LayoutDashboard },
    { id: 'admin-clients', label: 'Client Accounts', icon: Users },
    { id: 'admin-transactions', label: 'Transaction Approvals', icon: Receipt },
    { id: 'admin-support', label: 'Support Desk Queue', icon: Headphones },
    { id: 'admin-compliance', label: 'KYC & Compliance', icon: FileCheck2 },
    { id: 'admin-audit-logs', label: 'Audit Log Stream', icon: ListFilter },
  ];

  const handleNav = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      <div className="flex-1 flex overflow-hidden">
        {/* Admin Left Sidebar */}
        <aside
          aria-label="Admin Console Navigation"
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A0D15] border-r border-[#1E293B] flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-16 px-5 border-b border-[#1E293B] flex items-center justify-between">
              <Logo size="sm" onClick={() => setActivePage('home')} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
                aria-label="Close Admin Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Admin Desk Badge */}
            <div className="mx-3 mt-3 p-3 rounded bg-[#131B2D] border border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-[#FFA000] font-bold tracking-wider uppercase">
                  OVERSIGHT DESK
                </span>
              </div>
              <div className="text-xs font-bold text-white mt-1">
                {currentRole === 'MANAGER' ? `Manager: ${COMPANY_DETAILS.accountManager.name}` : 'Executive Administrator'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {COMPANY_DETAILS.location}
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <div className="px-3 pb-1 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                ADMINISTRATION & DESKS
              </div>
              {adminNav.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#1E293B] text-[#FFA000] font-bold shadow-xs'
                        : 'text-slate-300 hover:bg-[#111827] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FFA000]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-[#1E293B] bg-[#07090F] flex items-center justify-between text-xs">
              <div className="text-slate-400 font-mono text-[11px]">
                ROLE: <strong className="text-white">{currentRole}</strong>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                title="Sign out of Admin Console"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-[10px]">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <header className="h-16 bg-[#0A0D15] border-b border-[#1E293B] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white"
                aria-label="Open Admin Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span className="text-[#FFA000] font-bold">ADMINISTRATION CONSOLE</span>
                <span>/</span>
                <span className="text-white capitalize">{activePage.replace('admin-', '')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePage('dashboard')}
                className="px-3 py-1.5 bg-[#111827] hover:bg-[#1E293B] border border-slate-800 rounded text-xs text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <span>Client Portal</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={() => setActivePage('home')}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Public Site
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};
