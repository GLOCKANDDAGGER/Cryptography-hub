import React, { useState } from 'react';
import { Logo } from '../brand/Logo';
import { useApp } from '../../context/AppContext';
import { COMPANY_DETAILS } from '../../constants/assets';
import {
  Menu,
  X,
  ArrowRight,
  Lock,
  User,
  LogOut,
  ShieldCheck,
  Calendar,
  MessageCircle,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    setAuthModalOpen,
    setAuthModalTab,
    isAuthenticated,
    user,
    logout,
    theme,
    toggleTheme,
    setAppointmentModalOpen,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', page: 'about' },
    { label: 'Services', page: 'services' },
    { label: 'Solutions', page: 'investment-solutions' },
    { label: 'Insights', page: 'market-insights' },
    { label: 'Education', page: 'education' },
    { label: 'Compliance', page: 'compliance' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: string) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`w-full sticky top-0 z-40 transition-colors backdrop-blur-md border-b ${
        theme === 'light'
          ? 'bg-white/95 border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
          : 'bg-black/95 border-[#1E293B]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="shrink-0 flex items-center gap-3">
          <Logo size="md" onClick={() => handleNavClick('home')} />
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNavClick(link.page)}
              className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${
                activePage === link.page
                  ? 'text-[#FFA000] font-bold border-b-2 border-[#FFA000]'
                  : theme === 'light'
                  ? 'text-slate-700 hover:text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Direct Telegram Link to Ashley Elvira */}
          <a
            href={COMPANY_DETAILS.accountManager.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-1.5 border rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              theme === 'light'
                ? 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-sky-800'
                : 'bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border-[#0088cc]/50 text-sky-300'
            }`}
            title="Chat directly with Account Manager Ashley Elvira on Telegram"
          >
            <MessageCircle className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden xl:inline">{COMPANY_DETAILS.accountManager.telegram}</span>
            <span className="xl:hidden">Telegram</span>
          </a>

          {/* Schedule Appointment Button */}
          <button
            onClick={() => setAppointmentModalOpen(true)}
            className={`px-3 py-1.5 border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
              theme === 'light'
                ? 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-400/80 text-amber-950 font-bold'
                : 'bg-[#111827] hover:bg-[#1E293B] border-[#FFA000]/60 hover:border-[#FFA000] text-white'
            }`}
            title="Schedule an Appointment with Ashley Elvira"
          >
            <Calendar className="w-3.5 h-3.5 text-[#FFA000]" />
            <span>Book Consultation</span>
          </button>

          {/* Theme Toggle Button (Dark/Light) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 shadow-xs'
                : 'bg-[#111827] hover:bg-[#1E293B] border-slate-800 text-slate-300 hover:text-white'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('dashboard')}
                className="px-4 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Portal ({user.name})</span>
              </button>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                }}
                className={`px-3 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap rounded-lg ${
                  theme === 'light'
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <Lock className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`} />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => {
                  setAuthModalTab('register');
                  setAuthModalOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-sm"
              >
                <span>Open Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Right Controls: Theme Toggle & Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border ${
              theme === 'light'
                ? 'bg-slate-100 border-slate-300 text-slate-800'
                : 'bg-[#111827] border-slate-800 text-slate-300'
            }`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 focus:outline-hidden ${theme === 'light' ? 'text-slate-700 hover:text-slate-950' : 'text-slate-400 hover:text-white'}`}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-b px-6 py-4 space-y-3 ${
            theme === 'light'
              ? 'bg-white border-slate-200 shadow-md text-slate-900'
              : 'bg-[#0A0E17] border-[#1E293B] text-slate-100'
          }`}
        >
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`text-left text-sm py-2 px-3 rounded transition-colors ${
                  activePage === link.page
                    ? 'bg-[#FFA000]/15 text-[#FFA000] font-bold'
                    : theme === 'light'
                    ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                setAppointmentModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm py-2 px-3 rounded text-[#FFA000] font-semibold bg-[#FFA000]/10 border border-[#FFA000]/30 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Appointment</span>
            </button>

            <a
              href={COMPANY_DETAILS.accountManager.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-left text-sm py-2 px-3 rounded font-mono font-bold border flex items-center gap-2 ${
                theme === 'light'
                  ? 'text-sky-800 bg-sky-50 border-sky-300'
                  : 'text-sky-300 bg-[#0088cc]/20 border-[#0088cc]/40'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-sky-500" />
              <span>Direct Telegram: {COMPANY_DETAILS.accountManager.telegram}</span>
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-200 dark:border-[#1E293B] flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-center py-2.5 text-xs font-bold text-black bg-[#FFA000] rounded-lg"
                >
                  Access Client Portal
                </button>
                <button
                  onClick={logout}
                  className="w-full text-center py-2 text-xs font-semibold text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-center py-2.5 text-xs font-semibold rounded-lg border ${
                    theme === 'light'
                      ? 'text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-300'
                      : 'text-slate-200 bg-[#111827] border-slate-700'
                  }`}
                >
                  Client Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthModalTab('register');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-lg shadow-sm"
                >
                  Open Investor Account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
