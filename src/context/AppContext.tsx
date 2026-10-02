import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  RegisteredUser,
  PortfolioSummary,
  TransactionRecord,
  SupportTicket,
  SupportMessage,
  DocumentRecord,
  AuditLogEntry,
  MarketAsset,
  ActiveSession,
  ThemeMode,
  AppointmentRecord,
} from '../types';
import { COMPANY_DETAILS, ASSETS } from '../constants/assets';

interface AppContextType {
  // Theme Mode
  theme: ThemeMode;
  toggleTheme: () => void;

  // Appointments Workflow
  appointmentModalOpen: boolean;
  setAppointmentModalOpen: (open: boolean) => void;
  appointments: AppointmentRecord[];
  bookAppointment: (apt: Omit<AppointmentRecord, 'id' | 'referenceId' | 'status' | 'createdAt' | 'managerName' | 'managerEmail' | 'managerTelegram'>) => AppointmentRecord;
  cancelAppointment: (id: string) => void;

  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;

  // Registered Users & Approval Workflow
  registeredUsers: RegisteredUser[];
  registerClient: (name: string, email: string, password?: string, phone?: string) => { success: boolean; message: string };
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  updateClientBalance: (userId: string, newBalance: number) => void;
  resetClientPassword: (userId: string, newPassword?: string) => string;

  // Deposit Modal Workflow
  depositModalOpen: boolean;
  setDepositModalOpen: (open: boolean) => void;
  selectedDepositPlan: string;
  setSelectedDepositPlan: (plan: string) => void;
  submitDepositRequest: (planName: string, amount: number, notes?: string) => void;

  // User & Profile
  user: UserProfile;
  updateUser: (fields: Partial<UserProfile>) => void;
  activeSessions: ActiveSession[];
  revokeSession: (id: string) => void;

  // Portfolio & Market
  portfolio: PortfolioSummary;
  rebalancePortfolio: (newHoldings: { symbol: string; percent: number }[]) => void;
  marketAssets: MarketAsset[];

  // Transactions
  transactions: TransactionRecord[];
  addTransaction: (tx: Omit<TransactionRecord, 'id' | 'referenceId'>) => void;
  updateTransactionStatus: (id: string, status: TransactionRecord['status']) => void;

  // Support
  tickets: SupportTicket[];
  createTicket: (subject: string, category: SupportTicket['category'], initialMessage: string, priority: SupportTicket['priority']) => void;
  replyToTicket: (ticketId: string, text: string) => void;

  // Direct Communication with Ashley Elvira
  ashleyMessages: { id: string; sender: 'client' | 'ashley'; text: string; time: string }[];
  sendAshleyMessage: (text: string) => void;

  // Documents
  documents: DocumentRecord[];

  // Audit Logs (Admin & Security)
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, status?: 'SUCCESS' | 'FLAGGED' | 'BLOCKED', details?: string) => void;

  // Toast / System Notifications
  notification: string | null;
  showNotification: (msg: string) => void;
}

const initialMarketAssets: MarketAsset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 83460.5,
    change24h: 3.12,
    high24h: 84150.0,
    low24h: 81920.0,
    volume24h: '$36.8B',
    marketCap: '$1.64T',
    sparkline: [81920, 82400, 82100, 82950, 83100, 83250, 83460.5],
    category: 'Store of Value',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2685.2,
    change24h: 2.14,
    high24h: 2715.0,
    low24h: 2630.0,
    volume24h: '$18.4B',
    marketCap: '$323.5B',
    sparkline: [2630, 2645, 2640, 2668, 2672, 2679, 2685.2],
    category: 'Smart Contracts',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 118.6,
    change24h: 4.85,
    high24h: 121.5,
    low24h: 114.2,
    volume24h: '$4.9B',
    marketCap: '$58.2B',
    sparkline: [114.2, 115.5, 116.2, 115.8, 117.4, 118.1, 118.6],
    category: 'Layer 1',
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    price: 1.488,
    change24h: 1.85,
    high24h: 1.512,
    low24h: 1.455,
    volume24h: '$2.8B',
    marketCap: '$84.6B',
    sparkline: [1.455, 1.462, 1.459, 1.475, 1.481, 1.484, 1.488],
    category: 'Layer 1',
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.245,
    change24h: 1.25,
    high24h: 0.252,
    low24h: 0.239,
    volume24h: '$610M',
    marketCap: '$8.8B',
    sparkline: [0.239, 0.241, 0.240, 0.243, 0.242, 0.244, 0.245],
    category: 'Layer 1',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    price: 1.0001,
    change24h: 0.01,
    high24h: 1.0004,
    low24h: 0.9998,
    volume24h: '$54.2B',
    marketCap: '$132.8B',
    sparkline: [1.0, 1.0001, 1.0, 1.0002, 1.0001, 1.0001, 1.0001],
    category: 'Stablecoin',
  },
];

const initialTransactions: TransactionRecord[] = [
  {
    id: 'tx-1',
    date: '2026-09-24 14:32 EST',
    type: 'DEPOSIT',
    description: 'Wire Inbound - Primary Operating Account',
    amount: 25000.0,
    currency: 'USD',
    status: 'COMPLETED',
    referenceId: 'CHI-TX-99824',
    fee: 0,
    destinationOrSource: 'Verified Wire Transfer',
  },
  {
    id: 'tx-2',
    date: '2026-09-24 15:05 EST',
    type: 'ALLOCATION',
    description: 'Disciplined Execution: Bitcoin Spot Accumulation',
    amount: 15000.0,
    currency: 'USD',
    status: 'COMPLETED',
    referenceId: 'CHI-TX-99825',
    fee: 15.0,
    destinationOrSource: 'Institutional Cold Custody',
  },
  {
    id: 'tx-3',
    date: '2026-09-22 10:14 EST',
    type: 'REBALANCE',
    description: 'Quarterly Risk Rebalance: ETH to Tier-1 Cash Buffer',
    amount: 8500.0,
    currency: 'USD',
    status: 'COMPLETED',
    referenceId: 'CHI-TX-99780',
    fee: 8.5,
    destinationOrSource: 'CHI Vault Internal',
  },
  {
    id: 'tx-4',
    date: '2026-09-20 16:45 EST',
    type: 'ALLOCATION',
    description: 'Solana High-Performance Infrastructure Allocation',
    amount: 5000.0,
    currency: 'USD',
    status: 'COMPLETED',
    referenceId: 'CHI-TX-99722',
    fee: 5.0,
    destinationOrSource: 'Staking & Segregated Vault',
  },
  {
    id: 'tx-5',
    date: '2026-09-18 11:20 EST',
    type: 'WITHDRAWAL',
    description: 'Client Wire Outbound - Verified Corporate Settlement',
    amount: 10000.0,
    currency: 'USD',
    status: 'UNDER_REVIEW',
    referenceId: 'CHI-TX-99640',
    fee: 25.0,
    destinationOrSource: 'Bank of America N.A. (Verified)',
  },
  {
    id: 'tx-6',
    date: '2026-09-12 09:15 EST',
    type: 'FEE',
    description: 'Monthly Management & Custodial Custody Fee',
    amount: 74.12,
    currency: 'USD',
    status: 'COMPLETED',
    referenceId: 'CHI-TX-99511',
    fee: 0,
    destinationOrSource: 'Crypto Hub Investments Fee Schedule',
  },
];

const initialTickets: SupportTicket[] = [
  {
    id: 't-101',
    clientId: 'usr-1',
    clientName: 'Marcus Vance',
    subject: 'Quarterly Portfolio Allocation & Bitcoin Exposure Review',
    category: 'PORTFOLIO',
    status: 'OPEN',
    priority: 'HIGH',
    createdAt: '2026-09-26 11:20 EST',
    updatedAt: '2026-09-26 14:45 EST',
    messages: [
      {
        id: 'm-1',
        senderId: 'usr-1',
        senderName: 'Marcus Vance',
        senderRole: 'CLIENT',
        text: 'Hi Ashley, I saw the recent macro commentary regarding Bitcoin volatility. Could we schedule a review to discuss rebalancing 5% of my ETH allocation into cash reserves?',
        timestamp: '2026-09-26 11:20 EST',
      },
      {
        id: 'm-2',
        senderId: 'mgr-ashley',
        senderName: 'Ashley Elvira',
        senderRole: 'MANAGER',
        text: 'Hello Marcus, absolutely. I have reviewed your current 51.5% BTC and 33.3% ETH exposure. A rebalancing model into USD cash reserves would reduce your short-term beta without affecting long-term asymmetric exposure. I am preparing your customized strategy brief.',
        timestamp: '2026-09-26 14:45 EST',
      },
    ],
  },
  {
    id: 't-102',
    clientId: 'usr-1',
    clientName: 'Marcus Vance',
    subject: 'Hardware Token & MFA Device Verification',
    category: 'SECURITY',
    status: 'CLOSED',
    priority: 'NORMAL',
    createdAt: '2026-09-15 08:30 EST',
    updatedAt: '2026-09-15 10:12 EST',
    messages: [
      {
        id: 'm-3',
        senderId: 'usr-1',
        senderName: 'Marcus Vance',
        senderRole: 'CLIENT',
        text: 'Completed pairing my YubiKey hardware token. Can you confirm the secondary factor is enforcing strict sign-ins?',
        timestamp: '2026-09-15 08:30 EST',
      },
      {
        id: 'm-4',
        senderId: 'sec-ops',
        senderName: 'Security Desk',
        senderRole: 'ADMIN',
        text: 'Verification confirmed. Your account is secured with WebAuthn/FIDO2 standard authentication. All subsequent session requests require physical token touch.',
        timestamp: '2026-09-15 10:12 EST',
      },
    ],
  },
];

const initialDocuments: DocumentRecord[] = [
  {
    id: 'doc-1',
    title: 'Q3 2026 Digital Asset Review & Macro Intelligence Brief',
    category: 'REPORT',
    date: '2026-09-25',
    fileSize: '3.4 MB',
    format: 'PDF',
    description: 'Institutional research covering Bitcoin monetary policy, regulatory milestones, and on-chain liquidity velocity.',
  },
  {
    id: 'doc-2',
    title: 'August 2026 Verified Client Statement - Marcus Vance',
    category: 'STATEMENT',
    date: '2026-09-01',
    fileSize: '1.2 MB',
    format: 'PDF',
    description: 'Certified monthly ledger statement with cost basis, holdings valuation, and transaction audit trails.',
  },
  {
    id: 'doc-3',
    title: 'Form CHI-882: Client Risk Profile & Asset Allocation Charter',
    category: 'DISCLOSURE',
    date: '2026-06-15',
    fileSize: '840 KB',
    format: 'PDF',
    description: 'Formal risk acknowledgment signed upon account onboarding. Reflects Balanced Growth mandate.',
  },
  {
    id: 'doc-4',
    title: 'Digital Asset Tax & Transaction Summary (2025-2026 YTD)',
    category: 'TAX',
    date: '2026-07-10',
    fileSize: '2.1 MB',
    format: 'CSV',
    description: 'Audited FIFO/LIFO transaction log with realized capital gains/losses calculations for tax reporting.',
  },
  {
    id: 'doc-5',
    title: 'Institutional Custody & Multi-Signature Security Protocol',
    category: 'LEGAL',
    date: '2026-01-20',
    fileSize: '1.8 MB',
    format: 'PDF',
    description: 'Technical disclosure outlining cryptographic key dispersal, geographic redundancy, and offline cold storage safeguards.',
  },
];

const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-27 21:14:02 EST',
    actor: 'Ashley Elvira',
    actorRole: 'MANAGER',
    action: 'Reviewed Marcus Vance portfolio rebalance proposal',
    ipAddress: '198.51.100.42',
    location: 'Boston, MA (US)',
    status: 'SUCCESS',
    details: 'Allocation scenario modeled: ETH 33.3% -> 28.3%, Cash Reserves +5.0%',
  },
  {
    id: 'log-2',
    timestamp: '2026-09-27 18:22:15 EST',
    actor: 'Marcus Vance',
    actorRole: 'CLIENT',
    action: 'Client authenticated via Hardware MFA (FIDO2)',
    ipAddress: '72.14.201.88',
    location: 'Cambridge, MA (US)',
    status: 'SUCCESS',
    details: 'Browser: Chrome 134 on macOS Sequoia · Device ID #DEV-9912',
  },
  {
    id: 'log-3',
    timestamp: '2026-09-26 14:45:10 EST',
    actor: 'Ashley Elvira',
    actorRole: 'MANAGER',
    action: 'Replied to Ticket #t-101 (Portfolio Consultation)',
    ipAddress: '198.51.100.42',
    location: 'Boston, MA (US)',
    status: 'SUCCESS',
    details: 'Sent custom risk-adjusted portfolio strategy brief',
  },
  {
    id: 'log-4',
    timestamp: '2026-09-25 09:30:00 EST',
    actor: 'System Compliance Desk',
    actorRole: 'ADMIN',
    action: 'Sanctions and OFAC automated watchlist screening',
    ipAddress: 'Internal VPC',
    location: 'Massachusetts, US',
    status: 'SUCCESS',
    details: 'All 142 client entities cleared against SDN and international lists',
  },
  {
    id: 'log-5',
    timestamp: '2026-09-24 14:32:00 EST',
    actor: 'Treasury Settlement',
    actorRole: 'ADMIN',
    action: 'Confirmed wire deposit $25,000.00',
    ipAddress: 'Internal VPC',
    location: 'Massachusetts, US',
    status: 'SUCCESS',
    details: 'Funds credited to client cash ledger reference CHI-TX-99824',
  },
];

const initialRegisteredUsers: RegisteredUser[] = [
  {
    id: 'usr-1',
    name: 'Marcus Vance',
    email: 'm.vance@institutional-asset.com',
    password: 'password123',
    phone: '+1 (617) 555-0192',
    role: 'CLIENT',
    approvalStatus: 'APPROVED',
    accountNumber: 'CHI-8849-9210-MV',
    registeredDate: '2024-10-15',
    portfolioValue: '$154,311.76',
    numericBalance: 154311.76,
    lastBalanceUpdate: '2026-09-28 09:00 EST',
    jurisdiction: 'Massachusetts, US',
  },
  {
    id: 'usr-2',
    name: 'Eleanor Wright',
    email: 'e.wright@boston-capital.org',
    password: 'password123',
    phone: '+1 (617) 555-0244',
    role: 'CLIENT',
    approvalStatus: 'APPROVED',
    accountNumber: 'CHI-9021-3411-EW',
    registeredDate: '2025-01-20',
    portfolioValue: '$420,000.00',
    numericBalance: 420000.00,
    lastBalanceUpdate: '2026-09-20 11:30 EST',
    jurisdiction: 'Massachusetts, US',
  },
  {
    id: 'usr-3',
    name: 'David Sterling',
    email: 'd.sterling@sterlingholdings.com',
    password: 'password123',
    phone: '+1 (617) 555-0811',
    role: 'CLIENT',
    approvalStatus: 'PENDING_APPROVAL',
    accountNumber: 'CHI-9912-4011-DS',
    registeredDate: 'Today 14:15 EST',
    portfolioValue: '$0.00',
    numericBalance: 0,
    lastBalanceUpdate: 'Pending Initial Funding',
    jurisdiction: 'Massachusetts, US',
  },
];

const initialAppointments: AppointmentRecord[] = [
  {
    id: 'apt-1',
    referenceId: 'CHI-APT-88210',
    clientName: 'Marcus Vance',
    clientEmail: 'm.vance@institutional-asset.com',
    clientPhone: '+1 (617) 555-0192',
    telegramUsername: '@marcus_vance',
    managerName: COMPANY_DETAILS.accountManager.name,
    managerEmail: COMPANY_DETAILS.accountManager.email,
    managerTelegram: COMPANY_DETAILS.accountManager.telegram,
    consultationType: '7-Day Growth Strategy ($250 Min Plan)',
    date: '2026-10-02',
    timeSlot: '11:30 AM EST',
    medium: 'Telegram Call (@ashleyelvira_fx)',
    notes: 'Reviewing quarterly allocation into 7-day 65% growth cycle and cold custody settlement.',
    status: 'CONFIRMED',
    createdAt: '2026-09-29 14:15 EST',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: dark / light
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chi_theme') as ThemeMode;
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('chi_theme', next);
      }
      showNotification(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`);
      return next;
    });
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
      }
    }
  }, [theme]);

  // Appointments state
  const [appointmentModalOpen, setAppointmentModalOpen] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(initialAppointments);

  const bookAppointment = (aptData: Omit<AppointmentRecord, 'id' | 'referenceId' | 'status' | 'createdAt' | 'managerName' | 'managerEmail' | 'managerTelegram'>) => {
    const ref = `CHI-APT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newApt: AppointmentRecord = {
      ...aptData,
      id: `apt-${Date.now()}`,
      referenceId: ref,
      managerName: COMPANY_DETAILS.accountManager.name,
      managerEmail: COMPANY_DETAILS.accountManager.email,
      managerTelegram: COMPANY_DETAILS.accountManager.telegram,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' EST',
    };

    setAppointments((prev) => [newApt, ...prev]);
    addAuditLog(`Scheduled Appointment #${ref}`, 'SUCCESS', `${newApt.consultationType} on ${newApt.date} at ${newApt.timeSlot}`);
    showNotification(`Appointment ${ref} scheduled with Ashley Elvira. Details logged.`);
    return newApt;
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a))
    );
    addAuditLog(`Cancelled Appointment #${id}`, 'FLAGGED', 'Appointment status set to CANCELLED');
    showNotification('Appointment cancelled.');
  };

  const [currentRole, setCurrentRole] = useState<UserRole>('CLIENT');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(initialRegisteredUsers);
  const [activePage, setActivePage] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [notification, setNotification] = useState<string | null>(null);

  // Deposit modal workflow
  const [depositModalOpen, setDepositModalOpen] = useState<boolean>(false);
  const [selectedDepositPlan, setSelectedDepositPlan] = useState<string>('Starter Digital Strategy ($250 Min)');

  const [user, setUser] = useState<UserProfile>({
    id: 'usr-1',
    name: 'Marcus Vance',
    email: 'm.vance@institutional-asset.com',
    role: 'CLIENT',
    approvalStatus: 'APPROVED',
    kycStatus: 'VERIFIED',
    country: 'United States',
    state: 'Massachusetts',
    phone: '+1 (617) 555-0192',
    accountNumber: 'CHI-8849-9210-MV',
    memberSince: 'October 2024',
    twoFactorEnabled: true,
    assignedManagerId: 'mgr-ashley',
  });

  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    {
      id: 'sess-1',
      device: 'MacBook Pro 16" (macOS Sequoia)',
      browser: 'Chrome 134.0',
      ip: '72.14.201.88',
      location: 'Cambridge, MA, United States',
      isCurrent: true,
      lastActive: 'Active now',
    },
    {
      id: 'sess-2',
      device: 'iPhone 16 Pro (iOS 19)',
      browser: 'Safari Mobile',
      ip: '174.202.91.12',
      location: 'Boston, MA, United States',
      isCurrent: false,
      lastActive: '4 hours ago',
    },
  ]);

  const [portfolio, setPortfolio] = useState<PortfolioSummary>({
    portfolioName: 'Digital Core & Strategic Reserves',
    riskProfile: 'Balanced Growth',
    totalVerifiedValue: 154311.76,
    availableCash: 12570.76,
    investedValue: 141741.0,
    dailyChange: 4120.4,
    dailyChangePercent: 2.74,
    allTimeReturnPercent: 32.8,
    lastRebalancedDate: '2026-09-22',
    assets: [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        allocationPercent: 62.2,
        amount: 1.15,
        currentPrice: 83460.5,
        currentValue: 95979.58,
        costBasis: 68500.0,
        unrealizedPnL: 17204.58,
        unrealizedPnLPercent: 21.8,
        riskRating: 'Moderate',
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        allocationPercent: 24.7,
        amount: 14.18,
        currentPrice: 2685.2,
        currentValue: 38076.14,
        costBasis: 2420.0,
        unrealizedPnL: 3760.54,
        unrealizedPnLPercent: 10.9,
        riskRating: 'Moderate',
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        allocationPercent: 5.0,
        amount: 64.8,
        currentPrice: 118.6,
        currentValue: 7685.28,
        costBasis: 105.0,
        unrealizedPnL: 881.28,
        unrealizedPnLPercent: 12.9,
        riskRating: 'High',
      },
      {
        symbol: 'USD',
        name: 'USD Settlement Reserves',
        allocationPercent: 8.1,
        amount: 12570.76,
        currentPrice: 1.0,
        currentValue: 12570.76,
        costBasis: 12570.76,
        unrealizedPnL: 0.0,
        unrealizedPnLPercent: 0.0,
        riskRating: 'Low',
      },
    ],
  });

  const [marketAssets, setMarketAssets] = useState<MarketAsset[]>(initialMarketAssets);

  // Auto-fetch real-world market prices to match actual trading market
  useEffect(() => {
    let active = true;
    const fetchLivePrices = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,cardano,tether&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true'
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;

        setMarketAssets((prev) =>
          prev.map((asset) => {
            let key = '';
            if (asset.symbol === 'BTC') key = 'bitcoin';
            else if (asset.symbol === 'ETH') key = 'ethereum';
            else if (asset.symbol === 'SOL') key = 'solana';
            else if (asset.symbol === 'XRP') key = 'ripple';
            else if (asset.symbol === 'ADA') key = 'cardano';
            else if (asset.symbol === 'USDT') key = 'tether';

            if (data[key]?.usd) {
              const livePrice = data[key].usd;
              const liveChange = data[key].usd_24h_change ? Number(data[key].usd_24h_change.toFixed(2)) : asset.change24h;
              const liveVol = data[key].usd_24h_vol ? `$${(data[key].usd_24h_vol / 1e9).toFixed(1)}B` : asset.volume24h;
              const liveCap = data[key].usd_market_cap ? (data[key].usd_market_cap >= 1e12 ? `$${(data[key].usd_market_cap / 1e12).toFixed(2)}T` : `$${(data[key].usd_market_cap / 1e9).toFixed(1)}B`) : asset.marketCap;

              return {
                ...asset,
                price: livePrice,
                change24h: liveChange,
                volume24h: liveVol,
                marketCap: liveCap,
                high24h: Number((livePrice * 1.018).toFixed(livePrice < 2 ? 4 : 2)),
                low24h: Number((livePrice * 0.982).toFixed(livePrice < 2 ? 4 : 2)),
              };
            }
            return asset;
          })
        );
      } catch (e) {
        // Fallback gracefully to pristine verified values
      }
    };

    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 35000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactions);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [documents] = useState<DocumentRecord[]>(initialDocuments);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);

  const [ashleyMessages, setAshleyMessages] = useState([
    {
      id: 'am-1',
      sender: 'ashley' as const,
      text: 'Good morning Marcus. This is Ashley Elvira, your dedicated Account Manager. I am reviewing the institutional flow metrics for Bitcoin ahead of the week. Please let me know whenever you would like to run through your asset allocations or schedule a call.',
      time: 'Yesterday 10:15 AM',
    },
    {
      id: 'am-2',
      sender: 'client' as const,
      text: 'Thanks Ashley! The updated quarterly statement looks very comprehensive. I appreciate the emphasis on cold custody.',
      time: 'Yesterday 02:40 PM',
    },
    {
      id: 'am-3',
      sender: 'ashley' as const,
      text: 'My pleasure Marcus. Maintaining multi-signature cold storage and strict transparent records is our standard priority at Crypto Hub Investments.',
      time: 'Yesterday 03:02 PM',
    },
  ]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((current) => (current === msg ? null : current));
    }, 4500);
  };

  const updateUser = (fields: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...fields }));
    showNotification('Profile and preferences updated successfully.');
  };

  const revokeSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    addAuditLog('Revoked active device session', 'SUCCESS', `Session ID: ${sessionId}`);
    showNotification('Session revoked. Required re-authentication on remote device.');
  };

  const addTransaction = (tx: Omit<TransactionRecord, 'id' | 'referenceId'>) => {
    const newTx: TransactionRecord = {
      ...tx,
      id: `tx-${Date.now()}`,
      referenceId: `CHI-TX-${Math.floor(10000 + Math.random() * 90000)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    addAuditLog(`New Transaction Initiated (${tx.type})`, 'SUCCESS', `Ref ${newTx.referenceId} for $${tx.amount.toLocaleString()}`);
    showNotification(`Transaction ${newTx.referenceId} submitted for verified execution.`);
  };

  const updateTransactionStatus = (id: string, status: TransactionRecord['status']) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    addAuditLog(`Transaction Status Updated`, 'SUCCESS', `Tx ID ${id} set to ${status}`);
    showNotification(`Transaction updated to: ${status}`);
  };

  const rebalancePortfolio = (newHoldings: { symbol: string; percent: number }[]) => {
    const total = portfolio.totalVerifiedValue;
    const updatedAssets = portfolio.assets.map((asset) => {
      const match = newHoldings.find((h) => h.symbol === asset.symbol);
      const percent = match ? match.percent : asset.allocationPercent;
      const targetVal = (total * percent) / 100;
      const targetAmt = targetVal / asset.currentPrice;
      return {
        ...asset,
        allocationPercent: percent,
        amount: targetAmt,
        currentValue: targetVal,
      };
    });

    setPortfolio((prev) => ({
      ...prev,
      assets: updatedAssets,
      lastRebalancedDate: new Date().toISOString().split('T')[0],
    }));

    addAuditLog('Executed portfolio target rebalance', 'SUCCESS', 'Targets updated');
    showNotification('Portfolio targets successfully rebalanced and queued.');
  };

  const createTicket = (
    subject: string,
    category: SupportTicket['category'],
    initialMessage: string,
    priority: SupportTicket['priority'] = 'NORMAL'
  ) => {
    const newTicket: SupportTicket = {
      id: `t-${Date.now().toString().slice(-4)}`,
      clientId: user.id,
      clientName: user.name,
      subject,
      category,
      status: 'OPEN',
      priority,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      messages: [
        {
          id: `m-${Date.now()}`,
          senderId: user.id,
          senderName: user.name,
          senderRole: currentRole,
          text: initialMessage,
          timestamp: 'Just now',
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);
    addAuditLog(`Created Support Ticket #${newTicket.id}`, 'SUCCESS', subject);
    showNotification(`Support ticket #${newTicket.id} created. Routed to Account Management.`);
  };

  const replyToTicket = (ticketId: string, text: string) => {
    const reply: SupportMessage = {
      id: `m-${Date.now()}`,
      senderId: currentRole === 'CLIENT' ? user.id : currentRole === 'MANAGER' ? 'mgr-ashley' : 'admin-ops',
      senderName: currentRole === 'CLIENT' ? user.name : currentRole === 'MANAGER' ? COMPANY_DETAILS.accountManager.name : 'Compliance Admin',
      senderRole: currentRole,
      text,
      timestamp: 'Just now',
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              updatedAt: 'Just now',
              messages: [...t.messages, reply],
            }
          : t
      )
    );
    addAuditLog(`Replied to Support Ticket #${ticketId}`, 'SUCCESS', `By ${reply.senderName}`);
    showNotification('Response sent.');
  };

  const sendAshleyMessage = (text: string) => {
    const newMsg = {
      id: `am-${Date.now()}`,
      sender: 'client' as const,
      text,
      time: 'Just now',
    };
    setAshleyMessages((prev) => [...prev, newMsg]);

    // Simulated authentic manager response after brief interval
    setTimeout(() => {
      setAshleyMessages((prev) => [
        ...prev,
        {
          id: `am-${Date.now() + 1}`,
          sender: 'ashley' as const,
          text: `Thank you for your message, Marcus. I have logged your request in our Massachusetts client management queue and will review the specific parameters with our analysis team shortly. You can also reach me directly at ${COMPANY_DETAILS.accountManager.email}.`,
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  const registerClient = (name: string, email: string, password = 'password123', phone = '') => {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser: RegisteredUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      password,
      phone,
      role: 'CLIENT',
      approvalStatus: 'PENDING_APPROVAL',
      accountNumber: `CHI-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-MV`,
      registeredDate: new Date().toISOString().split('T')[0],
      portfolioValue: '$0.00',
      jurisdiction: 'Massachusetts, US',
    };

    setRegisteredUsers((prev) => [newUser, ...prev]);
    addAuditLog('New client application submitted', 'SUCCESS', `${name} (${trimmedEmail}) - Pending Admin Review`);
    showNotification('Registration application received. Awaiting administrator approval.');
    return {
      success: true,
      message: 'Registration submitted successfully! Your account application has been submitted to the compliance administrator for approval. You will be able to log in once approved.',
    };
  };

  const approveUser = (userId: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, approvalStatus: 'APPROVED' } : u))
    );
    const target = registeredUsers.find((u) => u.id === userId);
    addAuditLog('Admin approved client account', 'SUCCESS', `Account #${target?.accountNumber} (${target?.name})`);
    showNotification(`Account for ${target?.name || 'client'} has been APPROVED.`);
  };

  const rejectUser = (userId: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, approvalStatus: 'REJECTED' } : u))
    );
    const target = registeredUsers.find((u) => u.id === userId);
    addAuditLog('Admin rejected client application', 'FLAGGED', `Registration #${userId} (${target?.name})`);
    showNotification(`Registration for ${target?.name || 'client'} was declined.`);
  };

  const updateClientBalance = (userId: string, newBalance: number) => {
    const formatted = `$${newBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const nowStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST';
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              portfolioValue: formatted,
              numericBalance: newBalance,
              lastBalanceUpdate: nowStr,
            }
          : u
      )
    );
    const target = registeredUsers.find((u) => u.id === userId);
    // If the active portal corresponds to this user, update live portfolio state too
    if (target && (target.email.toLowerCase() === user.email.toLowerCase() || target.name === user.name)) {
      setPortfolio((prev) => ({
        ...prev,
        totalVerifiedValue: newBalance,
        investedValue: Math.max(0, newBalance - prev.availableCash),
      }));
    }
    addAuditLog('Admin updated client balance', 'SUCCESS', `Client: ${target?.name || userId} (${target?.accountNumber}) -> Set to ${formatted}`);
    showNotification(`Portfolio balance for ${target?.name || 'client'} updated to ${formatted}.`);
  };

  const resetClientPassword = (userId: string, customToken?: string): string => {
    const target = registeredUsers.find((u) => u.id === userId);
    const token = customToken || `SEC-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: token } : u))
    );
    addAuditLog('Admin updated client authentication credential', 'SUCCESS', `Client: ${target?.name || userId} (${target?.accountNumber})`);
    showNotification(`Temporary password token assigned to ${target?.name || 'client'}.`);
    return token;
  };

  const login = (usernameOrEmail: string, password: string): { success: boolean; message?: string } => {
    const trimmed = usernameOrEmail.trim().toLowerCase();
    if (trimmed === 'admin') {
      if (password === 'admin') {
        setIsAuthenticated(true);
        setCurrentRole('ADMIN');
        setUser({
          ...user,
          name: 'Executive Oversight Administrator',
          email: 'admin@cryptohubinvestments.com',
          role: 'ADMIN',
          approvalStatus: 'APPROVED',
        });
        setActivePage('admin-dashboard');
        addAuditLog('Admin signed in successfully', 'SUCCESS', 'Admin master console accessed');
        showNotification('Authenticated as Administrator.');
        return { success: true };
      } else {
        return { success: false, message: 'Invalid administrator credentials. Access denied.' };
      }
    }

    if (trimmed === 'ashleyelvira35@gmail.com') {
      setIsAuthenticated(true);
      setCurrentRole('MANAGER');
      setUser({
        ...user,
        name: 'Ashley Elvira',
        email: 'ashleyelvira35@gmail.com',
        role: 'MANAGER',
        approvalStatus: 'APPROVED',
      });
      setActivePage('admin-clients');
      addAuditLog('Account Manager Ashley Elvira signed in', 'SUCCESS', 'Client management desk accessed');
      showNotification('Authenticated as Account Manager: Ashley Elvira.');
      return { success: true };
    }

    // Check against registered users
    const matchedUser = registeredUsers.find((u) => u.email.toLowerCase() === trimmed);
    if (!matchedUser) {
      return {
        success: false,
        message: 'Account not found. Please click "Open Investor Account" to submit a registration application.',
      };
    }

    if (matchedUser.approvalStatus === 'PENDING_APPROVAL') {
      return {
        success: false,
        message: 'Your account registration is currently PENDING ADMINISTRATOR APPROVAL. An administrator must approve your application before you can access the platform.',
      };
    }

    if (matchedUser.approvalStatus === 'REJECTED') {
      return {
        success: false,
        message: 'This account registration was not approved by compliance. Please contact support.',
      };
    }

    // Authenticated Approved Client
    setIsAuthenticated(true);
    setCurrentRole('CLIENT');
    setUser({
      ...user,
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: 'CLIENT',
      accountNumber: matchedUser.accountNumber,
      approvalStatus: 'APPROVED',
    });
    setActivePage('dashboard');
    addAuditLog('Client session established', 'SUCCESS', `Client: ${matchedUser.name} (${matchedUser.accountNumber})`);
    showNotification(`Welcome back, ${matchedUser.name}.`);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentRole('CLIENT');
    setActivePage('home');
    showNotification('Signed out securely.');
  };

  const submitDepositRequest = (planName: string, amount: number, notes?: string) => {
    const refId = `CHI-DEP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      referenceId: refId,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
      type: 'DEPOSIT',
      description: `Inbound Capital Allocation - ${planName}${notes ? ` (${notes})` : ''}`,
      amount,
      currency: 'USD',
      status: 'UNDER_REVIEW',
      fee: 0,
      destinationOrSource: `Wire Inbound (Assigned Manager: ${COMPANY_DETAILS.accountManager.name} · ${COMPANY_DETAILS.accountManager.email})`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Send notification message to Ashley Elvira channel
    const msg = {
      id: `am-${Date.now()}`,
      sender: 'client' as const,
      text: `Hello Ashley, I have submitted an inbound allocation request for the ${planName} ($${amount.toLocaleString()} USD). Reference: ${refId}. Please coordinate the secure wire and custodial routing details.`,
      time: 'Just now',
    };
    setAshleyMessages((prev) => [...prev, msg]);

    setTimeout(() => {
      setAshleyMessages((prev) => [
        ...prev,
        {
          id: `am-${Date.now() + 1}`,
          sender: 'ashley' as const,
          text: `Inbound deposit request for ${planName} ($${amount.toLocaleString()} USD, Ref ${refId}) received. I am verifying your custodial sub-account parameters and will assist you directly. You can also reach me at ${COMPANY_DETAILS.accountManager.email}.`,
          time: 'Just now',
        },
      ]);
    }, 1500);

    addAuditLog(`Deposit Request Submitted (${refId})`, 'SUCCESS', `$${amount.toLocaleString()} for ${planName}`);
    showNotification(`Deposit request ${refId} submitted. Ashley Elvira has been notified.`);
    setDepositModalOpen(false);
  };

  const addAuditLog = (action: string, status: 'SUCCESS' | 'FLAGGED' | 'BLOCKED' = 'SUCCESS', details = '') => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' EST',
      actor: currentRole === 'CLIENT' ? user.name : currentRole === 'MANAGER' ? COMPANY_DETAILS.accountManager.name : 'Chief Compliance Officer',
      actorRole: currentRole,
      action,
      ipAddress: '198.51.100.42',
      location: 'Massachusetts, US',
      status,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        appointmentModalOpen,
        setAppointmentModalOpen,
        appointments,
        bookAppointment,
        cancelAppointment,
        currentRole,
        setCurrentRole,
        isAuthenticated,
        login,
        logout,
        activePage,
        setActivePage,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        depositModalOpen,
        setDepositModalOpen,
        selectedDepositPlan,
        setSelectedDepositPlan,
        submitDepositRequest,
        registeredUsers,
        registerClient,
        approveUser,
        rejectUser,
        updateClientBalance,
        resetClientPassword,
        user,
        updateUser,
        activeSessions,
        revokeSession,
        portfolio,
        rebalancePortfolio,
        marketAssets,
        transactions,
        addTransaction,
        updateTransactionStatus,
        tickets,
        createTicket,
        replyToTicket,
        ashleyMessages,
        sendAshleyMessage,
        documents,
        auditLogs,
        addAuditLog,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
