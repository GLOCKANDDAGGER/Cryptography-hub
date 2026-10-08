import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { X, Lock, ShieldCheck, ArrowRight, UserPlus, CheckCircle2, Clock } from 'lucide-react';
import { COMPANY_DETAILS } from '../../constants/assets';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    registerClient,
  } = useApp();

  // Login form states
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Register form states
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [registrationSubmitted, setRegistrationSubmitted] = useState<string | null>(null);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail) return;
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const result = await login(usernameOrEmail, password);
      if (result.success) {
        setAuthModalOpen(false);
        setUsernameOrEmail('');
        setPassword('');
      } else {
        setAuthError(result.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const result = await registerClient(
        regName,
        regEmail,
        regPassword || 'password123',
        regPhone,
        promoCode,
        regUsername
      );
      if (result.success) {
        setRegistrationSubmitted(regEmail);
      } else {
        setAuthError(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#0B0F19] border border-[#2B3547] rounded-xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            setAuthModalOpen(false);
            setRegistrationSubmitted(null);
          }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Logo & Title */}
        <div className="text-center space-y-2">
          <Logo size="md" />
          <p className="text-xs text-slate-400 font-mono mt-1">
            SECURE CLIENT & OPERATIONAL GATEWAY
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#080B11] p-1 rounded-lg border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setAuthModalTab('login');
              setAuthError(null);
              setRegistrationSubmitted(null);
            }}
            className={`flex-1 py-2 rounded transition-colors cursor-pointer ${
              authModalTab === 'login'
                ? 'bg-[#1E293B] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Client / Staff Sign In
          </button>
          <button
            onClick={() => {
              setAuthModalTab('register');
              setAuthError(null);
            }}
            className={`flex-1 py-2 rounded transition-colors cursor-pointer ${
              authModalTab === 'register'
                ? 'bg-[#1E293B] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Open Investor Account
          </button>
        </div>

        {/* Registration Pending Review View */}
        {registrationSubmitted ? (
          <div className="p-6 bg-[#080B11] border border-amber-800/60 rounded-lg text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-950/60 border border-amber-600/50 flex items-center justify-center text-[#FFA000] mx-auto">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Application Under Admin Review</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thank you for applying. Account registration for <span className="font-mono text-[#FFA000] font-semibold">{registrationSubmitted}</span> has been submitted to the compliance administrator for verification and approval.
              </p>
            </div>
            <div className="p-3 bg-[#0E1524] rounded border border-slate-800 text-[11px] text-slate-400 text-left font-sans">
              <strong className="text-white block mb-1">Approval Protocol:</strong>
              An Administrator must review and approve your account in the Admin Panel before platform access is granted.
            </div>
            <button
              onClick={() => {
                setRegistrationSubmitted(null);
                setAuthModalTab('login');
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
            >
              Return to Sign In
            </button>
          </div>
        ) : authModalTab === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Email Address or Admin Username
              </label>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => {
                  setUsernameOrEmail(e.target.value);
                  setAuthError(null);
                }}
                placeholder="e.g. client@domain.com or admin"
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
              <span>Authenticate Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs font-sans">
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
              <label className="text-slate-300 font-medium">Username (Optional / Sign In Identifier)</label>
              <input
                type="text"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="e.g. alexia_roy"
                className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white focus:outline-hidden focus:border-[#FFA000]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Corporate or Individual Email</label>
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
                placeholder="+1 (617) 555-0100"
                className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white focus:outline-hidden focus:border-[#FFA000]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">Promotional Code (Optional)</label>
                <span className="text-[10px] font-mono text-[#FFA000]">Use code: CRYPTOHUB26 ($100 Bonus)</span>
              </div>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="e.g. CRYPTOHUB26"
                className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white font-mono uppercase focus:outline-hidden focus:border-[#FFA000]"
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
              <p>Applications are reviewed by an Administrator before activation in accordance with compliance guidelines.</p>
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

        <p className="text-[10px] text-slate-400 text-center leading-normal">
          {COMPANY_DETAILS.disclaimer} Digital asset investing involves capital risk.
        </p>
      </div>
    </div>
  );
};
