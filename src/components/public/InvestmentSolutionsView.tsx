import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Mail,
  Clock,
  Coins,
  Wallet,
  Calculator,
  Sparkles,
  TrendingUp,
  Sliders,
  Copy,
  MessageCircle,
} from 'lucide-react';
import { RiskBanner } from '../common/RiskBanner';
import { COMPANY_DETAILS, ASSETS, OFFICIAL_INVESTMENT_PLANS, InvestmentPlanTier } from '../../constants/assets';
import { AttentionInvestmentBanner } from '../common/AttentionInvestmentBanner';

export const InvestmentSolutionsView: React.FC = () => {
  const { setDepositModalOpen, setSelectedDepositPlan, showNotification } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('starter-7d');

  // ROI Calculator Interactive State
  const [calcAmount, setCalcAmount] = useState<number>(250);
  const [calcPlanId, setCalcPlanId] = useState<string>('starter-7d');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const selectedTier = OFFICIAL_INVESTMENT_PLANS.find((p) => p.id === selectedPlanId) || OFFICIAL_INVESTMENT_PLANS[0];
  const calcTier = OFFICIAL_INVESTMENT_PLANS.find((p) => p.id === calcPlanId) || OFFICIAL_INVESTMENT_PLANS[0];

  const calcProfit = (calcAmount * calcTier.growthPercent) / 100;
  const calcTotalPayout = calcAmount + calcProfit;

  const handleOpenDeposit = (planName: string) => {
    setSelectedDepositPlan(planName);
    setDepositModalOpen(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(COMPANY_DETAILS.accountManager.email);
    setCopiedEmail(true);
    showNotification(`Copied ${COMPANY_DETAILS.accountManager.email} to clipboard`);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <div className="py-12 bg-[#000000] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Title Block */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono text-[#FFA000] tracking-wider uppercase font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AVAILABLE INVESTMENT PLANS & TARGET GROWTH TIERS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Structured Digital-Asset Investment Plans
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Minimum investment amount is <strong>$250</strong> delivering <strong>65% growth within 7 days</strong>. Every tier is spot-backed by segregated multi-signature cold custody, transparent execution, and dedicated account manager oversight.
          </p>
        </div>

        {/* Attention Notice & Direct Deposit Protocol */}
        <AttentionInvestmentBanner />

        {/* Investment Plans Cards Grid (4 Tiers) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#FFA000] uppercase">TIER COMPARISON</div>
              <h2 className="text-2xl font-bold text-white">Available Investment Plans</h2>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Minimum Duration: 7 Days
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {OFFICIAL_INVESTMENT_PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isStarter = plan.id === 'starter-7d';

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between relative cursor-pointer ${
                    isSelected
                      ? 'bg-[#101728] border-[#FFA000] shadow-xl ring-1 ring-[#FFA000]/50'
                      : 'bg-[#0A0D15] border-slate-800 hover:border-slate-700 hover:bg-[#0E131F]'
                  }`}
                >
                  {isStarter && (
                    <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#FFA000] text-black text-[10px] font-mono font-extrabold uppercase shadow-sm">
                      POPULAR MINIMUM TIER
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        {plan.riskRating}
                      </div>
                      <h3 className="text-xl font-bold text-white mt-0.5">{plan.name}</h3>
                      <div className="text-3xl font-extrabold text-[#FFA000] font-mono mt-2">
                        +{plan.growthPercent}%
                        <span className="text-xs text-slate-400 font-sans font-normal ml-1.5">Growth</span>
                      </div>
                    </div>

                    <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Minimum Capital:</span>
                        <span className="text-emerald-400 font-bold">${plan.minAmount.toLocaleString()} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Trading Duration:</span>
                        <span className="text-white font-semibold">{plan.durationLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payout Cycle:</span>
                        <span className="text-slate-300">{plan.payoutFrequency}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">Target Assets:</div>
                      <p className="line-clamp-2 text-slate-300 font-mono text-[11px]">{plan.targetAssets}</p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="pt-6 space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDeposit(plan.name);
                      }}
                      className="w-full py-2.5 px-4 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Invest in {plan.name}</span>
                    </button>
                    <div className="text-[10px] text-center text-slate-400 font-mono">
                      Contact: {COMPANY_DETAILS.accountManager.email}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Investment ROI Calculator */}
        <div className="p-6 sm:p-8 bg-[#0A0D15] border border-slate-800 rounded-2xl space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold flex items-center gap-1.5">
                <Calculator className="w-4 h-4" />
                <span>INTERACTIVE ESTIMATION ENGINE</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Investment Growth Calculator</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Formula: Payout = Principal + (Principal × Target Growth %)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Select Plan */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 uppercase">Select Investment Tier</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {OFFICIAL_INVESTMENT_PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => {
                        setCalcPlanId(plan.id);
                        if (calcAmount < plan.minAmount) {
                          setCalcAmount(plan.minAmount);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-colors cursor-pointer ${
                        calcPlanId === plan.id
                          ? 'bg-[#1E293B] border-[#FFA000] text-white shadow-xs'
                          : 'bg-[#080B11] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-white truncate">{plan.name}</div>
                      <div className="text-[#FFA000] font-bold text-[11px]">+{plan.growthPercent}% / {plan.durationDays}D</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enter Amount */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Investment Amount (USD)</span>
                  <span className="text-slate-400">Minimum: ${calcTier.minAmount.toLocaleString()}</span>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 font-bold text-base">$</span>
                  <input
                    type="number"
                    min={calcTier.minAmount}
                    step="50"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#080B11] border border-slate-800 text-white pl-9 pr-4 py-3 rounded-xl text-lg font-bold font-mono focus:outline-hidden focus:border-[#FFA000]"
                  />
                </div>

                {/* Quick Pre-Set Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[250, 500, 1000, 2500, 5000, 10000, 25000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setCalcAmount(preset);
                        // Auto switch tier if appropriate
                        if (preset >= 20000) setCalcPlanId('sovereign-30d');
                        else if (preset >= 5000) setCalcPlanId('institutional-21d');
                        else if (preset >= 1000) setCalcPlanId('executive-14d');
                        else setCalcPlanId('starter-7d');
                      }}
                      className="px-3 py-1 bg-[#111827] hover:bg-[#1E293B] border border-slate-800 text-slate-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
                    >
                      ${preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Projected Output Card */}
            <div className="lg:col-span-5 bg-[#0F1626] border border-amber-900/50 rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#FFA000] uppercase font-bold tracking-wider">
                  PROJECTED RETURN CALCULATION
                </span>
                <div className="text-xl font-bold text-white">
                  {calcTier.name} ({calcTier.durationDays} Days)
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs border-y border-slate-800/80 py-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Principal Investment:</span>
                  <span className="text-white font-bold">${calcAmount.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Growth Rate:</span>
                  <span className="text-[#FFA000] font-bold">+{calcTier.growthPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Trading Term Duration:</span>
                  <span className="text-white">{calcTier.durationDays} Days (Minimum Term)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Net Estimated Profit:</span>
                  <span className="text-emerald-400 font-bold">
                    +${calcProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
                  <span className="text-white font-bold">Total Estimated Payout:</span>
                  <span className="text-[#FFA000] font-extrabold text-base">
                    ${calcTotalPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleOpenDeposit(calcTier.name)}
                className="w-full py-3.5 px-4 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FFA000]/15"
              >
                <Wallet className="w-4 h-4" />
                <span>Deposit ${calcAmount.toLocaleString()} (Start {calcTier.durationDays}-Day Trading)</span>
              </button>

              <div className="text-[11px] text-center text-slate-400 font-sans">
                Coordinated directly by <strong>Ashley Elvira</strong> ({COMPANY_DETAILS.accountManager.email}).
              </div>
            </div>
          </div>
        </div>

        {/* Risk Banner */}
        <RiskBanner />
      </div>
    </div>
  );
};
