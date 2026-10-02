import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  UserCheck,
  ShieldCheck,
  Mail,
  ArrowRight,
  Eye,
  X,
  Check,
  Clock,
  UserX,
  Wallet,
  DollarSign,
  Key,
  RefreshCw,
  Lock,
  Sparkles,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../constants/assets';
import { RegisteredUser } from '../../types';

export const AdminClients: React.FC = () => {
  const { registeredUsers, approveUser, rejectUser, updateClientBalance, resetClientPassword } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<RegisteredUser | null>(null);

  // Balance Management State
  const [balanceModalClient, setBalanceModalClient] = useState<RegisteredUser | null>(null);
  const [balanceInput, setBalanceInput] = useState<string>('');

  // Credential Modal State
  const [credentialModalClient, setCredentialModalClient] = useState<RegisteredUser | null>(null);
  const [temporaryToken, setTemporaryToken] = useState<string | null>(null);

  const pendingUsers = registeredUsers.filter((u) => u.approvalStatus === 'PENDING_APPROVAL');
  const approvedUsers = registeredUsers.filter((u) => u.approvalStatus === 'APPROVED');

  const filteredApproved = approvedUsers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenBalanceModal = (client: RegisteredUser) => {
    setBalanceModalClient(client);
    const currentNum = client.numericBalance ?? parseFloat((client.portfolioValue || '0').replace(/[^0-9.]/g, '')) ?? 0;
    setBalanceInput(currentNum.toString());
  };

  const handleSaveBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanceModalClient) return;
    const val = parseFloat(balanceInput);
    if (isNaN(val) || val < 0) return;
    updateClientBalance(balanceModalClient.id, val);
    setBalanceModalClient(null);
  };

  const handleOpenCredentials = (client: RegisteredUser) => {
    setCredentialModalClient(client);
    setTemporaryToken(null);
  };

  const handleGenerateTemporaryToken = (clientId: string) => {
    const token = resetClientPassword(clientId);
    setTemporaryToken(token);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-xl p-5 shadow-sm">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>ADMINISTRATIVE CLIENT & ASSET MANAGEMENT DESK</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Client Directory, Balances & Credentials
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Manage investor portfolios, configure verified custodial balances, and review security credentials.
          </p>
        </div>
      </div>

      {/* 1. Pending Approvals Queue */}
      <div className="bg-[#0B0F19] border border-amber-800/60 rounded-xl p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FFA000]" />
              <span>PENDING CLIENT REGISTRATION APPLICATIONS ({pendingUsers.length})</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Sign-ups requiring administrator review before access credentials are valid.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-950/60 text-amber-300 border border-amber-800/40 rounded-lg">
            {pendingUsers.length} Awaiting Decision
          </span>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="py-6 text-center text-xs font-mono text-slate-400">
            No pending registration applications in the approval queue.
          </div>
        ) : (
          <>
            {/* Mobile Card View (Android / iOS) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {pendingUsers.map((u) => (
                <div key={u.id} className="p-4 rounded-xl bg-[#080B11] border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-sm">{u.name}</div>
                      <div className="text-xs text-[#FFA000] font-mono">{u.email}</div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-950/80 text-amber-300 rounded border border-amber-800/50">
                      PENDING
                    </span>
                  </div>

                  <div className="text-xs font-mono text-slate-400 space-y-1 pt-1 border-t border-slate-800/60">
                    <div className="flex justify-between">
                      <span>Account #:</span>
                      <span className="text-slate-200">{u.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Submitted:</span>
                      <span className="text-slate-300">{u.registeredDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span className="text-slate-300">{u.phone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => approveUser(u.id)}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => rejectUser(u.id)}
                      className="py-2.5 px-3 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UserX className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Applicant Name</th>
                    <th className="py-2.5 px-3">Email Address</th>
                    <th className="py-2.5 px-3">Assigned Account #</th>
                    <th className="py-2.5 px-3">Submitted Date</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3 text-right">Administrator Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {pendingUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#111827]/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{u.name}</td>
                      <td className="py-3 px-3 text-[#FFA000]">{u.email}</td>
                      <td className="py-3 px-3 text-slate-300">{u.accountNumber}</td>
                      <td className="py-3 px-3 text-slate-400">{u.registeredDate}</td>
                      <td className="py-3 px-3 text-slate-400">{u.phone || 'N/A'}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approveUser(u.id)}
                            className="px-3 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Account</span>
                          </button>
                          <button
                            onClick={() => rejectUser(u.id)}
                            className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
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

      {/* 2. Active Approved Clients Section with Balance & Credential Controls */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-xl p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>ACTIVE CLIENT ACCOUNTS & BALANCE MANAGEMENT ({approvedUsers.length})</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Click <strong>Manage Balance</strong> to modify verified funds or <strong>Credentials</strong> to review security tokens.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#080B11] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or account..."
              className="bg-transparent text-white focus:outline-hidden w-full placeholder:text-slate-500 text-xs"
            />
          </div>
        </div>

        {/* Mobile Card View for Android / iPhone */}
        <div className="grid grid-cols-1 gap-3.5 md:hidden">
          {filteredApproved.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-[#080B11] border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-white text-sm">{c.name}</div>
                  <div className="text-xs text-slate-400 font-mono">{c.email}</div>
                  <div className="text-[10px] text-[#FFA000] font-mono mt-0.5 font-bold">
                    #{c.accountNumber}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Balance</div>
                  <div className="text-sm font-mono font-bold text-emerald-400 tabular-nums">
                    {c.portfolioValue || '$148,250.00'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                <button
                  onClick={() => handleOpenBalanceModal(c)}
                  className="py-2 px-2 bg-[#FFA000] hover:bg-[#FFB300] text-black font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer text-center text-[11px]"
                >
                  <DollarSign className="w-3.5 h-3.5 shrink-0" />
                  <span>Balance</span>
                </button>

                <button
                  onClick={() => handleOpenCredentials(c)}
                  className="py-2 px-2 bg-[#111827] hover:bg-[#1E293B] border border-slate-700 text-slate-200 font-medium rounded-lg flex items-center justify-center gap-1 cursor-pointer text-center text-[11px]"
                >
                  <Key className="w-3.5 h-3.5 text-[#FFA000] shrink-0" />
                  <span>Access</span>
                </button>

                <button
                  onClick={() => setSelectedClient(c)}
                  className="py-2 px-2 bg-[#0F1420] hover:bg-[#1A2338] border border-slate-800 text-slate-300 rounded-lg flex items-center justify-center gap-1 cursor-pointer text-center text-[11px]"
                >
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  <span>Dossier</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Client Entity</th>
                <th className="py-2.5 px-3">Account Number</th>
                <th className="py-2.5 px-3">Manager</th>
                <th className="py-2.5 px-3">Jurisdiction</th>
                <th className="py-2.5 px-3 text-right">Portfolio Balance</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredApproved.map((c) => (
                <tr key={c.id} className="hover:bg-[#111827]/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-400">{c.email}</div>
                  </td>
                  <td className="py-3 px-3 text-[#FFA000] font-bold">{c.accountNumber}</td>
                  <td className="py-3 px-3 text-white">Ashley Elvira</td>
                  <td className="py-3 px-3 text-slate-400">{c.jurisdiction || 'Massachusetts, US'}</td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold tabular-nums text-sm">
                    {c.portfolioValue || '$148,250.00'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenBalanceModal(c)}
                        className="px-2.5 py-1.5 bg-[#FFA000] hover:bg-[#FFB300] text-black font-bold rounded text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                        title="Manage and update client balance"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Manage Balance</span>
                      </button>

                      <button
                        onClick={() => handleOpenCredentials(c)}
                        className="px-2.5 py-1.5 bg-[#111827] hover:bg-[#1E293B] border border-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="View credentials & temporary tokens"
                      >
                        <Key className="w-3.5 h-3.5 text-[#FFA000]" />
                        <span>Credentials</span>
                      </button>

                      <button
                        onClick={() => setSelectedClient(c)}
                        className="px-2 py-1.5 bg-[#0F1420] hover:bg-[#1A2338] border border-slate-800 text-slate-300 rounded text-xs transition-colors cursor-pointer"
                        title="Open dossier"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Manage Balance Modal */}
      {balanceModalClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-[#0B0F19] border border-[#2B3547] rounded-2xl max-w-md w-full p-6 space-y-5 relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setBalanceModalClient(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-mono text-[#FFA000] uppercase font-bold flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                <span>ADMINISTRATIVE BALANCE MANAGEMENT</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Adjust Client Portfolio Balance
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {balanceModalClient.name} · Account #{balanceModalClient.accountNumber}
              </p>
            </div>

            <div className="p-3.5 bg-[#080B11] border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Current Ledger Balance:</span>
              <span className="text-emerald-400 font-bold text-base tabular-nums">
                {balanceModalClient.portfolioValue || '$0.00'}
              </span>
            </div>

            <form onSubmit={handleSaveBalance} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold flex justify-between">
                  <span>Enter New Verified Balance (USD)</span>
                  <span className="text-slate-400 font-normal">Direct Settled Value</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-base">$</span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={balanceInput}
                    onChange={(e) => setBalanceInput(e.target.value)}
                    className="w-full bg-[#080B11] border border-slate-800 text-white pl-8 pr-4 py-2.5 rounded-xl text-base font-bold font-mono focus:outline-hidden focus:border-[#FFA000]"
                  />
                </div>
              </div>

              {/* Quick Increment Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Quick Presets:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[1000, 5000, 25000, 100000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        const cur = parseFloat(balanceInput) || 0;
                        setBalanceInput((cur + preset).toString());
                      }}
                      className="py-1.5 px-2 bg-[#111827] hover:bg-[#1E293B] border border-slate-800 text-slate-300 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer text-center"
                    >
                      +${(preset / 1000)}k
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBalanceModalClient(null)}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#FFA000] hover:bg-[#FFB300] text-black text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Balance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Client Credentials & Security Token Modal */}
      {credentialModalClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-[#0B0F19] border border-[#2B3547] rounded-2xl max-w-lg w-full p-6 space-y-5 relative shadow-2xl animate-fade-in">
            <button
              onClick={() => {
                setCredentialModalClient(null);
                setTemporaryToken(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-mono text-[#FFA000] uppercase font-bold flex items-center gap-1.5">
                <Key className="w-4 h-4" />
                <span>CLIENT CREDENTIALS & SECURITY AUTH DESK</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {credentialModalClient.name} Credentials
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Account #{credentialModalClient.accountNumber}
              </p>
            </div>

            <div className="p-4 bg-[#080B11] border border-slate-800 rounded-xl space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Login Username / Email:</span>
                <span className="text-white font-bold">{credentialModalClient.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Account Authorization ID:</span>
                <span className="text-[#FFA000] font-bold">{credentialModalClient.accountNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Credential Architecture:</span>
                <span className="text-emerald-400">Argon2id Hash + PBKDF2 Salted</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Telephone / 2FA Contact:</span>
                <span className="text-slate-200">{credentialModalClient.phone || 'Verified on file'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Approval State:</span>
                <span className="text-emerald-400 font-bold">{credentialModalClient.approvalStatus}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Assigned Account Manager:</span>
                <span className="text-slate-200">Ashley Elvira ({COMPANY_DETAILS.accountManager.email})</span>
              </div>
            </div>

            {/* Temporary Token Generation for Client Access */}
            <div className="p-4 bg-[#0F1626] border border-amber-900/50 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FFA000]" />
                  <span>Temporary Access Token / Password Reset</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleGenerateTemporaryToken(credentialModalClient.id)}
                  className="px-2.5 py-1 bg-[#FFA000] hover:bg-[#FFB300] text-black font-bold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate Token</span>
                </button>
              </div>

              {temporaryToken ? (
                <div className="p-3 bg-[#080B11] border border-emerald-800/80 rounded-lg text-xs font-mono space-y-1">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">Active Temporary Password:</div>
                  <div className="text-white font-bold text-sm tracking-wider select-all">{temporaryToken}</div>
                  <div className="text-[10px] text-slate-400 font-sans">
                    Provide this temporary credential to {credentialModalClient.name} for immediate access.
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 leading-normal">
                  In compliance with cybersecurity standards, raw user passwords are encrypted at rest. If the client cannot sign in, click &quot;Generate Token&quot; to assign a secure temporary access key.
                </p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  setCredentialModalClient(null);
                  setTemporaryToken(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Comprehensive Dossier Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-[#0B0F19] border border-[#2B3547] rounded-2xl max-w-lg w-full p-6 space-y-5 relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-mono text-[#FFA000] uppercase font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>CLIENT DOSSIER & COMPLIANCE RECORD</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{selectedClient.name}</h2>
              <div className="text-xs font-mono text-slate-400">
                Account #{selectedClient.accountNumber} · Onboarded: {selectedClient.registeredDate}
              </div>
            </div>

            <div className="p-4 bg-[#080B11] border border-slate-800 rounded-xl space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Assigned Account Manager</span>
                <span className="text-white font-bold">Ashley Elvira ({COMPANY_DETAILS.accountManager.email})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Verified Portfolio Balance</span>
                <span className="text-emerald-400 font-bold text-sm tabular-nums">
                  {selectedClient.portfolioValue || '$148,250.00'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Login Username / Email</span>
                <span className="text-white">{selectedClient.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Telephone Verification</span>
                <span className="text-white">{selectedClient.phone || 'Verified on file'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Jurisdiction</span>
                <span className="text-slate-200">{selectedClient.jurisdiction || 'Massachusetts, United States'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Approval State</span>
                <span className="text-emerald-400 font-bold">{selectedClient.approvalStatus}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  const target = selectedClient;
                  setSelectedClient(null);
                  handleOpenBalanceModal(target);
                }}
                className="py-2 px-3 bg-[#FFA000] hover:bg-[#FFB300] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Adjust Balance</span>
              </button>

              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
