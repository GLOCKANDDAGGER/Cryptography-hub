import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_DETAILS, ASSETS, OFFICIAL_INVESTMENT_PLANS, InvestmentPlanTier } from '../../constants/assets';
import {
  X,
  ShieldCheck,
  Mail,
  ArrowRight,
  AlertTriangle,
  Coins,
  CheckCircle2,
  Clock,
  Copy,
  TrendingUp,
  Sparkles,
  Calculator,
  MessageCircle,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const DepositModal: React.FC = () => {
  const {
    depositModalOpen,
    setDepositModalOpen,
    selectedDepositPlan,
    setSelectedDepositPlan,
    submitDepositRequest,
    showNotification,
    setAppointmentModalOpen,
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('starter-7d');
  const [amount, setAmount] = useState<string>('250');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const currentPlan: InvestmentPlanTier =
    OFFICIAL_INVESTMENT_PLANS.find((p) => p.id === selectedPlanId) || OFFICIAL_INVESTMENT_PLANS[0];

  useEffect(() => {
    if (selectedDepositPlan) {
      const match = OFFICIAL_INVESTMENT_PLANS.find(
        (p) =>
          p.name.toLowerCase().includes(selectedDepositPlan.toLowerCase()) ||
          p.id.toLowerCase() === selectedDepositPlan.toLowerCase() ||
          (selectedDepositPlan.toLowerCase().includes('250') && p.minAmount === 250)
      );
      if (match) {
        setSelectedPlanId(match.id);
        setAmount(match.minAmount.toString());
      }
    }
  }, [selectedDepositPlan]);

  if (!depositModalOpen) return null;

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = OFFICIAL_INVESTMENT_PLANS.find((p) => p.id === planId);
    if (plan) {
      setAmount(plan.minAmount.toString());
      setError(null);
    }
  };

  const numericAmount = Math.max(0, parseFloat(amount) || 0);
  const calculatedProfit = (numericAmount * currentPlan.growthPercent) / 100;
  const totalProjectedPayout = numericAmount + calculatedProfit;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(COMPANY_DETAILS.accountManager.email);
    setCopiedEmail(true);
    showNotification(`Copied ${COMPANY_DETAILS.accountManager.email} to clipboard`);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(numericAmount) || numericAmount < currentPlan.minAmount) {
      setError(`Minimum investment for ${currentPlan.name} is $${currentPlan.minAmount.toLocaleString()} USD.`);
      return;
    }

    submitDepositRequest(currentPlan.name, numericAmount, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#0B0F19] border border-[#2B3547] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={() => setDepositModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AUTHENTIC CAPITAL DEPOSIT & INVESTMENT PLANS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Initiate Investment Deposit
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Minimum investment amount is <strong>$250</strong> delivering <strong>65% growth within 7 days</strong>. To fund your account, contact Lead Account Manager <strong>Ashley Elvira</strong> directly.
          </p>
        </div>

        {/* Dedicated Account Manager Direct Contact Box */}
        <div className="p-4 bg-[#0F1626] border border-amber-800/60 rounded-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FFA000] shrink-0">
              <img
                src={ASSETS.ashleyElviraPortrait}
                alt={COMPANY_DETAILS.accountManager.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-[10px] font-mono text-[#FFA000] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>OFFICIAL DEPOSIT COORDINATOR</span>
              </div>
              <div className="text-sm font-bold text-white truncate">
                {COMPANY_DETAILS.accountManager.name}
              </div>
              <div className="text-xs text-slate-300 font-mono flex items-center gap-2">
                <span className="text-[#FFA000] font-semibold">{COMPANY_DETAILS.accountManager.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={COMPANY_DETAILS.accountManager.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 text-sky-400 text-xs rounded font-mono font-bold flex items-center gap-1.5 transition-colors"
                title="Direct Message on Telegram"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{COMPANY_DETAILS.accountManager.telegram}</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-2.5 py-1.5 bg-[#1B2538] hover:bg-[#25334D] border border-slate-700 text-slate-200 text-xs rounded font-mono flex items-center gap-1.5 transition-colors"
                title="Copy Email"
              >
                <Copy className="w-3.5 h-3.5 text-[#FFA000]" />
                <span>{copiedEmail ? 'Copied' : 'Email'}</span>
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-[#090D17] rounded-lg border border-slate-800 text-[11px] text-slate-300 leading-relaxed font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong>Deposit Instructions:</strong> Contact Ashley via Telegram <a href={COMPANY_DETAILS.accountManager.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 font-bold hover:underline">{COMPANY_DETAILS.accountManager.telegram}</a> or email <span className="font-mono text-[#FFA000]">{COMPANY_DETAILS.accountManager.email}</span> with your preferred payment asset (BTC, ETH, USDT).
            </div>
            <button
              type="button"
              onClick={() => {
                setDepositModalOpen(false);
                setAppointmentModalOpen(true);
              }}
              className="text-[#FFA000] hover:underline font-bold text-[10px] uppercase font-mono shrink-0 cursor-pointer flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" />
              <span>Book Appointment First</span>
            </button>
          </div>
        </div>

        {/* Plan Selector Grid */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-300 uppercase flex items-center justify-between">
            <span>1. Choose Available Investment Plan</span>
            <span className="text-[#FFA000] font-bold">Min: $250 · 65% in 7 Days</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {OFFICIAL_INVESTMENT_PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => handlePlanChange(plan.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#101726] border-[#FFA000] shadow-md ring-1 ring-[#FFA000]/60'
                      : 'bg-[#080B11] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start text-xs font-mono">
                    <span className="font-bold text-white">{plan.name}</span>
                    <span className="text-[#FFA000] font-bold shrink-0 text-sm">
                      +{plan.growthPercent}%
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5 font-semibold">
                    Min: ${plan.minAmount.toLocaleString()} USD
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#FFA000]" />
                    <span>Duration: {plan.durationLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-Time Return Calculator Preview */}
        <div className="p-4 bg-[#080B11] border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800/80 pb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-[#FFA000]" />
              <span>Projected Return Summary</span>
            </span>
            <span className="text-[#FFA000] font-bold">
              {currentPlan.growthPercent}% Growth in {currentPlan.durationDays} Days
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 bg-[#0F1420] rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">DEPOSIT AMOUNT</div>
              <div className="text-white font-bold mt-0.5">${numericAmount.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-[#0F1420] rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">NET PROFIT (+{currentPlan.growthPercent}%)</div>
              <div className="text-emerald-400 font-bold mt-0.5">+${calculatedProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="p-2 bg-[#0F1420] rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">TOTAL PAYOUT</div>
              <div className="text-[#FFA000] font-bold mt-0.5">${totalProjectedPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        {/* Deposit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>2. Enter Investment Capital (USD)</span>
              <span className="text-slate-400">Minimum: ${currentPlan.minAmount}</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">$</span>
              <input
                type="number"
                min={currentPlan.minAmount}
                step="any"
                required
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                className="w-full bg-[#080B11] border border-slate-800 text-white pl-8 pr-3.5 py-2.5 rounded-lg text-base font-bold focus:outline-hidden focus:border-[#FFA000]"
              />
            </div>
            {error && <p className="text-rose-400 text-[11px] font-sans pt-0.5">{error}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">3. Preferred Payment Method / Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Bitcoin (BTC), USDT-TRC20, or Domestic Bank Wire"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#080B11] border border-slate-800 text-white px-3.5 py-2.5 rounded-lg focus:outline-hidden focus:border-[#FFA000]"
            />
          </div>

          {/* Regulatory Risk Notice */}
          <div className="flex items-start gap-2 text-[10px] text-slate-400 leading-normal font-sans">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FFA000] shrink-0 mt-0.5" />
            <span>
              {COMPANY_DETAILS.disclaimer} Digital asset investments involve capital volatility.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <a
              href={`mailto:${COMPANY_DETAILS.accountManager.email}?subject=Investment Deposit Request - ${currentPlan.name} ($${numericAmount})&body=Hello Ashley,%0D%0A%0D%0AI would like to make an investment deposit of $${numericAmount} USD into the ${currentPlan.name} (${currentPlan.growthPercent}% growth within ${currentPlan.durationDays} days).%0D%0A%0D%0APlease send me official custodial deposit and wallet routing instructions.%0D%0A%0D%0AThank you.`}
              className="py-3 px-4 text-xs font-bold text-white bg-[#1A2338] hover:bg-[#24314E] border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <Mail className="w-3.5 h-3.5 text-[#FFA000]" />
              <span>Email Ashley Directly</span>
            </a>

            <button
              type="submit"
              className="py-3 px-4 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Submit Deposit Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
