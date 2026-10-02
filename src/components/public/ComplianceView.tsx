import React from 'react';
import { Shield, FileCheck2, Scale, AlertTriangle, Building2, UserCheck } from 'lucide-react';
import { COMPANY_DETAILS } from '../../constants/assets';

export const ComplianceView: React.FC = () => {
  const complianceFrameworks = [
    {
      title: 'Know Your Customer (KYC)',
      icon: UserCheck,
      desc: 'Tiered client identification procedures validating legal identities, corporate formation documents, beneficial ownership structures, and verified residential addresses prior to account activation.',
    },
    {
      title: 'Anti-Money Laundering (AML)',
      icon: Scale,
      desc: 'Automated on-chain heuristics and blockchain transaction screening designed to detect illicit flows, mixing services, darknet liquidity, and high-risk jurisdictional routing.',
    },
    {
      title: 'Sanctions & Watchlist Screening',
      icon: Shield,
      desc: 'Systematic screening of client counterparties and inbound wire origins against the U.S. Treasury Office of Foreign Assets Control (OFAC) Specially Designated Nationals (SDN) and global sanctions databases.',
    },
    {
      title: 'Audited Record Keeping & Privacy',
      icon: FileCheck2,
      desc: 'Secure preservation of financial ledgers, transactional receipts, signed risk acknowledgments, and encrypted client correspondence compliant with statutory retention mandates.',
    },
  ];

  return (
    <div className="py-12 bg-[#000000] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Title */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono text-[#FFA000] tracking-wider uppercase">
            REGULATORY & COMPLIANCE FRAMEWORK
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Ethical Governance & Rigorous Oversight
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Crypto Hub Investments adheres to institutional risk governance, transparent client disclosures, and verifiable transaction records.
          </p>
        </div>

        {/* Mandatory Transparency Disclosure Box */}
        <div className="p-6 bg-[#0E131E] border border-amber-900/60 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>MANDATORY LEGAL & REGULATORY DISCLOSURE</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In accordance with company policy and fair communication standards: Crypto Hub Investments does not claim to be government-approved, SEC-approved, FINRA-registered, bank-backed, or affiliated with any government agency unless independently established and verified. 
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Crypto Hub Investments operates as a financial technology and digital asset market analysis platform with its primary business association in <strong className="text-white">Massachusetts, United States</strong>. Cryptocurrency trading and foreign exchange involve significant financial risks, including the potential loss of all principal capital invested.
          </p>
        </div>

        {/* Framework Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complianceFrameworks.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="p-6 bg-[#0B0F19] border border-[#1E293B] rounded-lg space-y-3">
                <div className="w-10 h-10 rounded bg-[#111827] border border-slate-700 flex items-center justify-center text-[#FFA000]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Formal Complaints & Inquiry Protocol */}
        <div className="p-6 bg-[#080B10] border border-slate-800 rounded-md text-xs text-slate-400 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#FFA000]" />
            <span>Client Inquiries & Regulatory Correspondence</span>
          </h3>
          <p className="leading-relaxed">
            Formal inquiries, verification questions, or regulatory correspondence may be submitted directly to our dedicated oversight mailbox at: <span className="font-mono text-slate-200">{COMPANY_DETAILS.primaryEmail}</span>. All correspondence receives a formal reference identifier and response within two business days.
          </p>
        </div>
      </div>
    </div>
  );
};
