import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_DETAILS, ASSETS } from '../../constants/assets';
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Calendar,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { showNotification, setAppointmentModalOpen } = useApp();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'General Inquiries',
    message: '',
  });
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    const ref = `CHI-INQ-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedRef(ref);
    showNotification(`Inquiry logged with reference #${ref}. Routing to ${COMPANY_DETAILS.primaryEmail}`);
  };

  return (
    <div className="py-12 bg-[#000000] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono text-[#FFA000] tracking-wider uppercase">
            COMMUNICATION DESK
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Connect With Our Team
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Reach out directly to Crypto Hub Investments for market intelligence inquiries, institutional onboarding, or dedicated account support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Official Channels Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#0B0F19] border border-[#1E293B] rounded-lg space-y-5">
              <h3 className="text-lg font-bold text-white">Verified Contact Channels</h3>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 bg-[#080B11] border border-slate-800 rounded space-y-1">
                  <div className="text-slate-400 font-sans">Primary Corporate Contact</div>
                  <a
                    href={`mailto:${COMPANY_DETAILS.primaryEmail}`}
                    className="text-white hover:text-[#FFA000] flex items-center gap-2 font-bold text-sm transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#FFA000]" />
                    <span>{COMPANY_DETAILS.primaryEmail}</span>
                  </a>
                  <p className="text-[10px] text-slate-400 font-sans">Official corporate communications & compliance</p>
                </div>

                <div className="p-3.5 bg-[#080B11] border border-slate-800 rounded space-y-1">
                  <div className="text-slate-400 font-sans">Customer Care & Support Desk</div>
                  <a
                    href={`mailto:${COMPANY_DETAILS.customerCareEmail}`}
                    className="text-white hover:text-[#FFA000] flex items-center gap-2 font-bold text-sm transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#FFA000]" />
                    <span>{COMPANY_DETAILS.customerCareEmail}</span>
                  </a>
                  <p className="text-[10px] text-slate-400 font-sans">Technical platform, ticketing & login assistance</p>
                </div>

                <div className="p-4 bg-[#0F1626] border border-amber-900/60 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FFA000] shrink-0">
                      <img
                        src={ASSETS.ashleyElviraPortrait}
                        alt="Ashley Elvira"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] text-[#FFA000] font-mono font-bold">ASSIGNED ACCOUNT MANAGER</div>
                      <div className="text-white font-bold font-sans text-sm">Ashley Elvira</div>
                      <div className="text-[10px] text-slate-300">Cryptocurrency Analyst · 7+ yrs exp</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <a
                      href={COMPANY_DETAILS.accountManager.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 text-sky-300 rounded-lg text-xs font-mono font-bold flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-sky-400" />
                        <span>Telegram: {COMPANY_DETAILS.accountManager.telegram}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>

                    <a
                      href={`mailto:${COMPANY_DETAILS.accountManager.email}`}
                      className="text-white hover:text-[#FFA000] flex items-center gap-2 font-mono text-xs transition-colors py-1 px-1"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#FFA000]" />
                      <span>{COMPANY_DETAILS.accountManager.email}</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAppointmentModalOpen(true)}
                    className="w-full py-2.5 px-3 bg-[#FFA000] hover:bg-[#FFB300] text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule an Appointment</span>
                  </button>
                </div>

                <div className="p-3.5 bg-[#080B11] border border-slate-800 rounded space-y-1">
                  <div className="text-slate-400 font-sans">Primary Geographic Association</div>
                  <div className="text-white flex items-center gap-2 font-bold text-sm">
                    <MapPin className="w-4 h-4 text-[#FFA000]" />
                    <span>{COMPANY_DETAILS.location}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">Verified commercial jurisdiction</p>
                </div>
              </div>
            </div>

            {/* Response standard note */}
            <div className="p-4 bg-[#0A0E17] border border-slate-800 rounded text-xs text-slate-300 flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#FFA000] shrink-0" />
              <span>Standard operational response timeframe is within 2 to 4 business hours.</span>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="lg:col-span-7 bg-[#0B0F19] border border-[#1E293B] rounded-lg p-6 sm:p-8">
            {submittedRef ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Inquiry Transmitted</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you for contacting Crypto Hub Investments. Your inquiry reference is <span className="font-mono font-bold text-[#FFA000]">{submittedRef}</span>. A representative or your assigned manager will respond shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmittedRef(null);
                    setFormState({ name: '', email: '', subject: 'General Inquiries', message: '' });
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  Submit Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Send Direct Message</h3>
                  <p className="text-xs text-slate-400">All submissions are cryptographically hashed and logged to our verified service desk.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white focus:outline-hidden focus:border-[#FFA000]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="e.g. name@domain.com"
                      className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white focus:outline-hidden focus:border-[#FFA000]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Topic / Department</label>
                  <select
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white focus:outline-hidden focus:border-[#FFA000]"
                  >
                    <option value="General Inquiries">General Corporate Inquiries</option>
                    <option value="Account Manager - Ashley Elvira">Account Management (Ashley Elvira)</option>
                    <option value="Portfolio Solutions">Portfolio Solutions & Custody</option>
                    <option value="Customer Care">Customer Care (myhelpsdesk@outlook.com)</option>
                    <option value="Compliance">Compliance & Institutional Verification</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Provide details regarding your inquiry..."
                    className="w-full px-3.5 py-2.5 bg-[#080B11] border border-slate-800 rounded text-sm text-white focus:outline-hidden focus:border-[#FFA000]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Inquiry to Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
