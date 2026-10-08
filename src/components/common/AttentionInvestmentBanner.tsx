import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_DETAILS } from '../../constants/assets';
import {
  AlertTriangle,
  Wallet,
  Copy,
  Check,
  MessageCircle,
  Mail,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Sparkles,
} from 'lucide-react';

interface AttentionInvestmentBannerProps {
  className?: string;
  variant?: 'full' | 'compact' | 'minimal';
}

export const AttentionInvestmentBanner: React.FC<AttentionInvestmentBannerProps> = ({
  className = '',
  variant = 'full',
}) => {
  const { setDepositModalOpen, setSelectedDepositPlan, showNotification } = useApp();
  const [copied, setCopied] = useState(false);
  const btcAddress = COMPANY_DETAILS.officialDeposit.address;

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(btcAddress);
    setCopied(true);
    showNotification('Official BTC Deposit Address copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenDeposit = () => {
    setSelectedDepositPlan('Silver Growth Tier');
    setDepositModalOpen(true);
  };

  if (variant === 'compact') {
    return (
      <div
        className={`bg-gradient-to-r from-[#171206] via-[#1A150A] to-[#0F1424] border border-[#FFA000]/60 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FFA000]/20 border border-[#FFA000]/50 flex items-center justify-center text-[#FFA000] shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#FFA000] uppercase tracking-wider">
                ATTENTION: MAKE INVESTMENT DIRECTLY ON WEBSITE
              </span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                MIN $250 · 65% / 7 DAYS
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              Use official BTC address below, upload your payment screenshot, and direct user to send deposit proof to Ashley Elvira.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-xs">
              <span className="text-slate-400">BTC Address:</span>
              <span className="text-amber-400 font-bold select-all">{btcAddress}</span>
              <button
                onClick={handleCopyAddress}
                className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 underline cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#FFA000]" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <button
            onClick={handleOpenDeposit}
            className="flex-1 md:flex-none px-4 py-2.5 bg-[#FFA000] hover:bg-[#FFB300] text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Make Investment Now</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-[#120F08] via-[#0E1322] to-[#0A0D16] border-2 border-[#FFA000]/70 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-[#FFA000]/10 blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 space-y-4">
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/40 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-[#FFA000] shrink-0 shadow-inner">
              <AlertTriangle className="w-5 h-5 text-[#FFA000] animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-[#FFA000] uppercase font-extrabold tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL NOTICE & MANDATORY DEPOSIT DIRECTIVE</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                ATTENTION: Make Investment Directly on the Website
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-3 py-1 bg-amber-950/90 text-amber-300 border border-amber-600/50 rounded-lg uppercase">
              Network: Bitcoin (BTC)
            </span>
            <span className="text-[10px] font-mono font-bold px-3 py-1 bg-emerald-950/90 text-emerald-300 border border-emerald-600/50 rounded-lg uppercase">
              Min: $250 USD
            </span>
          </div>
        </div>

        {/* Core Directive Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-8 space-y-3">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              To make your investment, you must execute your deposit <strong className="text-white">directly on this website</strong> using our official Bitcoin custodial details below. After broadcasting the transaction, <strong className="text-amber-400">upload your payment screenshot</strong> and <strong className="text-amber-400">directly send your proof of deposit</strong> to Lead Account Manager <strong>Ashley Elvira</strong> for instant ledger clearance.
            </p>

            {/* Official Deposit Details Box */}
            <div className="p-3.5 bg-[#050810] border border-amber-800/60 rounded-xl space-y-2 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-slate-400 uppercase text-[10px] font-bold">
                  Official Custodial BTC Address:
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  ✓ Verified Dual-Signature Cold Vault
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 p-2.5 bg-[#0B0F19] border border-slate-800 rounded-lg">
                <span className="text-xs sm:text-sm font-bold text-[#FFA000] select-all break-all tracking-wider">
                  {btcAddress}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="px-3 py-1.5 bg-[#1F293D] hover:bg-[#2B3A55] border border-slate-700 text-slate-200 rounded-md shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold"
                  title="Copy Official BTC Address"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#FFA000]" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>

              {/* 3 Step Protocol Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2 bg-[#090D18] rounded border border-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFA000] text-black font-bold flex items-center justify-center shrink-0 text-[10px]">
                    1
                  </span>
                  <span className="text-slate-300">Direct Deposit ($250 Min)</span>
                </div>
                <div className="p-2 bg-[#090D18] rounded border border-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFA000] text-black font-bold flex items-center justify-center shrink-0 text-[10px]">
                    2
                  </span>
                  <span className="text-slate-300">Request Screenshot Proof</span>
                </div>
                <div className="p-2 bg-[#090D18] rounded border border-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFA000] text-black font-bold flex items-center justify-center shrink-0 text-[10px]">
                    3
                  </span>
                  <span className="text-slate-300">Direct User to Send Proof</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <button
              onClick={handleOpenDeposit}
              className="w-full py-3.5 px-4 bg-[#FFA000] hover:bg-[#FFB300] text-black font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FFA000]/20"
            >
              <Wallet className="w-4 h-4" />
              <span>Make Investment On Website</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={COMPANY_DETAILS.accountManager.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 text-sky-400 font-mono font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct Telegram: {COMPANY_DETAILS.accountManager.telegram}</span>
            </a>

            <div className="text-[10px] text-center text-slate-400 font-mono">
              Lead Manager: Ashley Elvira · {COMPANY_DETAILS.accountManager.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
