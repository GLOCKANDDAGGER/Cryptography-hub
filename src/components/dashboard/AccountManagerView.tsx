import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS, COMPANY_DETAILS } from '../../constants/assets';
import {
  Mail,
  Send,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  FileText,
  PhoneCall,
  UserCheck,
  MessageSquare,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

export const AccountManagerView: React.FC = () => {
  const { ashleyMessages, sendAshleyMessage, showNotification, setAppointmentModalOpen } = useApp();
  const [inputText, setInputText] = useState('');
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookingTopic, setBookingTopic] = useState('Quarterly Portfolio Review');
  const [bookingDate, setBookingDate] = useState('2026-09-30');
  const [bookingTime, setBookingTime] = useState('11:00 AM EST');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendAshleyMessage(inputText.trim());
    setInputText('');
  };

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    setBookModalOpen(false);
    showNotification(
      `Consultation with Ashley Elvira scheduled for ${bookingDate} at ${bookingTime}. Confirmation sent to your email.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Ashley Elvira Featured Header Profile */}
      <div className="bg-[#0B0F19] border border-[#2B3547] rounded-xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden border-2 border-[#FFA000] shadow-2xl">
              <img
                src={ASSETS.ashleyElviraPortrait}
                alt="Ashley Elvira - Account Manager & Cryptocurrency Analyst"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#000000] border border-[#FFA000] text-[#FFA000] font-mono text-[10px] font-bold px-2.5 py-0.5 rounded shadow-sm whitespace-nowrap">
              7+ YEARS TRADING EXP
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DESK ACTIVE (MASSACHUSETTS)</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Assigned to Account #CHI-8849-9210-MV
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div>
            <div className="text-xs font-mono text-[#FFA000] uppercase font-bold tracking-wider">
              YOUR DEDICATED PROFESSIONAL ACCOUNT MANAGER
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">
              Ashley Elvira
            </h1>
            <p className="text-sm font-semibold text-[#FFA000] mt-1">
              Cryptocurrency Analyst · Bitcoin & Forex Account Manager
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Ashley Elvira is an Account Manager and Cryptocurrency Analyst associated with Crypto Hub Investments, focusing on client communication, cryptocurrency market analysis, portfolio support, and account management. Bringing more than 7 years of specialized trading and market analysis experience, Ashley coordinates strategy reviews, onboarding guidance, and direct support.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
            <div className="p-3 bg-[#080B11] border border-slate-800 rounded space-y-1">
              <span className="text-slate-400 font-sans">Direct Operational Email:</span>
              <a
                href={`mailto:${COMPANY_DETAILS.accountManager.email}`}
                className="text-white hover:text-[#FFA000] font-bold flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#FFA000]" />
                <span>{COMPANY_DETAILS.accountManager.email}</span>
              </a>
            </div>

            <div className="p-3 bg-[#080B11] border border-slate-800 rounded space-y-1">
              <span className="text-slate-400 font-sans">Primary Core Focus:</span>
              <div className="text-slate-200 font-semibold font-sans">
                Bitcoin Analysis, Digital Asset Management & Client Onboarding
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="px-5 py-2.5 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule 1-on-1 Consultation</span>
            </button>

            <a
              href={COMPANY_DETAILS.accountManager.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs font-mono font-bold text-sky-300 hover:text-white bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 rounded transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Direct Telegram: {COMPANY_DETAILS.accountManager.telegram}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <a
              href={`mailto:${COMPANY_DETAILS.accountManager.email}`}
              className="px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white bg-[#111827] border border-slate-700 rounded transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#FFA000]" />
              <span>Email Directly</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Communication Thread with Ashley Elvira */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#FFA000]" />
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              DIRECT SECURE CLIENT MESSAGING CHANNEL
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Encrypted End-to-End · Response standard: &lt;2 hrs
          </span>
        </div>

        {/* Message history */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {ashleyMessages.map((msg) => {
            const isAshley = msg.sender === 'ashley';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${isAshley ? 'justify-start' : 'justify-end'}`}
              >
                {isAshley && (
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#FFA000] shrink-0 mt-0.5">
                    <img
                      src={ASSETS.ashleyElviraPortrait}
                      alt="Ashley Elvira"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div
                  className={`max-w-xl p-3.5 rounded-lg space-y-1 ${
                    isAshley
                      ? 'bg-[#111827] text-slate-200 border border-slate-700'
                      : 'bg-[#FFA000] text-black font-medium'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] opacity-75 font-mono mb-0.5">
                    <span>{isAshley ? 'Ashley Elvira (Account Manager)' : 'You (Marcus Vance)'}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input box */}
        <form onSubmit={handleSendMessage} className="pt-2 flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message or inquiry for Ashley Elvira..."
            className="flex-1 bg-[#080B11] border border-slate-800 rounded-md px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#FFA000]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>

      {/* Scope of Responsibilities */}
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
          ACCOUNT MANAGER RESPONSIBILITIES & STANDARDS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-[#080B11] border border-slate-800 rounded space-y-1">
            <div className="text-white font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFA000]" />
              <span>Portfolio Monitoring</span>
            </div>
            <p className="text-slate-400">Regularly audits client asset allocations against target risk parameters and provides scheduled rebalancing summaries.</p>
          </div>
          <div className="p-3 bg-[#080B11] border border-slate-800 rounded space-y-1">
            <div className="text-white font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFA000]" />
              <span>Market Intelligence</span>
            </div>
            <p className="text-slate-400">Delivers verified cryptocurrency market research, Bitcoin liquidity updates, and macro briefings directly to clients.</p>
          </div>
          <div className="p-3 bg-[#080B11] border border-slate-800 rounded space-y-1">
            <div className="text-white font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFA000]" />
              <span>Operational Escalations</span>
            </div>
            <p className="text-slate-400">Coordinates directly with compliance and security desks to expedite wire settlements, KYC updates, and token pairing.</p>
          </div>
        </div>
      </div>

      {/* Schedule Consultation Modal */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0B0F19] border border-[#2B3547] rounded-xl max-w-md w-full p-6 space-y-5 relative shadow-2xl">
            <div>
              <div className="text-xs font-mono text-[#FFA000] uppercase font-bold">
                DIRECT CONSULTATION BOOKING
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                Schedule Session with Ashley Elvira
              </h3>
              <p className="text-xs text-slate-400">
                Confirmed via calendar invitation and video link to your registered email.
              </p>
            </div>

            <form onSubmit={handleBookConsultation} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300">Consultation Focus</label>
                <select
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  className="w-full bg-[#080B11] border border-slate-800 text-white p-2.5 rounded focus:outline-hidden"
                >
                  <option value="Quarterly Portfolio Review">Quarterly Portfolio Review</option>
                  <option value="Bitcoin Halving Market Assessment">Bitcoin Halving Market Assessment</option>
                  <option value="Cash Reserve Rebalancing">Cash Reserve Rebalancing</option>
                  <option value="Custody & Security Verification">Custody & Security Verification</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#080B11] border border-slate-800 text-white p-2.5 rounded focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300">Time (EST)</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-[#080B11] border border-slate-800 text-white p-2.5 rounded focus:outline-hidden"
                  >
                    <option value="10:00 AM EST">10:00 AM EST</option>
                    <option value="11:00 AM EST">11:00 AM EST</option>
                    <option value="02:00 PM EST">02:00 PM EST</option>
                    <option value="04:00 PM EST">04:00 PM EST</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded text-[11px] text-amber-200">
                Direct phone and video appointments are conducted in accordance with Massachusetts operating standards.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors"
                >
                  Confirm Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
