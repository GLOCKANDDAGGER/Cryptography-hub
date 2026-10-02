import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { RiskBanner } from '../common/RiskBanner';
import { COMPANY_DETAILS, ASSETS } from '../../constants/assets';
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  FileText,
  UserCheck,
  Headphones,
  ShieldCheck,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const {
    activePage,
    setActivePage,
    user,
    setCurrentRole,
    ashleyMessages,
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio & Assets', icon: PieChart },
    { id: 'transactions', label: 'Transaction Ledger', icon: Receipt },
    { id: 'documents', label: 'Statements & Reports', icon: FileText },
    { id: 'account-manager', label: 'Account Manager', icon: UserCheck, highlight: true },
    { id: 'support', label: 'Support Center', icon: Headphones },
    { id: 'security-center', label: 'Security & 2FA', icon: ShieldCheck },
    { id: 'profile', label: 'Client Profile', icon: User },
  ];

  const handleNav = (id: string) => {
    setActivePage(id);
    setMobileSidebarOpen(false);
  };

  const getBreadcrumb = () => {
    switch (activePage) {
      case 'portfolio':
        return 'Portfolio & Asset Allocation';
      case 'transactions':
        return 'Verified Transaction History';
      case 'documents':
        return 'Client Statements & Regulatory Disclosures';
      case 'account-manager':
        return 'Dedicated Account Manager · Ashley Elvira';
      case 'support':
        return 'Support Center & Ticket Queue';
      case 'security-center':
        return 'Security Architecture & Hardware MFA';
      case 'profile':
        return 'Verified Profile & KYC Tier';
      default:
        return 'Client Portal Overview';
    }
  };

  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100 flex flex-col">
      {/* Client Portal Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (260px) */}
        <aside
          aria-label="Client Portal Navigation"
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A0D15] border-r border-[#1E293B] flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Brand Header */}
            <div className="h-16 px-5 border-b border-[#1E293B] flex items-center justify-between">
              <Logo size="sm" onClick={() => setActivePage('home')} />
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
                aria-label="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Manager Mini Widget in Sidebar */}
            <div
              onClick={() => handleNav('account-manager')}
              className="m-3 p-3 rounded-lg bg-[#0F1523] border border-amber-900/30 hover:border-[#FFA000]/60 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#FFA000] shrink-0">
                  <img
                    src={ASSETS.ashleyElviraPortrait}
                    alt="Ashley Elvira"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] font-mono text-[#FFA000] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>YOUR ACCOUNT MGR</span>
                  </div>
                  <div className="text-xs font-bold text-white truncate group-hover:text-[#FFA000] transition-colors">
                    Ashley Elvira
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">7+ Yrs Trading Exp</div>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
              <div className="px-3 pb-1.5 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                PORTAL NAVIGATION
              </div>
              {menuItems.map((item) => {
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
                    {item.highlight && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-[#FFA000]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar User Footer */}
            <div className="p-3 border-t border-[#1E293B] bg-[#07090F]">
              <div className="flex items-center justify-between text-xs">
                <div className="overflow-hidden">
                  <div className="font-semibold text-white truncate">{user.name}</div>
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>KYC VERIFIED</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentRole('CLIENT');
                    setActivePage('home');
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors"
                  title="Sign out to Public Site"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <header className="h-16 bg-[#0A0D15] border-b border-[#1E293B] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white"
                aria-label="Open Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Portal</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-200 font-semibold">{getBreadcrumb()}</span>
              </div>
            </div>

            {/* Top Header Right Controls */}
            <div className="flex items-center gap-3">
              {/* Notifications Toggle */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-slate-400 hover:text-white rounded-md bg-[#111827] border border-slate-800 relative cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FFA000]" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#0B0F19] border border-slate-800 rounded-lg shadow-2xl p-4 text-xs z-50 space-y-3">
                    <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
                      <span>Verified System Alerts</span>
                      <span className="text-[10px] font-mono text-[#FFA000]">3 NEW</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="p-2 bg-[#080B11] rounded border border-slate-800/80">
                        <div className="font-semibold text-slate-200">Ashley Elvira sent a message</div>
                        <div className="text-[11px] text-slate-400 truncate">
                          "I have reviewed your current 51.5% BTC and 33.3% ETH exposure..."
                        </div>
                      </div>
                      <div className="p-2 bg-[#080B11] rounded border border-slate-800/80">
                        <div className="font-semibold text-slate-200">Wire Inbound Executed</div>
                        <div className="text-[11px] text-slate-400">Ref #CHI-TX-99824 credited ($25,000.00 USD)</div>
                      </div>
                      <div className="p-2 bg-[#080B11] rounded border border-slate-800/80">
                        <div className="font-semibold text-slate-200">Q3 Macro Intelligence Published</div>
                        <div className="text-[11px] text-slate-400">Research memorandums available in Documents</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Ashley Contact Quick Button */}
              <button
                onClick={() => handleNav('account-manager')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#111827] hover:bg-[#1E293B] border border-slate-800 rounded text-xs text-slate-200 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#FFA000]" />
                <span>Message Ashley Elvira</span>
              </button>

              <button
                onClick={() => setActivePage('home')}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white flex items-center gap-1"
                title="Return to Public Website"
              >
                <span className="hidden md:inline">Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* Main Body */}
          <main className="flex-1 p-4 sm:p-6">{children}</main>

          {/* Portal Footer Disclosures */}
          <div className="px-6 py-4 border-t border-[#1E293B] bg-[#07090E] text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
            <div>
              Crypto Hub Investments · Massachusetts, United States · Lead Account Manager: Ashley Elvira ({COMPANY_DETAILS.accountManager.email})
            </div>
            <div className="font-mono text-slate-400">
              AUDITED CUSTODY VAULT #CHI-9921
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
