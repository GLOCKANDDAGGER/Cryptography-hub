import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ShieldCheck, TrendingUp, Lock, Users, Calendar, MessageCircle } from 'lucide-react';
import { ASSETS, COMPANY_DETAILS } from '../../constants/assets';
import { AttentionInvestmentBanner } from '../common/AttentionInvestmentBanner';

export const Hero: React.FC = () => {
  const {
    setActivePage,
    setAuthModalOpen,
    setAuthModalTab,
    marketAssets,
    setDepositModalOpen,
    setSelectedDepositPlan,
    setAppointmentModalOpen,
  } = useApp();

  const btcAsset = marketAssets.find((a) => a.symbol === 'BTC') || marketAssets[0];

  return (
    <section className="relative overflow-hidden bg-[#000000] pt-12 pb-16 border-b border-[#1E293B]">
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#FFA000]/10 via-[#FFA000]/3 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Positioning Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean metadata badge - Anti-pill compliance */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="text-[#FFA000] font-semibold">FINTECH INTELLIGENCE</span>
              <span aria-hidden="true">·</span>
              <span>{COMPANY_DETAILS.location}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                MIN $250 · 65% GROWTH / 7 DAYS
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] text-balance">
                Digital Assets. <br />
                <span className="text-[#FFA000]">Intelligent Strategies.</span> <br />
                Responsible Growth.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Explore a technology-driven digital-asset platform built around market intelligence, portfolio management, investor education, security, and dedicated professional client support.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedDepositPlan('Silver Growth Tier');
                  setDepositModalOpen(true);
                }}
                className="px-6 py-3.5 text-sm font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#FFA000]/15"
              >
                <span>Invest Now ($250 Min)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAppointmentModalOpen(true)}
                className="px-5 py-3.5 text-sm font-semibold text-white bg-[#111827] hover:bg-[#1E293B] border border-[#FFA000]/60 hover:border-[#FFA000] rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#FFA000]" />
                <span>Schedule Consultation</span>
              </button>

              <a
                href={COMPANY_DETAILS.accountManager.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 text-sm font-mono font-bold text-sky-300 hover:text-white bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 rounded-xl transition-all flex items-center gap-2"
                title="Chat directly with Account Manager Ashley Elvira on Telegram"
              >
                <MessageCircle className="w-4 h-4 text-sky-400" />
                <span>{COMPANY_DETAILS.accountManager.telegram}</span>
              </a>

              <button
                onClick={() => setActivePage('investment-solutions')}
                className="px-5 py-3.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-xl transition-all cursor-pointer"
              >
                View 7-Day Plans (65% ROI) →
              </button>
            </div>

            {/* Core Values Strip */}
            <div className="pt-6 border-t border-[#1E293B] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FFA000] shrink-0" />
                <span className="text-slate-300 font-medium">Multi-Sig Cold Custody</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FFA000] shrink-0" />
                <span className="text-slate-300 font-medium">Assigned Account Manager</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FFA000] shrink-0" />
                <span className="text-slate-300 font-medium">Transparent Audited Records</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden border border-[#262626] bg-[#0A0E17] shadow-2xl">
              <img
                src={ASSETS.heroBanner}
                alt="Crypto Hub Investments Institutional Analytics Floor"
                className="w-full h-80 object-cover opacity-90 hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-transparent to-transparent" />

              {/* Overlay card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-[#0B0F19]/90 backdrop-blur-md border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-mono text-slate-400">MARKET LIQUIDITY MONITOR</div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>SYNCHRONIZED</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px]">BTC / USD</div>
                    <div className="font-mono font-bold text-white tabular-nums">
                      ${btcAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">24H MOMENTUM</div>
                    <div className={`font-mono font-bold tabular-nums ${btcAsset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {btcAsset.change24h >= 0 ? `+${btcAsset.change24h}%` : `${btcAsset.change24h}%`}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">7-DAY TARGET</div>
                    <div className="font-mono font-bold text-[#FFA000]">+65% ROI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attention Notice: Make Investment Directly on Website */}
        <AttentionInvestmentBanner className="mt-10" />

        {/* Live Market Ticker Strip */}
        <div className="mt-8 p-3 bg-[#0A0E17] border border-[#1E293B] rounded-md">
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 text-xs">
            <div className="flex items-center gap-2 font-mono text-slate-400 shrink-0 pr-4 border-r border-slate-800">
              <span className="w-2 h-2 rounded-full bg-[#FFA000] animate-ping" />
              <span className="font-semibold text-slate-300">LIVE INTELLIGENCE:</span>
            </div>

            {marketAssets.map((asset) => (
              <div key={asset.symbol} className="flex items-center gap-2 shrink-0 px-3 border-r border-slate-800/80 last:border-0 font-mono">
                <span className="font-bold text-white">{asset.symbol}</span>
                <span className="text-slate-300 tabular-nums">
                  ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`tabular-nums font-semibold ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {asset.change24h >= 0 ? `+${asset.change24h}%` : `${asset.change24h}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
