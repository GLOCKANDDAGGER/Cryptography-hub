import React from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS, COMPANY_DETAILS } from '../../constants/assets';
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  UserCheck,
  Mail,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { user, portfolio, transactions, setActivePage, setDepositModalOpen } = useApp();

  return (
    <div className="space-y-6">
      {/* Welcome & Account Identifiers */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-lg p-5">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            VERIFIED INSTITUTIONAL ACCOUNT
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Welcome back, {user.name}
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
            <span>Account #{user.accountNumber}</span>
            <span>·</span>
            <span>Risk Profile: {portfolio.riskProfile}</span>
            <span>·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Custody Verified</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDepositModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Make a Deposit</span>
          </button>
          <button
            onClick={() => setActivePage('portfolio')}
            className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-[#111827] border border-slate-700 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Manage Allocations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Investment Plan Banner */}
      <div className="p-4 bg-[#0D1525] border border-amber-900/60 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFA000]/10 border border-[#FFA000]/40 flex items-center justify-center text-[#FFA000] shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-bold text-white">Active Investment Strategy</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                TERM IN PROGRESS: DAY 4 OF 7
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              <strong>Silver Growth Tier:</strong> 65% target growth across 7-day minimum trading duration. Direct custodial management by <strong>{COMPANY_DETAILS.accountManager.name}</strong> ({COMPANY_DETAILS.accountManager.email}).
            </div>
          </div>
        </div>

        <button
          onClick={() => setDepositModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-lg transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          Add Capital to Plan
        </button>
      </div>

      {/* Main Metric Cards Grid (Single-Elevation Depth, Tabular Numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Verified Value */}
        <div className="p-5 bg-[#0B0F19] border border-[#1F2937] rounded-lg space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>TOTAL VERIFIED VALUE</span>
            <Wallet className="w-4 h-4 text-[#FFA000]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            ${portfolio.totalVerifiedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="tabular-nums">+${portfolio.dailyChange.toLocaleString()} ({portfolio.dailyChangePercent}%)</span>
            <span className="text-slate-400 font-normal">24h</span>
          </div>
        </div>

        {/* Card 2: Invested Digital Assets */}
        <div className="p-5 bg-[#0B0F19] border border-[#1F2937] rounded-lg space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase">INVESTED ASSETS</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            ${portfolio.investedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            BTC (51.5%) · ETH (33.3%) · SOL (6.7%)
          </div>
        </div>

        {/* Card 3: Liquid Cash Buffer */}
        <div className="p-5 bg-[#0B0F19] border border-[#1F2937] rounded-lg space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase">LIQUID CASH BUFFER</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            ${portfolio.availableCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-400 font-mono">
            8.5% Capital Preservation Reserve
          </div>
        </div>

        {/* Card 4: Security Health */}
        <div className="p-5 bg-[#0B0F19] border border-[#1F2937] rounded-lg space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase">SECURITY POSTURE</div>
          <div className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400">Optimal</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Hardware 2FA Active · Whitelist Enforced
          </div>
        </div>
      </div>

      {/* Middle Grid: Assigned Account Manager & Portfolio Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Assigned Account Manager Card (Ashley Elvira) */}
        <div className="lg:col-span-5 bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 flex flex-col justify-between space-y-5">
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

            <p className="text-xs text-slate-300 leading-relaxed bg-[#080B11] p-3 rounded border border-slate-800">
              "Good morning Marcus. Your portfolio remains insulated with the 8.5% liquid cash allocation. I am monitoring the upcoming network difficulty adjustment."
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => setActivePage('account-manager')}
              className="flex-1 py-2.5 px-3 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Open Communication Desk</span>
            </button>
          </div>
        </div>

        {/* Right Col: Asset Allocations Overview */}
        <div className="lg:col-span-7 bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
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
              <div key={asset.symbol} className="p-3 bg-[#080B11] border border-slate-800 rounded space-y-1.5">
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
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
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
              {transactions.slice(0, 4).map((tx) => (
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
                        tx.status === 'COMPLETED'
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
