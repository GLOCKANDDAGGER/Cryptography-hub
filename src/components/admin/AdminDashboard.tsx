import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Wallet,
  ShieldCheck,
  Receipt,
  Headphones,
  ArrowUpRight,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { transactions, updateTransactionStatus, tickets, setActivePage, showNotification } = useApp();

  const pendingTransactions = transactions.filter((t) => t.status === 'UNDER_REVIEW' || t.status === 'PENDING');

  const handleApprove = (id: string, ref: string) => {
    updateTransactionStatus(id, 'COMPLETED');
    showNotification(`Transaction ${ref} approved and verified.`);
  };

  const handleFlag = (id: string, ref: string) => {
    updateTransactionStatus(id, 'FAILED');
    showNotification(`Transaction ${ref} flagged and placed on compliance hold.`);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-5 bg-[#0B0F19] border border-[#1F2937] rounded-lg space-y-2">
          <div className="text-xs text-slate-400 uppercase flex items-center justify-between">
            <span>TOTAL ASSETS MONITORED</span>
            <Wallet className="w-4 h-4 text-[#FFA000]" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">$4,850,220.00</div>
          <div className="text-xs text-emerald-400">+3.8% across 142 accounts</div>
        </div>

        <div className="p-5 bg-[#0B0F19] border border-[#1F2937] rounded-lg space-y-2">
          <div className="text-xs text-slate-400 uppercase flex items-center justify-between">
            <span>ACTIVE CLIENTS</span>
            <Users className="w-4 h-4 text-[#FFA000]" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">142 Entities</div>
          <div className="text-xs text-slate-400">Assigned: Ashley Elvira (48)</div>
        </div>

        <div className="p-5 bg-[#0B0F19] border border-[#1F2937] rounded-lg space-y-2">
          <div className="text-xs text-slate-400 uppercase flex items-center justify-between">
            <span>PENDING APPROVALS</span>
            <Receipt className="w-4 h-4 text-[#FFA000]" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tabular-nums">
            {pendingTransactions.length} Requests
          </div>
          <div className="text-xs text-amber-300">Requires dual authorization</div>
        </div>

        <div className="p-5 bg-[#0B0F19] border border-[#1F2937] rounded-lg space-y-2">
          <div className="text-xs text-slate-400 uppercase flex items-center justify-between">
            <span>SUPPORT QUEUE</span>
            <Headphones className="w-4 h-4 text-[#FFA000]" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{tickets.length} Tickets</div>
          <div className="text-xs text-emerald-400">Mean reply: 28 mins</div>
        </div>
      </div>

      {/* Pending Transactions Section */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              PENDING SETTLEMENT & TRANSACTION AUTHORIZATION QUEUE
            </h2>
            <p className="text-xs text-slate-400">
              Interactive approval desk: clicking Approve or Flag directly updates the live client portfolio ledger.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 font-bold">
            {pendingTransactions.length} PENDING
          </span>
        </div>

        {pendingTransactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 font-mono">
            No transactions currently awaiting compliance authorization.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Reference ID</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Amount (USD)</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {pendingTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#111827]/50 transition-colors">
                    <td className="py-3 px-3 text-slate-400">{tx.date}</td>
                    <td className="py-3 px-3 text-[#FFA000] font-bold">{tx.referenceId}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white">{tx.description}</td>
                    <td className="py-3 px-3 text-right text-white font-bold tabular-nums">
                      ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(tx.id, tx.referenceId)}
                          className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded flex items-center gap-1 transition-colors cursor-pointer"
                          title="Authorize Transaction"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleFlag(tx.id, tx.referenceId)}
                          className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-300 rounded flex items-center gap-1 transition-colors cursor-pointer"
                          title="Reject / Compliance Flag"
                        >
                          <X className="w-3 h-3" />
                          <span>Flag</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Nav Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActivePage('admin-clients')}
          className="p-5 bg-[#0B0F19] hover:bg-[#111827] border border-[#1F2937] rounded-lg text-left transition-colors space-y-2 cursor-pointer"
        >
          <div className="text-xs font-mono text-[#FFA000] uppercase font-bold">CLIENT DIRECTORY</div>
          <div className="text-white font-bold text-sm">Review Client Accounts & Allocations</div>
          <p className="text-xs text-slate-400">Inspect individual client KYC tiers and assigned managers.</p>
        </button>

        <button
          onClick={() => setActivePage('admin-support')}
          className="p-5 bg-[#0B0F19] hover:bg-[#111827] border border-[#1F2937] rounded-lg text-left transition-colors space-y-2 cursor-pointer"
        >
          <div className="text-xs font-mono text-[#FFA000] uppercase font-bold">SUPPORT QUEUE</div>
          <div className="text-white font-bold text-sm">Manage Active Tickets & Consultations</div>
          <p className="text-xs text-slate-400">Respond to client inquiries and resolve escalations.</p>
        </button>

        <button
          onClick={() => setActivePage('admin-audit-logs')}
          className="p-5 bg-[#0B0F19] hover:bg-[#111827] border border-[#1F2937] rounded-lg text-left transition-colors space-y-2 cursor-pointer"
        >
          <div className="text-xs font-mono text-[#FFA000] uppercase font-bold">AUDIT STREAM</div>
          <div className="text-white font-bold text-sm">Live System & Compliance Telemetry</div>
          <p className="text-xs text-slate-400">Immutable ledger events from Massachusetts operations.</p>
        </button>
      </div>
    </div>
  );
};
