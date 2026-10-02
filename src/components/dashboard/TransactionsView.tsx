import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  FileCheck,
  X,
} from 'lucide-react';
import { TransactionType, TransactionStatus } from '../../types';

export const TransactionsView: React.FC = () => {
  const { transactions, addTransaction, showNotification, setDepositModalOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  // New transaction modal state
  const [formType, setFormType] = useState<TransactionType>('DEPOSIT');
  const [formAmount, setFormAmount] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destinationOrSource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(formAmount);
    if (!amt || amt <= 0) return;

    addTransaction({
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
      type: formType,
      description: formDesc || `${formType} Request`,
      amount: amt,
      currency: 'USD',
      status: 'UNDER_REVIEW',
      fee: formType === 'WITHDRAWAL' ? 25.0 : 0,
      destinationOrSource: formType === 'WITHDRAWAL' ? 'Client Bank Settlement' : 'Wire Inbound Settlement',
    });

    setModalOpen(false);
    setFormAmount('');
    setFormDesc('');
  };

  const exportCSV = () => {
    const header = 'Date,Reference ID,Type,Description,Amount,Currency,Status,Source/Dest\n';
    const rows = filteredTransactions
      .map(
        (t) =>
          `"${t.date}","${t.referenceId}","${t.type}","${t.description.replace(/"/g, '""')}",${t.amount},"${t.currency}","${t.status}","${t.destinationOrSource}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CryptoHub_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showNotification('Transactions export CSV generated.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-lg p-5">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            VERIFIED TRANSACTION REPOSITORY
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Transaction History & Settlement Log
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Every ledger entry corresponds to verified custodial operations and banking records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-[#111827] border border-slate-700 rounded transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#FFA000]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setDepositModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Strategy Deposit ($250+)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 bg-[#080B11] border border-slate-800 rounded px-3 py-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Reference ID, description, or destination..."
            className="bg-transparent text-white focus:outline-hidden w-full placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#080B11] border border-slate-800 text-white rounded px-2.5 py-1.5 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#080B11] border border-slate-800 text-white rounded px-2.5 py-1.5 focus:outline-hidden"
            >
              <option value="ALL">All Types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="ALLOCATION">Allocation</option>
              <option value="REBALANCE">Rebalance</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="FEE">Fee</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Reference ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Counterparty / Vault</th>
                <th className="py-2.5 px-3 text-right">Fee</th>
                <th className="py-2.5 px-3 text-right">Amount (USD)</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No transactions matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#111827]/50 transition-colors">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 px-3 text-[#FFA000] font-bold whitespace-nowrap">{tx.referenceId}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white max-w-xs">{tx.description}</td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate">{tx.destinationOrSource}</td>
                    <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                      ${tx.fee.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white tabular-nums">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transaction Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0B0F19] border border-[#2B3547] rounded-xl max-w-md w-full p-6 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-mono text-[#FFA000] uppercase font-bold">
                CUSTODIAL ORDER DESK
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                Initiate Transaction Request
              </h3>
              <p className="text-xs text-slate-400">
                All requests are subject to dual-custody review by your Account Manager Ashley Elvira.
              </p>
            </div>

            <form onSubmit={handleCreateTx} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300">Transaction Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as TransactionType)}
                  className="w-full bg-[#080B11] border border-slate-800 text-white p-2.5 rounded focus:outline-hidden"
                >
                  <option value="DEPOSIT">Inbound Wire Deposit (USD)</option>
                  <option value="ALLOCATION">Spot Digital Asset Allocation</option>
                  <option value="WITHDRAWAL">Outbound Settlement Withdrawal (USD)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Amount (USD)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 10000"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full bg-[#080B11] border border-slate-800 text-white p-2.5 rounded focus:outline-hidden text-sm font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Operational Note / Settlement Instructions</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wire routing to primary institutional checking"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-[#080B11] border border-slate-800 text-white p-2.5 rounded focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded text-[11px] text-amber-200">
                <strong>Settlement Security Notice:</strong> Withdrawals undergo mandatory address verification and verbal confirmation with your dedicated account manager prior to broadcast.
              </div>

              <button
                type="submit"
                className="w-full py-3 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors"
              >
                Submit To Compliance Desk
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
