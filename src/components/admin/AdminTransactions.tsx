import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, Search, ShieldCheck, Image as ImageIcon, Eye, ExternalLink, FileCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { TransactionStatus, TransactionRecord } from '../../types';

export const AdminTransactions: React.FC = () => {
  const { transactions, updateTransactionStatus, showNotification, updateClientBalance, registeredUsers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingProofTx, setViewingProofTx] = useState<TransactionRecord | null>(null);

  const filtered = transactions.filter(
    (t) =>
      t.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.clientEmail && t.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.txHash && t.txHash.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSetStatus = (tx: TransactionRecord, status: TransactionStatus) => {
    updateTransactionStatus(tx.id, status);

    // If approving a deposit, credit the client's verified balance
    if (status === 'COMPLETED' && tx.type === 'DEPOSIT') {
      const match = registeredUsers.find(
        (u) =>
          (tx.clientEmail && u.email.toLowerCase() === tx.clientEmail.toLowerCase()) ||
          (tx.clientName && u.name.toLowerCase() === tx.clientName.toLowerCase())
      );
      if (match) {
        const cur = Number(match.numericBalance) || 0;
        const updated = cur + Number(tx.amount || 0);
        updateClientBalance(match.id, updated);
      }
    }

    showNotification(`Transaction ${tx.referenceId} marked as ${status}.`);
    if (viewingProofTx && viewingProofTx.id === tx.id) {
      setViewingProofTx((prev) => (prev ? { ...prev, status } : null));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-xl p-5 shadow-sm">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>TRANSACTION CLEARING & DEPOSIT OVERSIGHT DESK</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Custodial Transactions & Deposit Proof Clearance
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Review incoming Bitcoin deposits, verify uploaded transfer screenshots, and authorize client account ledger credits.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-xl p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Reference ID, client, description, txHash or status..."
          className="w-full bg-transparent text-xs font-mono text-white focus:outline-hidden placeholder:text-slate-500"
        />
      </div>

      {/* Table / Card List */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-xl p-4 sm:p-6 space-y-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 font-mono">
            No transactions found matching criteria.
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filtered.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-[#080B11] border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[#FFA000] font-bold">#{t.referenceId}</span>
                      <div className="text-slate-400 text-[10px] mt-0.5">{t.date}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50'
                          : t.status === 'UNDER_REVIEW'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800/50'
                          : 'bg-rose-950/80 text-rose-400 border-rose-800/50'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="text-white font-sans text-xs">{t.description}</div>

                  <div className="flex justify-between items-center py-2 border-y border-slate-800">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                    </span>
                  </div>

                  {t.depositProofImage && (
                    <div className="flex items-center justify-between p-2 bg-[#0F1626] rounded-lg border border-amber-900/40">
                      <span className="text-[11px] text-amber-300 flex items-center gap-1.5 font-bold">
                        <FileCheck className="w-3.5 h-3.5 text-[#FFA000]" />
                        <span>Deposit Proof Screenshot Attached</span>
                      </span>
                      <button
                        onClick={() => setViewingProofTx(t)}
                        className="px-2 py-1 bg-[#FFA000] text-black rounded font-bold text-[10px] hover:bg-[#FFB300] cursor-pointer"
                      >
                        View Proof
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {t.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleSetStatus(t, 'COMPLETED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Deposit</span>
                      </button>
                    )}
                    {t.status !== 'FAILED' && (
                      <button
                        onClick={() => handleSetStatus(t, 'FAILED')}
                        className="px-2.5 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-xs cursor-pointer"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Description & Client</th>
                    <th className="py-2.5 px-3">Proof Attached</th>
                    <th className="py-2.5 px-3 text-right">Amount (USD)</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
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
                      <td className="py-3 px-3 text-white max-w-xs">
                        <div className="font-sans text-xs">{t.description}</div>
                        {t.clientEmail && <div className="text-[10px] text-slate-400">{t.clientEmail}</div>}
                      </td>
                      <td className="py-3 px-3">
                        {t.depositProofImage ? (
                          <button
                            onClick={() => setViewingProofTx(t)}
                            className="px-2 py-1 bg-amber-950/80 hover:bg-amber-900 border border-amber-600/60 text-amber-300 rounded font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <ImageIcon className="w-3 h-3 text-[#FFA000]" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500">None</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-white tabular-nums">
                        ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            t.status === 'COMPLETED'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                              : t.status === 'UNDER_REVIEW'
                              ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                              : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {t.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleSetStatus(t, 'COMPLETED')}
                              className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {t.status !== 'UNDER_REVIEW' && (
                            <button
                              onClick={() => handleSetStatus(t, 'UNDER_REVIEW')}
                              className="px-2 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-300 rounded text-[11px] transition-colors cursor-pointer"
                            >
                              Hold
                            </button>
                          )}
                          {t.status !== 'FAILED' && (
                            <button
                              onClick={() => handleSetStatus(t, 'FAILED')}
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
          </>
        )}
      </div>

      {/* PROOF SCREENSHOT INSPECTION MODAL */}
      {viewingProofTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#0B0F19] border border-[#2B3547] rounded-2xl max-w-xl w-full p-6 space-y-5 relative shadow-2xl my-8">
            <button
              onClick={() => setViewingProofTx(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-mono text-[#FFA000] uppercase font-bold flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                <span>DEPOSIT PROOF SCREENSHOT VERIFICATION</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Transaction #{viewingProofTx.referenceId}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Submitted: {viewingProofTx.date} · Value: ${viewingProofTx.amount.toLocaleString()} USD
              </p>
            </div>

            {/* Proof Image Display */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300">Client Uploaded Screenshot:</span>
              {viewingProofTx.depositProofImage ? (
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center max-h-96">
                  <img
                    src={viewingProofTx.depositProofImage}
                    alt="Proof of Deposit Screenshot"
                    className="max-h-96 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="p-8 text-center text-xs font-mono text-slate-400 bg-slate-900 rounded-xl">
                  No image attached with this transaction.
                </div>
              )}
            </div>

            {/* Transaction Data */}
            <div className="p-4 bg-[#080B11] border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Plan:</span>
                <span className="text-white font-bold">{viewingProofTx.planName || viewingProofTx.description}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Deposit Amount:</span>
                <span className="text-emerald-400 font-bold">${viewingProofTx.amount.toLocaleString()} USD</span>
              </div>
              {viewingProofTx.btcAmount && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Bitcoin Equivalent:</span>
                  <span className="text-amber-400 font-bold">{viewingProofTx.btcAmount} BTC</span>
                </div>
              )}
              {viewingProofTx.txHash && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Transaction Hash (TxID):</span>
                  <span className="text-white select-all break-all">{viewingProofTx.txHash}</span>
                </div>
              )}
              {viewingProofTx.clientEmail && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Client Account:</span>
                  <span className="text-white">{viewingProofTx.clientName || 'Client'} ({viewingProofTx.clientEmail})</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Clearance Status:</span>
                <span className={`font-bold ${viewingProofTx.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {viewingProofTx.status}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setViewingProofTx(null)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {viewingProofTx.status !== 'COMPLETED' && (
                  <button
                    type="button"
                    onClick={() => handleSetStatus(viewingProofTx, 'COMPLETED')}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Credit Balance</span>
                  </button>
                )}
                {viewingProofTx.status !== 'FAILED' && (
                  <button
                    type="button"
                    onClick={() => handleSetStatus(viewingProofTx, 'FAILED')}
                    className="py-2.5 px-4 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Flag / Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
