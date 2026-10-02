import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Key,
  Smartphone,
  Lock,
  Globe,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { user, updateUser, activeSessions, revokeSession, auditLogs, showNotification } = useApp();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const handleToggleMFA = () => {
    updateUser({ twoFactorEnabled: !user.twoFactorEnabled });
    showNotification(
      user.twoFactorEnabled
        ? 'Two-Factor Authentication disabled. Security score reduced.'
        : 'Hardware WebAuthn / TOTP Two-Factor Authentication enforced.'
    );
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPw) return;
    showNotification('Account master password cryptographically updated.');
    setCurrentPw('');
    setNewPw('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-lg p-5">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            SECURITY CENTER & ACCESS CONTROLS
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Cryptographic Authentication & Session Governance
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Zero plaintext credentials · Hardware FIDO2 token validation · Automated session revocation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 2FA & Password Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* MFA Panel */}
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Key className="w-5 h-5 text-[#FFA000]" />
                <div>
                  <h3 className="text-sm font-bold text-white">Multi-Factor Authentication (MFA)</h3>
                  <div className="text-xs text-slate-400 font-mono">WebAuthn / FIDO2 Hardware Key Enforced</div>
                </div>
              </div>
              <button
                onClick={handleToggleMFA}
                className={`px-3 py-1.5 rounded text-xs font-bold font-mono transition-colors cursor-pointer ${
                  user.twoFactorEnabled
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                }`}
              >
                {user.twoFactorEnabled ? 'ENFORCED (ON)' : 'DISABLED (OFF)'}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              When enabled, signing in or broadcasting withdrawals requires cryptographic hardware token authorization (YubiKey) or time-based one-time password (TOTP) codes.
            </p>

            <div className="p-3 bg-[#080B11] border border-slate-800 rounded flex items-center justify-between text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#FFA000]" />
                <span>Primary Authenticator: YubiKey 5C NFC</span>
              </div>
              <span className="text-emerald-400 font-semibold">PAIRED</span>
            </div>
          </div>

          {/* Password Management */}
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Update Master Password</h3>
              <p className="text-xs text-slate-400">Argon2id cryptographic key derivation</p>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#080B11] border border-slate-800 rounded p-2.5 text-white focus:outline-hidden focus:border-[#FFA000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">New Password (Min 14 characters)</label>
                <input
                  type="password"
                  required
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-[#080B11] border border-slate-800 rounded p-2.5 text-white focus:outline-hidden focus:border-[#FFA000]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors"
              >
                Update Password Hash
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Active Sessions & Audit Events */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Sessions */}
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Active Device Sessions</h3>
              <span className="text-xs font-mono text-slate-400">{activeSessions.length} Devices</span>
            </div>

            <div className="space-y-3">
              {activeSessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 bg-[#080B11] border border-slate-800 rounded-lg flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 overflow-hidden font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white truncate">{sess.device}</span>
                      {sess.isCurrent && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          THIS DEVICE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {sess.browser} · IP: {sess.ip}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {sess.location} · {sess.lastActive}
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => revokeSession(sess.id)}
                      className="p-2 text-rose-400 hover:bg-rose-950/40 rounded transition-colors shrink-0"
                      title="Revoke Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Recent Immutable Audit Log</h3>
              <span className="text-xs font-mono text-slate-400">Monitored 24/7</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-[11px]">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-2 bg-[#080B11] rounded border border-slate-800/80 space-y-0.5">
                  <div className="flex justify-between text-slate-400">
                    <span className="text-[#FFA000]">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="text-slate-300 text-[10px]">{log.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
