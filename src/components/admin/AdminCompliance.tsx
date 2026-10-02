import React from 'react';
import { ShieldCheck, Scale, AlertTriangle, FileCheck, CheckCircle2 } from 'lucide-react';
import { COMPANY_DETAILS } from '../../constants/assets';

export const AdminCompliance: React.FC = () => {
  const complianceItems = [
    {
      entity: 'Marcus Vance',
      type: 'Individual High Net Worth',
      kycTier: 'Tier 1 Standard',
      sanctionsStatus: 'CLEARED (OFAC SDN)',
      riskScore: 'Low (12/100)',
      lastScreened: '2026-09-25',
      decision: 'APPROVED',
    },
    {
      entity: 'Eleanor Wright',
      type: 'Individual Institutional',
      kycTier: 'Tier 2 Enhanced',
      sanctionsStatus: 'CLEARED (OFAC SDN)',
      riskScore: 'Low (18/100)',
      lastScreened: '2026-09-24',
      decision: 'APPROVED',
    },
    {
      entity: 'Apex Digital Treasury LLC',
      type: 'Corporate Entity',
      kycTier: 'Tier 2 Enhanced',
      sanctionsStatus: 'CLEARED (OFAC SDN)',
      riskScore: 'Moderate (24/100)',
      lastScreened: '2026-09-22',
      decision: 'APPROVED',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-lg p-5">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            KYC, AML & SANCTIONS SCREENING CONSOLE
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Compliance & Entity Oversight
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Primary association: Massachusetts, United States · U.S. Treasury OFAC automated integration
          </p>
        </div>
      </div>

      {/* Mandatory Regulatory Policy Box */}
      <div className="p-5 bg-[#0E1524] border border-amber-900/60 rounded-lg text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold uppercase font-mono">
          <AlertTriangle className="w-4 h-4" />
          <span>STATUTORY TRANSPARENCY MANDATE</span>
        </div>
        <p className="leading-relaxed">
          Crypto Hub Investments enforces strict anti-money laundering (AML) controls and sanctions screening. All prospective accounts must submit verifiable government-issued credentials and corporate formation charters before custodial funds may be settled.
        </p>
      </div>

      {/* Roster */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
          <h2 className="text-sm font-bold text-white uppercase font-mono">
            SCREENED ENTITY QUEUE
          </h2>
          <span className="text-xs font-mono text-emerald-400">100% Watchlist Clearance Rate</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Entity Name</th>
                <th className="py-2.5 px-3">Account Type</th>
                <th className="py-2.5 px-3">KYC Verification</th>
                <th className="py-2.5 px-3">OFAC Watchlist</th>
                <th className="py-2.5 px-3 text-right">Risk Assessment</th>
                <th className="py-2.5 px-3 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {complianceItems.map((item) => (
                <tr key={item.entity} className="hover:bg-[#111827]/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{item.entity}</td>
                  <td className="py-3 px-3 text-slate-400">{item.type}</td>
                  <td className="py-3 px-3 text-slate-200">{item.kycTier}</td>
                  <td className="py-3 px-3 text-emerald-400">{item.sanctionsStatus}</td>
                  <td className="py-3 px-3 text-right text-slate-300">{item.riskScore}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      {item.decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
