export type UserRole = 'CLIENT' | 'MANAGER' | 'ADMIN';

export type KYCStatus = 'NOT_SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'TIER_2_ENHANCED';

export type TransactionType = 'DEPOSIT' | 'ALLOCATION' | 'REBALANCE' | 'WITHDRAWAL' | 'FEE' | 'YIELD';

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'UNDER_REVIEW' | 'FAILED' | 'CANCELLED';

export type AccountApprovalStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  approvalStatus: AccountApprovalStatus;
  accountNumber: string;
  registeredDate: string;
  portfolioValue?: string;
  numericBalance?: number;
  lastBalanceUpdate?: string;
  jurisdiction?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  approvalStatus: AccountApprovalStatus;
  avatarUrl?: string;
  kycStatus: KYCStatus;
  country: string;
  state: string;
  phone?: string;
  accountNumber: string;
  memberSince: string;
  twoFactorEnabled: boolean;
  assignedManagerId?: string;
}

export interface PortfolioAsset {
  symbol: string;
  name: string;
  allocationPercent: number;
  amount: number;
  currentPrice: number;
  currentValue: number;
  costBasis: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  riskRating: 'Low' | 'Moderate' | 'High' | 'Very High';
}

export interface PortfolioSummary {
  portfolioName: string;
  riskProfile: 'Conservative Digital' | 'Balanced Growth' | 'Tactical High-Conviction';
  totalVerifiedValue: number;
  availableCash: number;
  investedValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  allTimeReturnPercent: number;
  lastRebalancedDate: string;
  assets: PortfolioAsset[];
}

export interface TransactionRecord {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  referenceId: string;
  fee: number;
  destinationOrSource: string;
}

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  clientId: string;
  clientName: string;
  subject: string;
  category: 'ACCOUNT' | 'PORTFOLIO' | 'COMPLIANCE' | 'SECURITY' | 'TECHNICAL' | 'GENERAL';
  status: 'OPEN' | 'PENDING' | 'CLOSED';
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export interface DocumentRecord {
  id: string;
  title: string;
  category: 'STATEMENT' | 'REPORT' | 'DISCLOSURE' | 'TAX' | 'LEGAL';
  date: string;
  fileSize: string;
  format: 'PDF' | 'CSV';
  description: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  ipAddress: string;
  location: string;
  status: 'SUCCESS' | 'FLAGGED' | 'BLOCKED';
  details: string;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  marketCap: string;
  sparkline: number[];
  category: 'Store of Value' | 'Smart Contracts' | 'Layer 1' | 'DeFi' | 'Stablecoin';
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  isCurrent: boolean;
  lastActive: string;
}

export type ThemeMode = 'dark' | 'light';

export interface AppointmentRecord {
  id: string;
  referenceId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  telegramUsername?: string;
  managerName: string;
  managerEmail: string;
  managerTelegram: string;
  consultationType: string;
  date: string;
  timeSlot: string;
  medium: string;
  notes?: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

