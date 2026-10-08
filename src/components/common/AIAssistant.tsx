import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_DETAILS, MIN_INVESTMENT_AMOUNT, MIN_WITHDRAWAL_AMOUNT } from '../../constants/assets';
import {
  Bot,
  Send,
  X,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ArrowDownToLine,
  UserCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistant: React.FC = () => {
  const {
    user,
    portfolio,
    activeInvestment,
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    setWithdrawalModalOpen,
    setActivePage,
  } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hello ${user.name ? user.name.split(' ')[0] : 'Investor'}, I am Crypto Hub AI — your intelligent institutional advisor. I can help explain your dashboard metrics, active investment performance, cold storage safeguards, withdrawal protocols, or direct you to Lead Account Manager Ashley Elvira. How may I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAIAssistantOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const userContext = {
        name: user.name,
        accountNumber: user.accountNumber,
        portfolioValue: `$${(user.numericBalance ?? portfolio.totalVerifiedValue ?? 0).toLocaleString()}`,
        availableBalance: `$${(user.availableBalance ?? user.balance ?? 0).toLocaleString()}`,
        activeInvestmentPlan: activeInvestment ? activeInvestment.planName : 'None currently active',
        activeInvestmentValue: activeInvestment ? `$${activeInvestment.currentValue.toLocaleString()}` : '$0.00',
        activeInvestmentProfit: activeInvestment ? `+$${activeInvestment.profit.toLocaleString()} (+${activeInvestment.growthPercent}%)` : '$0.00',
        activeInvestmentDay: activeInvestment ? `Day ${activeInvestment.currentDay} of ${activeInvestment.durationDays}` : 'N/A',
        minInvestmentRequirement: `$${MIN_INVESTMENT_AMOUNT.toFixed(2)} USD`,
        minWithdrawalRequirement: `$${MIN_WITHDRAWAL_AMOUNT.toFixed(2)} USD`,
        accountManagerName: COMPANY_DETAILS.accountManager.name,
        accountManagerEmail: COMPANY_DETAILS.accountManager.email,
        accountManagerTelegram: COMPANY_DETAILS.accountManager.telegram,
        companyEmail: COMPANY_DETAILS.primaryEmail,
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6),
          userContext,
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        'I am analyzing market data and account ledgers. Please contact Ashley Elvira at Ashleyelvira35@gmail.com for dedicated guidance.';

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: `The AI knowledge link experienced a temporary network latency. For immediate account assistance, you can reach Lead Account Manager Ashley Elvira at ${COMPANY_DETAILS.accountManager.email} or Crypto Hub Investments at ${COMPANY_DETAILS.primaryEmail}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Active Trade Status', query: 'What is the status of my active investment trade?' },
    { label: 'Withdrawal Rules', query: 'What are the withdrawal requirements and minimums?' },
    { label: 'Contact Ashley Elvira', query: 'How do I contact Lead Account Manager Ashley Elvira?' },
    { label: 'Cold Storage Vaults', query: 'How does Crypto Hub Investments safeguard funds with cold storage?' },
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isAIAssistantOpen && (
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-[#0B0F19] text-[#FFA000] border border-[#FFA000]/60 rounded-full shadow-2xl hover:bg-[#111827] hover:border-[#FFA000] transition-all transform hover:scale-105 cursor-pointer group"
            title="Open Crypto Hub AI Advisor"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-[#FFA000]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <span className="text-xs font-bold font-mono tracking-wide text-white group-hover:text-[#FFA000]">
              Crypto Hub AI
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal / Drawer */}
      {isAIAssistantOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[420px] max-h-[85vh] h-[580px] bg-[#0B0F19] border border-[#1E293B] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-[#0D1424] border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#FFA000]/15 border border-[#FFA000]/40 flex items-center justify-center text-[#FFA000]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight">Crypto Hub AI</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Autonomous Institutional Knowledge Engine
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAIAssistantOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#080C14]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#FFA000] text-black font-medium'
                      : 'bg-[#0D1525] text-slate-200 border border-slate-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FFA000]" />
                <span>Crypto Hub AI is formulating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-3 py-2 bg-[#0A0E17] border-t border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p) => (
              <button
                key={p.label}
                onClick={() => handleSendMessage(p.query)}
                className="px-2.5 py-1 text-[10px] font-mono whitespace-nowrap bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-[#FFA000] border border-slate-800 rounded-full transition-colors cursor-pointer shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#0D1424] border-t border-[#1E293B]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about your portfolio, trades, or policies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-[#080C14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FFA000]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 text-black bg-[#FFA000] hover:bg-[#FFB300] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="text-[10px] text-slate-400 font-mono text-center mt-1.5 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Context restricted to authorized ledger records</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
