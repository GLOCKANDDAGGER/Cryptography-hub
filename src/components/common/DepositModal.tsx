import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { COMPANY_DETAILS, ASSETS, OFFICIAL_INVESTMENT_PLANS, InvestmentPlanTier } from '../../constants/assets';
import {
  X,
  ShieldCheck,
  Mail,
  ArrowRight,
  AlertTriangle,
  Coins,
  CheckCircle2,
  Clock,
  Copy,
  TrendingUp,
  Sparkles,
  Calculator,
  MessageCircle,
  Calendar,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Send,
  ChevronRight,
  CheckCheck,
  Wallet,
  FileCheck,
  Info,
} from 'lucide-react';
import { TransactionRecord } from '../../types';

export const DepositModal: React.FC = () => {
  const {
    depositModalOpen,
    setDepositModalOpen,
    selectedDepositPlan,
    setSelectedDepositPlan,
    submitDepositRequest,
    showNotification,
    setAppointmentModalOpen,
    marketAssets,
    user,
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('starter-7d');
  const [amount, setAmount] = useState<string>('250');
  const [txHash, setTxHash] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [depositProofImage, setDepositProofImage] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<TransactionRecord | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const btcAddress = COMPANY_DETAILS.officialDeposit.address;

  const handleCopyReceipt = () => {
    if (!submissionReceipt) return;
    const text =
      `CRYPTO HUB INVESTMENTS - OFFICIAL DEPOSIT PROOF RECEIPT\n` +
      `=====================================================\n` +
      `Reference ID: ${submissionReceipt.referenceId}\n` +
      `Plan: ${submissionReceipt.planName}\n` +
      `Amount: $${submissionReceipt.amount.toLocaleString()} USD (~${submissionReceipt.btcAmount || btcEstimated} BTC)\n` +
      `Deposit BTC Address: ${btcAddress}\n` +
      (txHash ? `Transaction Hash: ${txHash}\n` : '') +
      `Account: ${user.name} (${user.email})\n` +
      `Status: UNDER VERIFICATION / PENDING CLEARANCE\n` +
      `Submitted: ${submissionReceipt.date}\n` +
      `Deposit Proof Screenshot: Attached on Website\n` +
      `Direct Action: Sent to Ashley Elvira (@ashleyelvira_fx) for dual-signature clearance`;
    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    showNotification('Complete Deposit Clearance Receipt copied to clipboard!');
    setTimeout(() => setCopiedReceipt(false), 3000);
  };

  // Generate crisp QR code on mount
  useEffect(() => {
    QRCode.toDataURL(btcAddress, {
      width: 280,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [btcAddress]);

  const currentPlan: InvestmentPlanTier =
    OFFICIAL_INVESTMENT_PLANS.find((p) => p.id === selectedPlanId) || OFFICIAL_INVESTMENT_PLANS[0];

  useEffect(() => {
    if (selectedDepositPlan) {
      const match = OFFICIAL_INVESTMENT_PLANS.find(
        (p) =>
          p.name.toLowerCase().includes(selectedDepositPlan.toLowerCase()) ||
          p.id.toLowerCase() === selectedDepositPlan.toLowerCase() ||
          (selectedDepositPlan.toLowerCase().includes('250') && p.minAmount === 250)
      );
      if (match) {
        setSelectedPlanId(match.id);
        setAmount(match.minAmount.toString());
      }
    }
  }, [selectedDepositPlan]);

  if (!depositModalOpen) return null;

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = OFFICIAL_INVESTMENT_PLANS.find((p) => p.id === planId);
    if (plan) {
      setAmount(plan.minAmount.toString());
      setError(null);
    }
  };

  const numericAmount = Math.max(0, parseFloat(amount) || 0);
  const calculatedProfit = (numericAmount * currentPlan.growthPercent) / 100;
  const totalProjectedPayout = numericAmount + calculatedProfit;

  // Calculate live BTC equivalent
  const btcAsset = marketAssets.find((a) => a.symbol === 'BTC');
  const btcPrice = btcAsset?.price || 83460.5;
  const btcEstimated = numericAmount > 0 ? (numericAmount / btcPrice).toFixed(6) : '0.000000';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(btcAddress);
    setCopiedAddress(true);
    showNotification('Official BTC Deposit Address copied to clipboard!');
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  const handleCopyBtcAmount = () => {
    navigator.clipboard.writeText(btcEstimated);
    setCopiedAmount(true);
    showNotification(`Copied ${btcEstimated} BTC amount to clipboard!`);
    setTimeout(() => setCopiedAmount(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setError('Screenshot file is too large. Please select an image under 20MB.');
        return;
      }
      setProofFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setDepositProofImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearScreenshot = () => {
    setDepositProofImage(null);
    setProofFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(numericAmount) || numericAmount < currentPlan.minAmount) {
      setError(`Minimum investment for ${currentPlan.name} is $${currentPlan.minAmount.toLocaleString()} USD.`);
      return;
    }

    if (!depositProofImage && !txHash) {
      setError('Please upload a screenshot of your deposit proof or enter your transaction hash.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const receipt = await submitDepositRequest(
        currentPlan.name,
        numericAmount,
        notes,
        depositProofImage || undefined,
        txHash || undefined,
        parseFloat(btcEstimated)
      );
      setSubmissionReceipt(receipt);
    } catch (err) {
      setError('An error occurred submitting your deposit proof. Please contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct Telegram text with pre-filled message
  const telegramText = encodeURIComponent(
    `Hello Ashley, I have completed my direct on-site investment deposit on Crypto Hub Investments.\n\n` +
      `Plan: ${currentPlan.name} (${currentPlan.growthPercent}% in ${currentPlan.durationDays} Days)\n` +
      `Amount: $${numericAmount.toLocaleString()} USD (~${btcEstimated} BTC)\n` +
      `Deposit BTC Address: ${btcAddress}\n` +
      (txHash ? `TxHash: ${txHash}\n` : '') +
      `Reference: ${submissionReceipt?.referenceId || 'Pending Clearance'}\n\n` +
      `I am sending my deposit screenshot proof for verification and balance crediting.`
  );
  const telegramHref = `${COMPANY_DETAILS.accountManager.telegramUrl}?text=${telegramText}`;

  // Direct Email link
  const emailSubject = encodeURIComponent(`Deposit Proof - ${currentPlan.name} ($${numericAmount} USD)`);
  const emailBody = encodeURIComponent(
    `Hello Ashley Elvira,\n\n` +
      `I have made a deposit of $${numericAmount.toLocaleString()} USD (~${btcEstimated} BTC) directly on the website for the ${currentPlan.name}.\n\n` +
      `Deposit BTC Address: ${btcAddress}\n` +
      (txHash ? `Transaction Hash: ${txHash}\n` : '') +
      `Account: ${user.name} (${user.email})\n\n` +
      `Attached is my deposit screenshot proof. Please verify the transaction and credit my portfolio balance.\n\n` +
      `Thank you.`
  );
  const emailHref = `mailto:${COMPANY_DETAILS.accountManager.email}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#0B0F19] border border-[#2B3547] rounded-2xl max-w-2xl w-full p-5 sm:p-7 space-y-6 relative shadow-2xl my-6">
        {/* Close Button */}
        <button
          onClick={() => {
            setDepositModalOpen(false);
            setSubmissionReceipt(null);
            setDepositProofImage(null);
            setProofFileName(null);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Prominent Attention Banner */}
        <div className="p-3.5 bg-gradient-to-r from-amber-950/80 via-[#1C160B] to-[#0E1424] border-2 border-[#FFA000] rounded-xl flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-[#FFA000] shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-left">
            <div className="text-[11px] font-mono text-[#FFA000] uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATTENTION: MAKE INVESTMENT DIRECTLY ON THIS WEBSITE</span>
            </div>
            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              Use our official custodial deposit details attached below. Then <strong className="text-amber-300">upload your payment screenshot</strong>, and <strong className="text-amber-300">directly send your deposit proof</strong> to Lead Account Manager <strong>Ashley Elvira</strong> for instant ledger clearance.
            </p>
          </div>
        </div>

        {/* Modal Subheader */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Make Investment Deposit
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            Minimum investment tier is <strong>$250 USD</strong> (delivering <strong>65% return in 7 Days</strong>). Dual-signature settlement and segregated cold vault security.
          </p>
        </div>

        {/* SUCCESS RECEIPT STATE */}
        {submissionReceipt ? (
          <div className="p-6 bg-[#080D17] border border-emerald-600/70 rounded-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCheck className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                DEPOSIT PROOF SUBMITTED FOR CLEARANCE
              </div>
              <h3 className="text-2xl font-bold text-white">Reference #{submissionReceipt.referenceId}</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Your investment deposit of <strong className="text-emerald-400">${submissionReceipt.amount.toLocaleString()} USD</strong> into the <strong>{submissionReceipt.planName}</strong> has been logged into the compliance review queue.
              </p>
            </div>

            {/* Receipt Summary Details */}
            <div className="p-4 bg-[#05070B] border border-slate-800 rounded-xl text-left text-xs font-mono space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Target Investment Tier:</span>
                <span className="text-white font-bold">{submissionReceipt.planName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Capital Value (USD):</span>
                <span className="text-emerald-400 font-bold">${submissionReceipt.amount.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Estimated Bitcoin:</span>
                <span className="text-white font-bold">{submissionReceipt.btcAmount || btcEstimated} BTC</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Official Deposit BTC Address:</span>
                <span className="text-[#FFA000] font-bold select-all">{btcAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Settlement Verification State:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>UNDER VERIFICATION</span>
                </span>
              </div>
              {depositProofImage && (
                <div className="pt-1">
                  <span className="text-slate-400 block mb-1.5">Attached Payment Proof:</span>
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-700 bg-black">
                    <img src={depositProofImage} alt="Deposit Proof" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            {/* Copy Receipt Action */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCopyReceipt}
                className="py-2 px-3 bg-[#111827] hover:bg-[#1E293B] border border-slate-700 text-slate-200 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedReceipt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#FFA000]" />}
                <span>{copiedReceipt ? 'Receipt Copied to Clipboard' : 'Copy Full Deposit Receipt'}</span>
              </button>
            </div>

            {/* DIRECT USER TO SEND PROOF CALL TO ACTION */}
            <div className="p-4 bg-[#0F1626] border-2 border-amber-500/70 rounded-xl space-y-3 text-left">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#FFA000]" />
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Direct User Action Required: Send Proof of Deposit
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                To guarantee priority dual-signature settlement and immediate crediting into your account balance, please send your screenshot directly to Lead Account Manager <strong>Ashley Elvira</strong>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href={telegramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#0088cc] hover:bg-[#0099e6] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via Telegram ({COMPANY_DETAILS.accountManager.telegram})</span>
                </a>

                <a
                  href={emailHref}
                  className="py-3 px-4 bg-[#1A2338] hover:bg-[#253350] border border-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                >
                  <Mail className="w-4 h-4 text-[#FFA000]" />
                  <span>Email Deposit Proof</span>
                </a>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setDepositModalOpen(false);
                  setSubmissionReceipt(null);
                  setDepositProofImage(null);
                  setProofFileName(null);
                }}
                className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* MAIN DIRECT DEPOSIT WORKFLOW */
          <form onSubmit={handleSubmitProof} className="space-y-6">
            {/* 1. Plan Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 uppercase flex items-center justify-between">
                <span>1. Select Investment Tier</span>
                <span className="text-[#FFA000] font-bold">Min: $250 · 65% in 7 Days</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {OFFICIAL_INVESTMENT_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => handlePlanChange(plan.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#101726] border-[#FFA000] shadow-md ring-1 ring-[#FFA000]/60'
                          : 'bg-[#080B11] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-white text-xs truncate">{plan.name}</div>
                      <div className="text-[#FFA000] font-bold text-sm font-mono mt-0.5">
                        +{plan.growthPercent}%
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        Min: ${plan.minAmount}
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">{plan.durationDays} Days</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Amount Input & Calculator */}
            <div className="p-4 bg-[#080B11] border border-slate-800 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-slate-200">
                  2. Investment Capital (USD)
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Live BTC Rate: <strong className="text-white">${btcPrice.toLocaleString()}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min={currentPlan.minAmount}
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError(null);
                    }}
                    className="w-full bg-[#05070B] border border-slate-800 text-white pl-8 pr-3.5 py-2.5 rounded-xl text-base font-bold font-mono focus:outline-hidden focus:border-[#FFA000]"
                  />
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    Minimum for this tier: ${currentPlan.minAmount.toLocaleString()} USD
                  </div>
                </div>

                {/* Equivalent BTC Card */}
                <div className="p-2.5 bg-[#0D121D] border border-amber-900/40 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Exact BTC to Send:</div>
                    <div className="text-amber-400 font-mono font-bold text-base tracking-wider">
                      {btcEstimated} BTC
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyBtcAmount}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy BTC amount"
                  >
                    {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAmount ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Profit Projection Line */}
              <div className="p-2.5 bg-[#0A0F1A] rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Target Profit (+{currentPlan.growthPercent}% in {currentPlan.durationDays}d):
                </span>
                <span className="text-emerald-400 font-bold">
                  +${calculatedProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </span>
              </div>
            </div>

            {/* 3. CONFIRM DEPOSIT DETAILS - DIRECTLY MATCHING THE USER'S PHOTO */}
            <div className="bg-[#0D131F] border-2 border-[#FFA000]/70 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-[#FFA000]" />
                    <span>Confirm deposit details</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Transfer BTC to the official custodial address below directly from your wallet or exchange.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-amber-950/80 text-amber-300 border border-amber-700/50 rounded-lg uppercase">
                  Network: Bitcoin (BTC)
                </span>
              </div>

              {/* QR and Address Card Layout (Exactly as in uploaded photo) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-[#070A10] p-4 rounded-xl border border-slate-800/90">
                {/* Left Column: QR Code */}
                <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2">
                  <div className="w-44 h-44 sm:w-48 sm:h-48 bg-white p-2.5 rounded-xl shadow-lg flex items-center justify-center">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="BTC Deposit Address QR Code"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 animate-pulse rounded" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 text-center">
                    Scan with any Bitcoin Wallet
                  </span>
                </div>

                {/* Right Column: Address and Details */}
                <div className="md:col-span-8 space-y-3 font-mono">
                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      BTC Address
                    </div>

                    {/* Standard Address Text */}
                    <div className="p-3 bg-[#0B0F19] border border-slate-800 rounded-xl flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white select-all break-all tracking-wide">
                        {btcAddress}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="p-2 bg-[#1A2338] hover:bg-[#253350] border border-slate-700 text-slate-200 rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                        title="Copy BTC Address"
                      >
                        {copiedAddress ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-[#FFA000]" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Highlighted Orange/Gold Address Bar from Photo */}
                    <div className="p-2.5 bg-amber-950/40 border border-amber-600/40 rounded-xl text-center select-all">
                      <span className="text-xs sm:text-sm font-bold text-[#FFA000] break-all tracking-wider">
                        {btcAddress}
                      </span>
                    </div>
                  </div>

                  {/* Metadata fields from photo */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Minimum Deposit Amount</span>
                      <span className="text-white font-bold">$250.00 USD</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Route Deposits To</span>
                      <span className="text-emerald-400 font-bold">Funding Ledger</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. REQUEST SCREENSHOT (PROMPT USER TO UPLOAD DEPOSIT PROOF) */}
            <div className="p-4 sm:p-5 bg-[#0A0E18] border border-amber-800/50 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-mono text-[#FFA000] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4" />
                    <span>REQUEST SCREENSHOT & PROOF OF DEPOSIT</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Upload Your Completed Payment Screenshot
                  </h4>
                </div>
                <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded">
                  Required For Ledger Credit
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                After broadcasting your Bitcoin transfer, take a screenshot of your wallet or exchange receipt (showing amount, destination address, and transaction timestamp) and upload it here.
              </p>

              {/* Upload Dropzone */}
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="deposit-screenshot-upload"
                />

                {depositProofImage ? (
                  <div className="p-3 bg-[#05070B] border border-emerald-600/60 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 bg-black shrink-0">
                        <img
                          src={depositProofImage}
                          alt="Screenshot Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white truncate font-mono">
                          {proofFileName || 'deposit_proof_screenshot.jpg'}
                        </div>
                        <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Screenshot loaded successfully</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label
                        htmlFor="deposit-screenshot-upload"
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors cursor-pointer font-mono"
                      >
                        Change
                      </label>
                      <button
                        type="button"
                        onClick={handleClearScreenshot}
                        className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs rounded-lg transition-colors cursor-pointer font-mono"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="deposit-screenshot-upload"
                    className="p-6 border-2 border-dashed border-slate-700 hover:border-[#FFA000] rounded-xl flex flex-col items-center justify-center space-y-2 text-center bg-[#070A10] cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#121927] border border-slate-700 flex items-center justify-center text-[#FFA000]">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white hover:underline">
                        Click to upload payment screenshot
                      </span>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        Supports PNG, JPG, JPEG, WebP or PDF (Max 20MB)
                      </span>
                    </div>
                  </label>
                )}
              </div>

              {/* Optional TxHash Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-300">Transaction Hash / TxID (Optional)</label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="e.g. 7f8a9b3c4d5e..."
                    className="w-full bg-[#05070B] border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-hidden focus:border-[#FFA000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Sender Wallet / Note (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Sent from CashApp / TrustWallet"
                    className="w-full bg-[#05070B] border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-hidden focus:border-[#FFA000]"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/70 border border-rose-700/60 rounded-xl text-rose-300 text-xs font-sans flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* 5. DIRECT USER TO SEND PROOF (AS REQUIRED) */}
            <div className="p-4 bg-[#0F1626] border border-amber-900/60 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#FFA000]" />
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Direct User Notification: Send Proof of Deposit
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                In addition to submitting directly on the website, please send your transfer screenshot directly to Lead Account Manager <strong>Ashley Elvira</strong>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <a
                  href={telegramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 text-sky-400 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer text-center font-bold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send to Telegram ({COMPANY_DETAILS.accountManager.telegram})</span>
                </a>

                <a
                  href={emailHref}
                  className="py-2.5 px-3 bg-[#1A2338] hover:bg-[#253350] border border-slate-700 text-slate-200 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer text-center font-bold"
                >
                  <Mail className="w-4 h-4 text-[#FFA000]" />
                  <span>Send to Email ({COMPANY_DETAILS.accountManager.email})</span>
                </a>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-3.5 px-5 text-sm font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] disabled:opacity-50 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FFA000]/15"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Deposit Verification...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Submit Deposit Proof</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDepositModalOpen(false)}
                className="w-full sm:w-auto py-3 px-4 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
