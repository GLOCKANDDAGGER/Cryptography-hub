import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MIN_WITHDRAWAL_AMOUNT, COMPANY_DETAILS } from '../../constants/assets';
import {
  ArrowDownToLine,
  AlertCircle,
  CheckCircle,
  Mail,
  Send,
  ShieldCheck,
  Building,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const WithdrawalModal: React.FC = () => {
  const {
    user,
    portfolio,
    activeInvestment,
    withdrawalModalOpen,
    setWithdrawalModalOpen,
    requestWithdrawal,
  } = useApp();

  const [amount, setAmount] = useState<number>(MIN_WITHDRAWAL_AMOUNT);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [assetType, setAssetType] = useState('Bitcoin (BTC Segregated Vault)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    meetsMinimum: boolean;
  } | null>(null);

  if (!withdrawalModalOpen) return null;

  // Withdrawable balance accounts for locked active investment capital
  const totalBalance = user.numericBalance ?? user.balance ?? portfolio.totalVerifiedValue ?? 0;
  const lockedCapital = activeInvestment && activeInvestment.status === 'ACTIVE' ? activeInvestment.initialCapital : 0;
  const withdrawableBalance = user.withdrawableBalance !== undefined ? user.withdrawableBalance : Math.max(0, totalBalance - lockedCapital);
  const meetsThreshold = withdrawableBalance >= MIN_WITHDRAWAL_AMOUNT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationAddress.trim()) return;

    setIsSubmitting(true);
    const result = await requestWithdrawal(amount, destinationAddress, assetType, notes);
    setIsSubmitting(false);
    setSubmissionResult(result);
  };

  const handleClose = () => {
    setWithdrawalModalOpen(false);
    setSubmissionResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0B0F19] border border-[#1E293B] rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#0D1424]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFA000]/15 border border-[#FFA000]/30 flex items-center justify-center text-[#FFA000]">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Withdrawal Authorization Request</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Custodial Payout & Dual-Signature Clearance Desk
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Balance Status Banner */}
        <div className="p-4 bg-[#080C14] border-b border-[#1E293B] grid grid-cols-2 gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-400 uppercase text-[10px]">Withdrawable Balance</span>
            <div className="text-base font-bold text-white mt-0.5 tabular-nums">
              ${withdrawableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px]">Active Locked Capital</span>
            <div className="text-base font-bold text-amber-400 mt-0.5 tabular-nums">
              ${lockedCapital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {submissionResult ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-700 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Withdrawal Request Queued</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                  {submissionResult.message}
                </p>
              </div>

              {/* Direct Authorization Contacts */}
              <div className="p-4 bg-[#0D1525] border border-slate-800 rounded-lg space-y-3 text-left text-xs font-mono">
                <div className="text-[11px] text-[#FFA000] font-bold uppercase">
                  Required Dual-Clearance Contacts
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div>
                    <div className="text-white font-bold">{COMPANY_DETAILS.name}</div>
                    <div className="text-slate-400 text-[11px]">{COMPANY_DETAILS.primaryEmail}</div>
                  </div>
                  <a
                    href={`mailto:${COMPANY_DETAILS.primaryEmail}`}
                    className="px-2.5 py-1 text-[11px] font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors"
                  >
                    Email Desk
                  </a>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-white font-bold">{COMPANY_DETAILS.accountManager.name} (Account Manager)</div>
                    <div className="text-slate-400 text-[11px]">{COMPANY_DETAILS.accountManager.email} · {COMPANY_DETAILS.accountManager.telegram}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`mailto:${COMPANY_DETAILS.accountManager.email}`}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                    >
                      Email
                    </a>
                    <a
                      href={`https://t.me/${COMPANY_DETAILS.accountManager.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-[11px] font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Telegram</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-lg transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : !meetsThreshold ? (
            /* Minimum Withdrawal Requirement Not Met (< $500) */
            <div className="space-y-4">
              <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#FFA000] shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold font-mono text-[#FFA000] uppercase tracking-wide">
                      Minimum Withdrawal Requirement
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      Your current available balance or requested amount does not meet the minimum withdrawal requirement of $500.00. Please contact Crypto Hub Investments or your Account Manager for assistance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Assistance Contacts */}
              <div className="p-4 bg-[#080C14] border border-slate-800 rounded-lg space-y-3 text-xs font-mono">
                <div className="text-[11px] text-slate-300 font-bold uppercase">
                  Contact Institutional Support & Clearance
                </div>

                <div className="p-3 bg-[#0D1525] border border-slate-800 rounded flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold">{COMPANY_DETAILS.name}</div>
                    <div className="text-slate-400 text-[11px]">{COMPANY_DETAILS.primaryEmail}</div>
                  </div>
                  <a
                    href={`mailto:${COMPANY_DETAILS.primaryEmail}`}
                    className="px-3 py-1.5 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Company</span>
                  </a>
                </div>

                <div className="p-3 bg-[#0D1525] border border-slate-800 rounded flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold">{COMPANY_DETAILS.accountManager.name}</div>
                    <div className="text-slate-400 text-[11px]">{COMPANY_DETAILS.accountManager.email}</div>
                  </div>
                  <a
                    href={`mailto:${COMPANY_DETAILS.accountManager.email}`}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Manager</span>
                  </a>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Meets Minimum Threshold (>= $500) */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mandatory Notice Required by Prompt */}
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/80 rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-slate-200 leading-relaxed font-sans">
                  <div className="font-bold text-emerald-400 font-mono">Withdrawal Request Notice</div>
                  <p>
                    Your available balance meets the minimum withdrawal requirement of $500.00. To proceed with your withdrawal request, please contact your Investment Company or Account Manager.
                  </p>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="text-slate-300 uppercase font-semibold">Withdrawal Amount (USD)</label>
                  <span className="text-slate-400">Min: ${MIN_WITHDRAWAL_AMOUNT.toFixed(2)}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">$</span>
                  <input
                    type="number"
                    min={MIN_WITHDRAWAL_AMOUNT}
                    max={withdrawableBalance}
                    step="10"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full bg-[#080C14] border border-slate-700 rounded-lg pl-8 pr-20 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#FFA000]"
                  />
                  <button
                    type="button"
                    onClick={() => setAmount(Math.floor(withdrawableBalance))}
                    className="absolute right-2 top-2 px-2 py-1 text-[10px] font-mono font-bold text-[#FFA000] bg-[#FFA000]/10 hover:bg-[#FFA000]/20 rounded"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Asset Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 uppercase font-semibold">
                  Settlement Method
                </label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="w-full bg-[#080C14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FFA000]"
                >
                  <option value="Bitcoin (BTC Segregated Vault)">Bitcoin (BTC Segregated Cold Vault)</option>
                  <option value="Ethereum (ETH Multi-Sig)">Ethereum (ETH Multi-Sig Custody)</option>
                  <option value="USD Bank Wire Transfer">USD Institutional Bank Wire (ACH/Fedwire)</option>
                  <option value="USDT (TRC20 / ERC20)">USDT Settlement Reserve</option>
                </select>
              </div>

              {/* Destination Address / Account */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 uppercase font-semibold">
                  Destination Address or Bank Wire Coordinates
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1Hn5EATL... or Bank ABA/Routing & Account #"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  required
                  className="w-full bg-[#080C14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#FFA000]"
                />
              </div>

              {/* Optional Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase">
                  Notes for Account Manager Ashley Elvira (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Specify any tax reference, execution window, or preferred clearance instruction..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#080C14] border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FFA000]"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || amount < MIN_WITHDRAWAL_AMOUNT || amount > withdrawableBalance || !destinationAddress.trim()}
                  className="px-5 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Queuing Authorization...</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>Submit Withdrawal Request (${amount.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
