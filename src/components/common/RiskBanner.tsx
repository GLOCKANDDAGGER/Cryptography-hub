import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { COMPANY_DETAILS } from '../../constants/assets';

interface RiskBannerProps {
  compact?: boolean;
  className?: string;
}

export const RiskBanner: React.FC<RiskBannerProps> = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`border-t border-[#1F2937] bg-[#0A0E17] px-4 py-2 text-xs text-slate-400 ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FFA000] shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{COMPANY_DETAILS.disclaimer}</span>
          </div>
          <span className="shrink-0 text-slate-400 font-mono text-[11px]">
            {COMPANY_DETAILS.location}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-[#262626] bg-[#0C101A] p-4 text-xs text-slate-300 rounded-md ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-[#FFA000] mt-0.5 shrink-0" aria-hidden="true" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-100 flex items-center gap-2">
            <span>Mandatory Regulatory & Risk Disclosure</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300 font-mono text-[11px]">{COMPANY_DETAILS.location}</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            {COMPANY_DETAILS.disclaimer} Crypto Hub Investments does not make speculative return guarantees. All digital-asset portfolio decisions should be evaluated against individual risk tolerance and verified financial objectives.
          </p>
        </div>
      </div>
    </div>
  );
};

export const DemoDataNotice: React.FC<{ contextName?: string; className?: string }> = ({
  contextName = 'Portfolio Ledger & Performance',
  className = '',
}) => {
  return (
    <div className={`border border-amber-900/60 bg-amber-950/20 px-3.5 py-2 rounded text-xs text-amber-200/90 flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#FFA000] shrink-0" />
        <div>
          <span className="font-semibold tracking-wider text-amber-300 uppercase text-[11px] mr-2">
            Demo Prototype Environment
          </span>
          <span className="text-slate-300">
            Displaying simulated verification data for {contextName}. Not a live bank or financial instrument record.
          </span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-amber-400/80 shrink-0">
        <span>SAMPLE ACCOUNT</span>
        <span>·</span>
        <span>AUDIT TRACE #CHI-DEMO-2026</span>
      </div>
    </div>
  );
};
