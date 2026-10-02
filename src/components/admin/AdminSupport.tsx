import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, CheckCircle2, Clock } from 'lucide-react';

export const AdminSupport: React.FC = () => {
  const { tickets, replyToTicket, showNotification } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  const active = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !active) return;
    replyToTicket(active.id, replyText.trim());
    setReplyText('');
    showNotification('Official administrative response dispatched to client.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A0E17] border border-[#1E293B] rounded-lg p-5">
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-semibold">
            CENTRAL SUPPORT & INCIDENT DISPATCH QUEUE
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Support Desk Operations
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Client inquiries routed from Massachusetts portal and Customer Care desk.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ticket List */}
        <div className="lg:col-span-5 bg-[#0B0F19] border border-[#1F2937] rounded-lg p-4 space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase pb-2 border-b border-slate-800">
            Incoming Queue ({tickets.length})
          </div>
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicketId(t.id)}
              className={`p-3 rounded-lg border transition-colors cursor-pointer space-y-1 ${
                selectedTicketId === t.id
                  ? 'bg-[#111827] border-[#FFA000]'
                  : 'bg-[#080B11] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-white font-bold">{t.clientName}</span>
                <span className="text-[#FFA000]">#{t.id}</span>
              </div>
              <div className="text-xs text-slate-200 font-medium truncate">{t.subject}</div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span>{t.category}</span>
                <span>{t.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Active Ticket Thread */}
        <div className="lg:col-span-7 bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
          {active ? (
            <>
              <div className="border-b border-slate-800 pb-3">
                <div className="text-xs font-mono text-[#FFA000]">
                  #{active.id} · Client: {active.clientName}
                </div>
                <h2 className="text-base font-bold text-white mt-0.5">{active.subject}</h2>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 text-xs">
                {active.messages.map((m) => (
                  <div key={m.id} className="p-3 bg-[#080B11] border border-slate-800 rounded space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span className="font-bold text-white">
                        {m.senderName} ({m.senderRole})
                      </span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAdminReply} className="pt-2 flex gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Transmit official support resolution / manager guidance..."
                  className="flex-1 bg-[#080B11] border border-slate-800 rounded px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#FFA000]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#FFA000] text-black font-bold text-xs rounded hover:bg-[#FFB300] flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">Select ticket to review.</div>
          )}
        </div>
      </div>
    </div>
  );
};
