import React from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS, COMPANY_DETAILS } from '../../constants/assets';
import { AttentionInvestmentBanner } from '../common/AttentionInvestmentBanner';
import { ActiveInvestmentCard } from './ActiveInvestmentCard';
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownToLine,
  ShieldCheck,
  UserCheck,
  Mail,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  Tag,
  Gift,
  Coins,
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    user,
    portfolio,
    transactions,
    activeInvestment,
    setActivePage,
    setDepositModalOpen,
    setWithdrawalModalOpen,
  } = useApp();

  // Authoritative financial fields from centralized backend records
  const totalBalance = user.numericBalance ?? portfolio.totalVerifiedValue ?? 0;
  const availableBalance = user.availableBalance ?? user.balance ?? portfolio.availableCash ?? 0;
  const promotionalBalance = user.promotionalBalance ?? 0;
  const investedCapital = user.investedCapital ?? (activeInvestment ? activeInvestment.initialCapital : portfolio.investedValue) ?? 0;
  const profitLoss = user.profitLoss ?? (activeInvestment ? activeInvestment.profit : 0) ?? 0;
  const withdrawableBalance = user.withdrawableBalance !== undefined ? user.withdrawableBalance : Math.max(0, availableBalance);

  const firstName = user.name ? user.name.split(' ')[0] : 'Investor';

  return (
    <div className="space-y-6">
      {/* Welcome & Account Identifiers */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-xl p-5 sm:p-6 shadow-sm">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            AUTHORITATIVE CLIENT LEDGER · SECURE SESSION
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
            Welcome back, {user.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-mono mt-1.5">
            <span>Account #{user.accountNumber}</span>
            <span>·</span>
            {user.username && (
              <>
                <span>Username: <strong className="text-slate-200">@{user.username}</strong></span>
                <span>·</span>
              </>
            )}
            <span>Risk Profile: {portfolio.riskProfile}</span>
            <span>·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Custody Verified</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setDepositModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Make a Deposit</span>
          </button>
          <button
            onClick={() => setWithdrawalModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-white bg-[#0D1525] border border-slate-700 hover:border-[#FFA000]/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 text-[#FFA000]" />
            <span>Request Withdrawal</span>
          </button>
          <button
            onClick={() => setActivePage('portfolio')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#111827] border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Allocations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Attention: Make Investment Directly on Website */}
      <AttentionInvestmentBanner variant="compact" />

      {/* Main Authoritative Financial Ledger Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Total Account Balance */}
        <div className="p-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>TOTAL BALANCE</span>
            <Wallet className="w-3.5 h-3.5 text-[#FFA000]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Verified Valuation</span>
          </div>
        </div>

        {/* Card 2: Available Portfolio Balance */}
        <div className="p-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>AVAILABLE FUNDS</span>
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Ready for Investment ($250 min)
          </div>
        </div>

        {/* Card 3: Invested Capital */}
        <div className="p-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>INVESTED CAPITAL</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#FFA000]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
            ${investedCapital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {activeInvestment ? activeInvestment.planName : 'Core Cold Custody'}
          </div>
        </div>

        {/* Card 4: Profit / Loss */}
        <div className="p-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>PROFIT / LOSS</span>
            <span className="text-[10px] font-mono px-1 rounded bg-emerald-950 text-emerald-400 font-bold">P&L</span>
          </div>
          <div className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {profitLoss >= 0 ? `+$${profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `-$${Math.abs(profitLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {activeInvestment ? `+${activeInvestment.growthPercent.toFixed(1)}% Cycle Growth` : 'Cumulative Realized'}
          </div>
        </div>

        {/* Card 5: Withdrawable Balance */}
        <div className="p-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>WITHDRAWABLE</span>
            <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            ${withdrawableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Threshold: $500.00 Min
          </div>
        </div>

        {/* Card 6: Promotional Balance */}
        <div className="p-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>PROMO CREDIT</span>
            <Gift className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-purple-300 tabular-nums">
            ${promotionalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-purple-400/80 font-mono">
            Separate Non-Withdrawable
          </div>
        </div>
      </div>

      {/* Dedicated Active Investment Card */}
      <ActiveInvestmentCard />

      {/* Middle Grid: Assigned Account Manager & Portfolio Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Assigned Account Manager Card (Ashley Elvira) */}
        <div className="lg:col-span-5 bg-[#0B0F19] border border-[#1F2937] rounded-xl p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-xs font-mono text-[#FFA000] uppercase font-bold flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span>ASSIGNED ACCOUNT MANAGER</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                ACTIVE ON DESK
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-[#FFA000]">
                  <img
                    src={ASSETS.ashleyElviraPortrait}
                    alt="Ashley Elvira - Account Manager"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="space-y-1 overflow-hidden">
                <h3 className="text-lg font-bold text-white">Ashley Elvira</h3>
                <div className="text-xs text-[#FFA000] font-medium">
                  Cryptocurrency Analyst · Bitcoin & Forex Account Manager
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  More than 7 years trading experience
                </div>
                <div className="text-xs text-slate-300 font-mono truncate pt-1">
                  <a href={`mailto:${COMPANY_DETAILS.accountManager.email}`} className="hover:underline text-slate-300">
                    {COMPANY_DETAILS.accountManager.email}
                  </a>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#080B11] p-3 rounded-lg border border-slate-800 font-sans">
              "Good morning {firstName}. Your portfolio allocations remain segregated under cold custody. I am continuously monitoring market volatility and trade settlement benchmarks."
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActivePage('account-manager')}
              className="flex-1 py-2.5 px-3 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Open Communication Desk</span>
            </button>
            <a
              href={`https://t.me/${COMPANY_DETAILS.accountManager.telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Telegram Desk</span>
            </a>
          </div>
        </div>

        {/* Right Col: Asset Allocations Overview */}
        <div className="lg:col-span-7 bg-[#0B0F19] border border-[#1F2937] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="text-xs font-mono text-slate-400 uppercase font-semibold">
              CURRENT ASSET ALLOCATION
            </div>
            <button
              onClick={() => setActivePage('portfolio')}
              className="text-xs font-mono text-[#FFA000] hover:underline cursor-pointer"
            >
              Detailed Breakdown →
            </button>
          </div>

          <div className="space-y-3">
            {portfolio.assets.map((asset) => (
              <div key={asset.symbol} className="p-3 bg-[#080B11] border border-slate-800 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white">{asset.name}</span>
                    <span className="text-slate-400">({asset.symbol})</span>
                  </div>
                  <div className="font-mono text-right">
                    <span className="text-white font-bold tabular-nums">
                      ${asset.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[#FFA000] ml-2 font-bold tabular-nums">
                      {asset.allocationPercent}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#111827] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FFA000] h-full rounded-full"
                    style={{ width: `${asset.allocationPercent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Holdings: {asset.amount.toFixed(4)} {asset.symbol}</span>
                  <span className={asset.unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    Unrealized P&L: {asset.unrealizedPnL >= 0 ? `+$${asset.unrealizedPnL.toLocaleString()}` : `-$${Math.abs(asset.unrealizedPnL).toLocaleString()}`} ({asset.unrealizedPnLPercent}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Table: Recent Verified Transactions */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              RECENT VERIFIED LEDGER ACTIVITY
            </h3>
            <p className="text-xs text-slate-400">Directly synchronized with institutional custody records</p>
          </div>
          <button
            onClick={() => setActivePage('transactions')}
            className="text-xs font-mono text-[#FFA000] hover:underline cursor-pointer"
          >
            Full Ledger ({transactions.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Reference ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Amount (USD)</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="hover:bg-[#111827]/50 transition-colors">
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{tx.date}</td>
                  <td className="py-3 px-3 text-[#FFA000] font-semibold whitespace-nowrap">{tx.referenceId}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-bold">
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white max-w-xs truncate">{tx.description}</td>
                  <td className="py-3 px-3 text-right text-white font-bold tabular-nums">
                    ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        tx.status === 'COMPLETED' || tx.status === 'CREDITED'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : tx.status === 'UNDER_REVIEW'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tx.status}
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
