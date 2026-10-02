import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Headphones,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  X,
  Search,
} from 'lucide-react';
import { SupportTicket } from '../../types';
import { COMPANY_DETAILS } from '../../constants/assets';

export const SupportView: React.FC = () => {
  const { tickets, createTicket, replyToTicket } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('PORTFOLIO');
  const [initialMsg, setInitialMsg] = useState('');
  const [priority, setPriority] = useState<SupportTicket['priority']>('NORMAL');

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    replyToTicket(activeTicket.id, replyText.trim());
    setReplyText('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMsg.trim()) return;
    createTicket(subject.trim(), category, initialMsg.trim(), priority);
    setCreateModalOpen(false);
    setSubject('');
    setInitialMsg('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-lg p-5">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            CLIENT SUPPORT CENTER & INCIDENT MANAGEMENT
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Support Desk & Service Inquiries
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Reachable directly via customer care desk ({COMPANY_DETAILS.customerCareEmail}) or dedicated account management.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Open New Support Ticket</span>
        </button>
      </div>

      {/* Ticket Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets Queue */}
        <div className="lg:col-span-5 bg-[#0B0F19] border border-[#1F2937] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
            <span className="text-white font-bold uppercase">Active Tickets ({tickets.length})</span>
            <span className="text-slate-400">Response standard: &lt;2h</span>
          </div>

          <div className="space-y-2">
            {tickets.map((t) => {
              const isSelected = activeTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3.5 rounded-lg border transition-colors cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-[#111827] border-[#FFA000]'
                      : 'bg-[#080B11] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#FFA000] font-bold">#{t.id}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'OPEN'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                          : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-1">{t.subject}</h3>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span>Category: {t.category}</span>
                    <span>{t.updatedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Thread */}
        <div className="lg:col-span-7 bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-5">
          {activeTicket ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-[#FFA000] font-bold">TICKET #{activeTicket.id}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">Category: {activeTicket.category}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">{activeTicket.subject}</h2>
                </div>
                <div className="text-right text-xs font-mono">
                  <span className="text-slate-400">Status: </span>
                  <span className="font-bold text-white">{activeTicket.status}</span>
                </div>
              </div>

              {/* Messages stream */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {activeTicket.messages.map((m) => {
                  const isStaff = m.senderRole !== 'CLIENT';
                  return (
                    <div
                      key={m.id}
                      className={`p-4 rounded-lg space-y-1.5 text-xs ${
                        isStaff
                          ? 'bg-[#111827] border border-slate-700 ml-4'
                          : 'bg-[#080B11] border border-slate-800 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1 border-b border-slate-800/60">
                        <span className="font-bold text-white">
                          {m.senderName} {isStaff && <span className="text-[#FFA000]">({m.senderRole})</span>}
                        </span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed pt-1">{m.text}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleReply} className="pt-2 flex gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply to the support desk..."
                  className="flex-1 bg-[#080B11] border border-slate-800 rounded-md px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#FFA000]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs font-mono">
              Select a ticket to view conversation details.
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0B0F19] border border-[#2B3547] rounded-xl max-w-md w-full p-6 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-mono text-[#FFA000] uppercase font-bold">
                INCIDENT & SUPPORT CREATION
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Open Support Ticket</h3>
              <p className="text-xs text-slate-400">
                Routed directly to Customer Care ({COMPANY_DETAILS.customerCareEmail}) and Ashley Elvira.
              </p>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#080B11] border border-slate-800 text-white p-2.5 rounded focus:outline-hidden"
                >
                  <option value="PORTFOLIO">Portfolio & Rebalance</option>
                  <option value="SECURITY">Security & Token Verification</option>
                  <option value="ACCOUNT">Account Management</option>
                  <option value="COMPLIANCE">Compliance & KYC</option>
                  <option value="TECHNICAL">Technical Platform Inquiries</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Subject Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule allocation rebalance consultation"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#080B11] border border-slate-800 text-white p-2.5 rounded focus:outline-hidden font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Message Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide comprehensive details regarding your request..."
                  value={initialMsg}
                  onChange={(e) => setInitialMsg(e.target.value)}
                  className="w-full bg-[#080B11] border border-slate-800 text-white p-2.5 rounded focus:outline-hidden font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
