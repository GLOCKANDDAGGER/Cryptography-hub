import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_DETAILS, ASSETS } from '../../constants/assets';
import {
  X,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MessageCircle,
  Video,
  ShieldCheck,
  ArrowRight,
  Download,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

const CONSULTATION_TYPES = [
  {
    id: 'growth-7d',
    title: '7-Day Growth Plan Consultation ($250 Min)',
    desc: 'Structured discussion on the 65% target growth 7-day strategy and capital settlement.',
    badge: 'Popular',
  },
  {
    id: 'portfolio-review',
    title: 'Comprehensive Portfolio & Bitcoin Review',
    desc: 'Evaluation of current BTC, ETH, and layer-1 asset allocations against volatility targets.',
  },
  {
    id: 'deposit-onboarding',
    title: 'Custodial Deposit & Wallet Funding Setup',
    desc: 'One-on-one walk-through of authenticated crypto wallet routing and wire transfers.',
  },
  {
    id: 'institutional-mandate',
    title: 'Private Institutional Mandate ($20,000+)',
    desc: 'Bespoke cold-custody vault architecture and tailored rebalancing criteria.',
  },
];

const TIME_SLOTS = [
  '09:00 AM EST',
  '10:30 AM EST',
  '01:00 PM EST',
  '02:30 PM EST',
  '04:00 PM EST',
  '05:30 PM EST',
];

export const ScheduleAppointmentModal: React.FC = () => {
  const {
    appointmentModalOpen,
    setAppointmentModalOpen,
    bookAppointment,
    user,
    isAuthenticated,
  } = useApp();

  // Generate selectable dates for the upcoming 10 business days
  const availableDates = useMemo(() => {
    const dates: { dateStr: string; label: string; dayName: string }[] = [];
    const base = new Date();
    let added = 0;
    let dayOffset = 1;

    while (added < 8) {
      const d = new Date(base);
      d.setDate(base.getDate() + dayOffset);
      const day = d.getDay();
      // Skip weekends
      if (day !== 0 && day !== 6) {
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dates.push({ dateStr, label, dayName });
        added++;
      }
      dayOffset++;
    }
    return dates;
  }, []);

  const [selectedType, setSelectedType] = useState<string>(CONSULTATION_TYPES[0].title);
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]?.dateStr || '');
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[1]);
  const [medium, setMedium] = useState<string>('Telegram Call (@ashleyelvira_fx)');

  // Form Fields
  const [name, setName] = useState<string>(isAuthenticated ? user.name : '');
  const [email, setEmail] = useState<string>(isAuthenticated ? user.email : '');
  const [phone, setPhone] = useState<string>(isAuthenticated && user.phone ? user.phone : '');
  const [telegram, setTelegram] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<{
    referenceId: string;
    date: string;
    timeSlot: string;
    consultationType: string;
    medium: string;
  } | null>(null);

  if (!appointmentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const apt = bookAppointment({
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      telegramUsername: telegram.startsWith('@') ? telegram : telegram ? `@${telegram}` : '',
      consultationType: selectedType,
      date: selectedDate,
      timeSlot: selectedSlot,
      medium,
      notes,
    });

    setConfirmedBooking({
      referenceId: apt.referenceId,
      date: apt.date,
      timeSlot: apt.timeSlot,
      consultationType: apt.consultationType,
      medium: apt.medium,
    });
  };

  const handleDownloadIcs = () => {
    if (!confirmedBooking) return;
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Crypto Hub Investments//Consultation//EN
BEGIN:VEVENT
SUMMARY:${confirmedBooking.consultationType} with Ashley Elvira
DESCRIPTION:Crypto Hub Investments consultation with Account Manager Ashley Elvira (${COMPANY_DETAILS.accountManager.email} / Telegram: ${COMPANY_DETAILS.accountManager.telegram}). Reference #${confirmedBooking.referenceId}.
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${confirmedBooking.referenceId}-consultation.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#0B0F19] border border-[#2B3547] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            setAppointmentModalOpen(false);
            setConfirmedBooking(null);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="text-xs font-mono text-[#FFA000] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>OFFICIAL CONSULTATION SCHEDULING</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Schedule an Appointment
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Book a one-on-one portfolio consultation with Lead Account Manager <strong>{COMPANY_DETAILS.accountManager.name}</strong>.
          </p>
        </div>

        {/* Account Manager Snapshot Card with Direct Telegram Link */}
        <div className="p-4 bg-[#0F1626] border border-amber-900/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#FFA000] shrink-0">
              <img
                src={ASSETS.ashleyElviraPortrait}
                alt={COMPANY_DETAILS.accountManager.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#FFA000] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>OFFICIAL ACCOUNT MANAGER</span>
              </div>
              <h3 className="text-sm font-bold text-white">
                {COMPANY_DETAILS.accountManager.name}
              </h3>
              <div className="text-xs text-slate-300 font-mono">
                {COMPANY_DETAILS.accountManager.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={COMPANY_DETAILS.accountManager.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 text-sky-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Telegram: {COMPANY_DETAILS.accountManager.telegram}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>

        {confirmedBooking ? (
          /* Confirmation State */
          <div className="p-6 bg-[#080B11] border border-emerald-800/60 rounded-xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-600/50 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono text-[#FFA000] font-bold">
                APPOINTMENT CONFIRMED
              </div>
              <h3 className="text-xl font-bold text-white">
                Reference #{confirmedBooking.referenceId}
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Your consultation has been booked with <strong>{COMPANY_DETAILS.accountManager.name}</strong>. A confirmation notice has been dispatched.
              </p>
            </div>

            <div className="p-4 bg-[#0F1626] rounded-xl border border-slate-800 text-left text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Consultation:</span>
                <span className="text-white font-bold">{confirmedBooking.consultationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-emerald-400 font-bold">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Medium:</span>
                <span className="text-[#FFA000]">{confirmedBooking.medium}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Manager:</span>
                <span className="text-slate-200">{COMPANY_DETAILS.accountManager.name} ({COMPANY_DETAILS.accountManager.email})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleDownloadIcs}
                className="flex-1 py-2.5 px-4 bg-[#1E293B] hover:bg-[#2A384F] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#FFA000]" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <a
                href={`${COMPANY_DETAILS.accountManager.telegramUrl}?text=Hello Ashley, I have scheduled consultation ${confirmedBooking.referenceId} for ${confirmedBooking.date} at ${confirmedBooking.timeSlot}. Looking forward to speaking.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Direct Message on Telegram</span>
              </a>
            </div>

            <button
              onClick={() => {
                setAppointmentModalOpen(false);
                setConfirmedBooking(null);
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Done / Return to Platform
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
            {/* Step 1: Select Type */}
            <div className="space-y-2">
              <label className="text-slate-300 font-bold uppercase flex items-center gap-1.5">
                <span>1. Select Consultation Focus</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CONSULTATION_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedType(t.title)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedType === t.title
                        ? 'bg-[#101726] border-[#FFA000] ring-1 ring-[#FFA000]/60'
                        : 'bg-[#080B11] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-xs line-clamp-1">{t.title}</div>
                      {t.badge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#FFA000] text-black shrink-0">
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-sans line-clamp-2">
                      {t.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-300 font-bold uppercase">2. Select Business Date</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {availableDates.map((d) => (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(d.dateStr)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        selectedDate === d.dateStr
                          ? 'bg-[#FFA000] text-black font-extrabold border-[#FFA000]'
                          : 'bg-[#080B11] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[9px] uppercase font-bold">{d.dayName}</div>
                      <div className="text-xs font-bold mt-0.5">{d.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-bold uppercase">3. Select Time Slot (EST)</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer text-[11px] font-bold ${
                        selectedSlot === slot
                          ? 'bg-[#1E293B] border-[#FFA000] text-[#FFA000]'
                          : 'bg-[#080B11] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Medium */}
            <div className="space-y-2">
              <label className="text-slate-300 font-bold uppercase">4. Preferred Meeting Channel</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Telegram Voice', val: 'Telegram Call (@ashleyelvira_fx)', icon: MessageCircle },
                  { label: 'Google Meet', val: 'Google Meet Video', icon: Video },
                  { label: 'Direct Phone', val: 'Direct Phone Call', icon: Phone },
                  { label: 'Portal Audio', val: 'Secure Portal Audio', icon: ShieldCheck },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSel = medium === m.val;
                  return (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => setMedium(m.val)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#101726] border-[#FFA000] text-[#FFA000]'
                          : 'bg-[#080B11] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px] font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Client Info */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300">Your Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. David Sterling"
                    className="w-full bg-[#080B11] border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-hidden focus:border-[#FFA000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. d.sterling@example.com"
                    className="w-full bg-[#080B11] border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-hidden focus:border-[#FFA000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (617) 555-0199"
                    className="w-full bg-[#080B11] border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-hidden focus:border-[#FFA000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 flex items-center justify-between">
                    <span>Telegram Username (Recommended)</span>
                    <span className="text-[#0088cc] font-bold">@handle</span>
                  </label>
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@yourtelegram"
                    className="w-full bg-[#080B11] border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-hidden focus:border-[#FFA000]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Discussion Notes or Questions (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Interested in allocating into the 7-day 65% growth tier starting with $250."
                  className="w-full bg-[#080B11] border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-hidden focus:border-[#FFA000] text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 text-xs font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FFA000]/15"
            >
              <span>Confirm & Lock Appointment Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
