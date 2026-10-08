import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MIN_INVESTMENT_AMOUNT, COMPANY_DETAILS } from '../../constants/assets';
import {
  TrendingUp,
  Clock,
  Calendar,
  AlertCircle,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const ActiveInvestmentCard: React.FC = () => {
  const { user, activeInvestment, startInvestment, setDepositModalOpen } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Silver Growth Tier');
  const [amount, setAmount] = useState<number>(MIN_INVESTMENT_AMOUNT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const availableBalance = user.availableBalance ?? user.balance ?? 0;
  const meetsMinimumFunds = availableBalance >= MIN_INVESTMENT_AMOUNT;

  const investmentPlans = [
    {
      name: 'Starter Digital Strategy',
      minAmount: 250,
      durationDays: 7,
      targetGrowth: '45% - 55%',
      strategy: 'Bitcoin Spot Volatility & Core Reserves',
      description: 'Disciplined cold-custody execution designed for capital preservation and systematic spot accumulation.',
    },
    {
      name: 'Silver Growth Tier',
      minAmount: 500,
      durationDays: 7,
      targetGrowth: '60% - 65%',
      strategy: 'Multi-Asset Hedged Volatility Harvesting',
      description: 'Balanced multi-asset allocation actively supervised by Lead Account Manager Ashley Elvira.',
    },
    {
      name: 'Institutional Alpha Mandate',
      minAmount: 2500,
      durationDays: 14,
      targetGrowth: '75% - 85%',
      strategy: 'Automated Algorithmic Arbitrage & On-Chain Yield',
      description: 'Bespoke high-volume cyclical deployment with dedicated multi-signature authorization.',
    },
  ];

  const handleStartInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    if (amount < MIN_INVESTMENT_AMOUNT) {
      setActionError(`Minimum investment amount is $${MIN_INVESTMENT_AMOUNT.toFixed(2)} USD.`);
      return;
    }

    if (amount > availableBalance) {
      setActionError(`Insufficient eligible portfolio funds ($${availableBalance.toLocaleString()}). You need at least $${amount.toLocaleString()} to start this investment.`);
      return;
    }

    setIsSubmitting(true);
    const result = await startInvestment(selectedPlan, amount);
    setIsSubmitting(false);

    if (result.success) {
      setModalOpen(false);
    } else {
      setActionError(result.message || 'Failed to start investment.');
    }
  };

  return (
    <>
      <div className="bg-[#0B0F19] border border-[#1E293B] rounded-xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-3 bg-[#0D1424]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFA000]/15 border border-[#FFA000]/30 flex items-center justify-center text-[#FFA000]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Active Investment Experience
                </h3>
                {activeInvestment ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {activeInvestment.status}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    READY TO DEPLOY
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authoritative cycle performance supervised by Lead Account Manager {COMPANY_DETAILS.accountManager.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{activeInvestment ? 'Modify / New Plan' : 'Start Investment'}</span>
          </button>
        </div>

        {/* Content */}
        {activeInvestment ? (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Top Stat Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3.5 bg-[#080C14] border border-[#1E293B] rounded-lg">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Initial Capital</div>
                <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1 tabular-nums">
                  ${activeInvestment.initialCapital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Committed Funds</div>
              </div>

              <div className="p-3.5 bg-[#080C14] border border-[#1E293B] rounded-lg">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Current Value</div>
                <div className="text-lg sm:text-xl font-bold font-mono text-[#FFA000] mt-1 tabular-nums">
                  ${activeInvestment.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                  <span>+{activeInvestment.growthPercent.toFixed(2)}% Growth</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#080C14] border border-[#1E293B] rounded-lg">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Unrealized Profit</div>
                <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                  +${activeInvestment.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Accrued to date</div>
              </div>

              <div className="p-3.5 bg-[#080C14] border border-[#1E293B] rounded-lg">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Cycle Term</div>
                <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
                  Day {activeInvestment.currentDay} of {activeInvestment.durationDays}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Target: +{activeInvestment.targetGrowthPercent}%
                </div>
              </div>
            </div>

            {/* Cycle Progress Bar */}
            <div className="p-4 bg-[#080C14] border border-[#1E293B] rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FFA000]" />
                  <span>Cycle Progress</span>
                </span>
                <span className="text-[#FFA000] font-bold">
                  {Math.round((activeInvestment.currentDay / activeInvestment.durationDays) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#111827] rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-[#FFA000] to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((activeInvestment.currentDay / activeInvestment.durationDays) * 100))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Started: {activeInvestment.startDate ? new Date(activeInvestment.startDate).toLocaleDateString() : 'Active'}
                </span>
                <span>
                  Expected Completion: {activeInvestment.expectedCompletionDate ? new Date(activeInvestment.expectedCompletionDate).toLocaleDateString() : '7 Days'}
                </span>
              </div>
            </div>

            {/* Growth Steps History */}
            {activeInvestment.growthHistory && activeInvestment.growthHistory.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400 uppercase font-semibold">
                  Hourly & Daily Performance Log
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeInvestment.growthHistory.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#080C14]/80 border border-slate-800/80 rounded-lg text-xs font-mono"
                    >
                      <div className="text-[10px] text-slate-400 truncate">{step.timestamp || step.step}</div>
                      <div className="text-white font-bold mt-1 text-sm tabular-nums">
                        ${step.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">
                        {idx === 0 ? 'Baseline' : `+${(((step.value - activeInvestment.initialCapital) / activeInvestment.initialCapital) * 100).toFixed(1)}%`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategy Disclosures */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1E293B] text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Strategy: <strong className="text-slate-200">{activeInvestment.strategy}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFA000]" />
                <span>Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EST</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#FFA000]/10 border border-[#FFA000]/30 mx-auto flex items-center justify-center text-[#FFA000]">
              <TrendingUp className="w-7 h-7" />
            </div>

            <div className="max-w-md mx-auto space-y-1.5">
              <h4 className="text-lg font-bold text-white">No Active Investment Currently Deployed</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Start an active 7-day or 14-day cycle to allocate capital into disciplined crypto strategies managed under dedicated cold custody. Minimum investment: <strong>${MIN_INVESTMENT_AMOUNT.toFixed(2)} USD</strong>.
              </p>
            </div>

            {!meetsMinimumFunds && (
              <div className="max-w-md mx-auto p-3.5 bg-amber-950/40 border border-amber-800/80 rounded-lg text-left">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#FFA000] shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-[#FFA000] font-mono">Minimum Investment Not Met</div>
                    <div className="text-slate-300 leading-relaxed">
                      You need at least ${MIN_INVESTMENT_AMOUNT.toFixed(2)} in eligible portfolio funds to start an investment.
                    </div>
                    <div className="pt-1">
                      <button
                        onClick={() => setDepositModalOpen(true)}
                        className="text-xs font-bold text-[#FFA000] hover:underline cursor-pointer"
                      >
                        Make a deposit to fund your balance →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                disabled={!meetsMinimumFunds}
                className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2 ${
                  meetsMinimumFunds
                    ? 'text-black bg-[#FFA000] hover:bg-[#FFB300] shadow-md'
                    : 'text-slate-400 bg-slate-800 cursor-not-allowed opacity-60'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Start New Investment (${MIN_INVESTMENT_AMOUNT} Min)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Start Investment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0B0F19] border border-[#1E293B] rounded-xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#0D1424]">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Initiate Active Investment</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Available Eligible Balance: ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleStartInvestment} className="p-5 sm:p-6 space-y-5">
              {!meetsMinimumFunds ? (
                <div className="p-4 bg-amber-950/40 border border-amber-800 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-[#FFA000] font-bold text-xs font-mono">
                    <AlertCircle className="w-4 h-4" />
                    <span>Minimum Investment Not Met</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    You need at least ${MIN_INVESTMENT_AMOUNT.toFixed(2)} in eligible portfolio funds to start an investment.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false);
                      setDepositModalOpen(true);
                    }}
                    className="w-full mt-2 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors"
                  >
                    Fund Balance via Custodial Deposit
                  </button>
                </div>
              ) : (
                <>
                  {/* Select Plan */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-300 uppercase font-semibold">
                      Select Investment Strategy
                    </label>
                    <div className="space-y-2">
                      {investmentPlans.map((plan) => (
                        <div
                          key={plan.name}
                          onClick={() => {
                            setSelectedPlan(plan.name);
                            if (amount < plan.minAmount) setAmount(plan.minAmount);
                          }}
                          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                            selectedPlan === plan.name
                              ? 'bg-[#FFA000]/10 border-[#FFA000] shadow-sm'
                              : 'bg-[#080C14] border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{plan.name}</span>
                            <span className="text-[#FFA000] font-mono font-bold">
                              Target: {plan.targetGrowth} ({plan.durationDays} Days)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{plan.description}</p>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            Min: ${plan.minAmount} USD · Strategy: {plan.strategy}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investment Amount */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <label className="text-slate-300 uppercase font-semibold">Allocation Capital (USD)</label>
                      <span className="text-slate-400">Min: ${MIN_INVESTMENT_AMOUNT.toFixed(2)}</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">$</span>
                      <input
                        type="number"
                        min={MIN_INVESTMENT_AMOUNT}
                        max={availableBalance}
                        step="10"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#080C14] border border-slate-700 rounded-lg pl-8 pr-20 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#FFA000]"
                      />
                      <button
                        type="button"
                        onClick={() => setAmount(Math.floor(availableBalance))}
                        className="absolute right-2 top-2 px-2 py-1 text-[10px] font-mono font-bold text-[#FFA000] bg-[#FFA000]/10 hover:bg-[#FFA000]/20 rounded"
                      >
                        MAX
                      </button>
                    </div>
                  </div>

                  {actionError && (
                    <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-lg text-xs text-red-300 whitespace-pre-line">
                      {actionError}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || amount < MIN_INVESTMENT_AMOUNT || amount > availableBalance}
                      className="px-5 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm & Allocate ${amount.toLocaleString()}</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};
