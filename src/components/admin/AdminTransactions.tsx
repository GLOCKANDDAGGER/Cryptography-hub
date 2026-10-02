import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, Search, ShieldCheck } from 'lucide-react';
import { TransactionStatus } from '../../types';

export const AdminTransactions: React.FC = () => {
  const { transactions, updateTransactionStatus, showNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(
    (t) =>
      t.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSetStatus = (id: string, ref: string, status: TransactionStatus) => {
    updateTransactionStatus(id, status);
    showNotification(`Transaction ${ref} marked as ${status}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-lg p-5">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            TRANSACTION CLEARING & OVERSIGHT DESK
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Custodial Transaction Approvals
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Authorize or hold transactions submitted by clients or automated algorithmic allocations.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Reference ID, description, or status..."
          className="w-full bg-transparent text-xs font-mono text-white focus:outline-hidden placeholder:text-slate-500"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Reference ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Amount (USD)</th>
                <th className="py-2.5 px-3 text-right">Current Status</th>
                <th className="py-2.5 px-3 text-right">Oversight Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-[#111827]/50 transition-colors">
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{t.date}</td>
                  <td className="py-3 px-3 text-[#FFA000] font-bold whitespace-nowrap">{t.referenceId}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white max-w-xs">{t.description}</td>
                  <td className="py-3 px-3 text-right font-bold text-white tabular-nums">
                    ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : t.status === 'UNDER_REVIEW'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {t.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleSetStatus(t.id, t.referenceId, 'COMPLETED')}
                          className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded text-[11px] transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {t.status !== 'UNDER_REVIEW' && (
                        <button
                          onClick={() => handleSetStatus(t.id, t.referenceId, 'UNDER_REVIEW')}
                          className="px-2 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-300 rounded text-[11px] transition-colors cursor-pointer"
                        >
                          Hold
                        </button>
                      )}
                      {t.status !== 'FAILED' && (
                        <button
                          onClick={() => handleSetStatus(t.id, t.referenceId, 'FAILED')}
                          className="px-2 py-1 bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-300 rounded text-[11px] transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                    </div>
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
