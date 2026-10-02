import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { Lock, ShieldCheck, ArrowRight, UserPlus, Clock } from 'lucide-react';
import { COMPANY_DETAILS } from '../../constants/assets';

export const ClientAuthGate: React.FC = () => {
  const { login, registerClient, setActivePage } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Sign In fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSubmitted, setRegSubmitted] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setAuthError(null);
    const result = login(email, password);
    if (!result.success) {
      setAuthError(result.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;
    setAuthError(null);
    const result = registerClient(regName, regEmail, regPassword || 'password123', regPhone);
    if (result.success) {
      setRegSubmitted(regEmail);
    } else {
      setAuthError(result.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 bg-[#0B0F19] border border-[#2B3547] rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="text-center space-y-2">
        <Logo size="md" />
        <div className="pt-2">
          <div className="text-xs font-mono text-[#FFA000] uppercase font-bold flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>AUTHENTICATED CLIENT PORTAL</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Investor Sign In</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access restricted to verified and approved institutional accounts.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#080B11] p-1 rounded-lg border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => {
            setTab('login');
            setAuthError(null);
            setRegSubmitted(null);
          }}
          className={`flex-1 py-2 rounded transition-colors cursor-pointer ${
            tab === 'login' ? 'bg-[#1E293B] text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          Approved Client Sign In
        </button>
        <button
          onClick={() => {
            setTab('register');
            setAuthError(null);
          }}
          className={`flex-1 py-2 rounded transition-colors cursor-pointer ${
            tab === 'register' ? 'bg-[#1E293B] text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          Open New Account
        </button>
      </div>

      {regSubmitted ? (
        <div className="p-6 bg-[#080B11] border border-amber-800/60 rounded-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-950/60 border border-amber-600/50 flex items-center justify-center text-[#FFA000] mx-auto">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Application Pending Approval</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your application for <span className="font-mono text-[#FFA000] font-semibold">{regSubmitted}</span> is currently pending review by our Administrator.
            </p>
          </div>
          <div className="p-3 bg-[#0E1524] rounded border border-slate-800 text-[11px] text-slate-400 text-left font-sans">
            <strong className="text-white block mb-1">Administrative Approval:</strong>
            An Administrator must approve your account in the Admin Panel before you can log in.
          </div>
          <button
            onClick={() => {
              setRegSubmitted(null);
              setTab('login');
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold cursor-pointer"
          >
            Back to Sign In
          </button>
        </div>
      ) : tab === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Registered Email Address</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAuthError(null);
              }}
              placeholder="e.g. m.vance@institutional-asset.com"
              className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white focus:outline-hidden focus:border-[#FFA000]"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-medium text-slate-300">Password</label>
              <span className="text-slate-400 text-[11px] cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthError(null);
              }}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white focus:outline-hidden focus:border-[#FFA000]"
            />
          </div>

          {authError && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded text-rose-300 text-xs font-sans">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-2"
          >
            <span>Authenticate Into Client Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-3.5 text-xs font-sans">
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Full Legal / Entity Name</label>
            <input
              type="text"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="e.g. David Sterling"
              className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white focus:outline-hidden focus:border-[#FFA000]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Email Address</label>
            <input
              type="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="e.g. d.sterling@domain.com"
              className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white focus:outline-hidden focus:border-[#FFA000]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Password (Min 8 Characters)</label>
            <input
              type="password"
              required
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white focus:outline-hidden focus:border-[#FFA000]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Phone Number</label>
            <input
              type="tel"
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              placeholder="+1 (617) 555-0199"
              className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white focus:outline-hidden focus:border-[#FFA000]"
            />
          </div>

          {authError && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded text-rose-300 text-xs">
              {authError}
            </div>
          )}

          <div className="p-3 bg-[#080B11] border border-slate-800 rounded text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFA000]" />
              <span>Admin Approval Required:</span>
            </div>
            <p>New sign-ups must be approved by the administrator before login credentials are functional.</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Submit Registration for Approval</span>
          </button>
        </form>
      )}

      <div className="text-center pt-1">
        <button
          onClick={() => setActivePage('home')}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          ← Return to Public Website
        </button>
      </div>
    </div>
  );
};
