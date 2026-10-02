import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PieChart,
  Sliders,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { RiskBanner } from '../common/RiskBanner';

export const PortfolioView: React.FC = () => {
  const { portfolio, rebalancePortfolio, showNotification } = useApp();
  const [rebalanceMode, setRebalanceMode] = useState(false);
  const [targets, setTargets] = useState({
    BTC: 51.5,
    ETH: 33.3,
    SOL: 6.7,
    USD: 8.5,
  });

  const totalTarget = Math.round((targets.BTC + targets.ETH + targets.SOL + targets.USD) * 10) / 10;

  const handleApplyRebalance = () => {
    if (Math.abs(totalTarget - 100) > 0.5) {
      showNotification('Total allocation targets must sum to 100%.');
      return;
    }
    rebalancePortfolio([
      { symbol: 'BTC', percent: targets.BTC },
      { symbol: 'ETH', percent: targets.ETH },
      { symbol: 'SOL', percent: targets.SOL },
      { symbol: 'USD', percent: targets.USD },
    ]);
    setRebalanceMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-lg p-5">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            PORTFOLIO LEDGER & ASSET ALLOCATION
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            {portfolio.portfolioName}
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
            <span>Mandate: {portfolio.riskProfile}</span>
            <span>·</span>
            <span>Last Rebalanced: {portfolio.lastRebalancedDate}</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">Cold Storage Custody</span>
          </div>
        </div>

        <button
          onClick={() => setRebalanceMode(!rebalanceMode)}
          className="px-4 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{rebalanceMode ? 'Cancel Simulator' : 'Adjust Allocation Model'}</span>
        </button>
      </div>

      {/* Mandatory Risk Banner */}
      <RiskBanner compact />

      {/* Rebalance Simulator Panel */}
      {rebalanceMode && (
        <div className="p-6 bg-[#0E1424] border border-[#FFA000]/60 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#FFA000]" />
                <span>Simulated Target Allocation Simulator</span>
              </h3>
              <p className="text-xs text-slate-400">
                Adjust desired asset weights. Changes will be transmitted to Account Manager Ashley Elvira for execution review.
              </p>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="text-slate-400">Sum: </span>
              <span className={`font-bold tabular-nums ${totalTarget === 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalTarget}% / 100%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {Object.entries(targets).map(([sym, val]) => (
              <div key={sym} className="p-3 bg-[#080B11] border border-slate-800 rounded space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-white">{sym}</span>
                  <span className="text-[#FFA000]">{val}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={val}
                  onChange={(e) => setTargets({ ...targets, [sym]: parseFloat(e.target.value) })}
                  className="w-full accent-[#FFA000] cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setRebalanceMode(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyRebalance}
              className="px-5 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors"
            >
              Queue Execution With Ashley Elvira
            </button>
          </div>
        </div>
      )}

      {/* Asset Holdings Table */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            VERIFIED ASSET HOLDINGS & PERFORMANCE BREAKDOWN
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Total Valuation: ${portfolio.totalVerifiedValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">Allocation</th>
                <th className="py-2.5 px-3">Verified Units</th>
                <th className="py-2.5 px-3 text-right">Current Price</th>
                <th className="py-2.5 px-3 text-right">Total Value (USD)</th>
                <th className="py-2.5 px-3 text-right">Cost Basis</th>
                <th className="py-2.5 px-3 text-right">Unrealized P&L</th>
                <th className="py-2.5 px-3 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {portfolio.assets.map((asset) => (
                <tr key={asset.symbol} className="hover:bg-[#111827]/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{asset.name}</div>
                    <div className="text-[10px] text-slate-400">{asset.symbol}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#FFA000] tabular-nums">{asset.allocationPercent}%</div>
                  </td>
                  <td className="py-3 px-3 text-white tabular-nums">
                    {asset.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {asset.symbol}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-200 tabular-nums">
                    ${asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-white tabular-nums">
                    ${asset.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                    ${asset.costBasis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    <span className={asset.unrealizedPnL >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                      {asset.unrealizedPnL >= 0 ? `+$${asset.unrealizedPnL.toLocaleString()}` : `-$${Math.abs(asset.unrealizedPnL).toLocaleString()}`} ({asset.unrealizedPnLPercent}%)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {asset.riskRating}
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
