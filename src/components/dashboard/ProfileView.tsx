import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, ShieldCheck, Mail, MapPin, Phone, Building, Save } from 'lucide-react';
import { COMPANY_DETAILS } from '../../constants/assets';

export const ProfileView: React.FC = () => {
  const { user, updateUser, showNotification } = useApp();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '+1 (617) 555-0192',
    state: user.state,
    country: user.country,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-lg p-5">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            CLIENT PROFILE & COMPLIANCE TIER
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Verified Client Credentials
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Account Number: {user.accountNumber} · Member since {user.memberSince}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded text-xs font-bold font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>KYC TIER 1 VERIFIED</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-8 bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono">Personal & Entity Information</h3>
            <p className="text-xs text-slate-400">Information verified against state identification and corporate registry.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#080B11] border border-slate-800 text-white rounded p-2.5 focus:outline-hidden focus:border-[#FFA000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Registered Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#080B11] border border-slate-800 text-white rounded p-2.5 focus:outline-hidden focus:border-[#FFA000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Phone Verification</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#080B11] border border-slate-800 text-white rounded p-2.5 focus:outline-hidden focus:border-[#FFA000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Tax Jurisdiction & State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-[#080B11] border border-slate-800 text-white rounded p-2.5 focus:outline-hidden focus:border-[#FFA000]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Assigned Manager & Compliance Tier details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase text-[#FFA000]">
              ASSIGNED RELATIONSHIP TEAM
            </h3>
            <div className="p-3 bg-[#080B11] border border-slate-800 rounded space-y-1.5 text-xs">
              <div className="font-bold text-white">Ashley Elvira</div>
              <div className="text-[11px] text-slate-300">Lead Account Manager & Cryptocurrency Analyst</div>
              <div className="text-[11px] font-mono text-[#FFA000] truncate">
                {COMPANY_DETAILS.accountManager.email}
              </div>
            </div>
          </div>

          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-5 space-y-3 text-xs">
            <h3 className="text-xs font-mono font-bold text-white uppercase">
              COMPLIANCE STATUS
            </h3>
            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">KYC Status</span>
                <span className="text-emerald-400 font-bold font-mono">VERIFIED</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Sanctions Screening</span>
                <span className="text-emerald-400 font-mono">CLEARED (OFAC)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Primary Market</span>
                <span className="font-mono text-white">Massachusetts, US</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
