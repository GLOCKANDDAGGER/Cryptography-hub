import React from 'react';
import { ShieldCheck, Key, Lock, FileCode, CheckCircle, Server } from 'lucide-react';
import { COMPANY_DETAILS } from '../../constants/assets';

export const SecurityView: React.FC = () => {
  const pillars = [
    {
      title: 'Air-Gapped Multi-Signature Cold Storage',
      icon: Server,
      desc: 'Client digital assets are deposited directly into institutional cold vaults utilizing multi-party computation (MPC) and geographically segregated hardware security modules (HSMs). Keys never touch internet-connected environments.',
    },
    {
      title: 'Hardware-Enforced Multi-Factor Authentication',
      icon: Key,
      desc: 'All client dashboard sessions support FIDO2/WebAuthn physical security tokens (e.g. YubiKey) and time-based one-time password (TOTP) protocols to eliminate credential-stuffing vulnerability.',
    },
    {
      title: 'Cryptographic Address Whitelisting & Delay Windows',
      icon: Lock,
      desc: 'Withdrawal destinations must be explicitly whitelisted and undergo an automated 24-hour verification cooling window, accompanied by out-of-band biometric or phone confirmation from your dedicated account manager.',
    },
    {
      title: 'Zero Plaintext Credential Architecture',
      icon: ShieldCheck,
      desc: 'User authentication credentials are processed with high-entropy salt and argon2/bcrypt cryptographic hashing algorithms. Client data is encrypted at rest using AES-256 and in transit using TLS 1.3.',
    },
    {
      title: 'Continuous Immutable Audit Logging',
      icon: FileCode,
      desc: 'Every session initialization, credential change, portfolio rebalance, and transaction status transition is chronologically recorded to tamper-evident audit ledgers monitored by our compliance desk.',
    },
    {
      title: 'Session Hijacking & Anomaly Defenses',
      icon: CheckCircle,
      desc: 'Real-time IP geolocation telemetry, device fingerprint validation, and strict cookie security attributes (HttpOnly, Secure, SameSite=Strict) safeguard authenticated sessions against session-hijack attempts.',
    },
  ];

  return (
    <div className="py-12 bg-[#000000] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono text-[#FFA000] tracking-wider uppercase">
            INSTITUTIONAL SECURITY ARCHITECTURE
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Security as an Uncompromising Foundation
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            At Crypto Hub Investments, safeguarding client assets and confidentiality governs every software design choice, operational standard, and custodial partnership.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="p-6 bg-[#0B0F19] border border-[#1E293B] rounded-lg space-y-3">
                <div className="w-10 h-10 rounded bg-[#111827] border border-slate-700 flex items-center justify-center text-[#FFA000]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Operational Security Standards Notice */}
        <div className="p-6 bg-[#080B10] border border-slate-800 rounded-md text-xs text-slate-400 space-y-2">
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FFA000]" />
            <span>Incident Response & Escalation Protocol</span>
          </div>
          <p className="leading-relaxed">
            In the event of anomalous access attempts or lost credentials, immediate freeze requests may be transmitted directly to our Customer Care Desk at <span className="text-slate-200 font-mono">{COMPANY_DETAILS.customerCareEmail}</span> or directly to your assigned Account Manager Ashley Elvira at <span className="text-slate-200 font-mono">{COMPANY_DETAILS.accountManager.email}</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
