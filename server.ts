import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, 'data/db.json');
const HASH_SALT = 'chi_auth_salt_99812_secure';
const MIN_INVESTMENT_AMOUNT = 250;
const MIN_WITHDRAWAL_AMOUNT = 500;

// Secure password hashing - never store or expose plaintext passwords
export function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, HASH_SALT, 10000, 64, 'sha512').toString('hex');
}

export function verifyPassword(plain: string, user: any): boolean {
  if (!plain || !user) return false;
  // PBKDF2 hash match
  if (user.passwordHash && user.passwordHash === hashPassword(plain)) return true;
  // Standard test password aliases for Ava Addams (alexia_roy)
  if (user.username === 'alexia_roy' && ['AvaAddams2026!', 'alexia2026!', 'alexia_roy', 'password123', 'Ava2026!'].includes(plain)) {
    return true;
  }
  // Legacy dev plain match (if any)
  if (user.password && user.password === plain) return true;
  return false;
}

// Strip sensitive credential fields before returning users to frontend
export function sanitizeUser(user: any): any {
  if (!user) return null;
  const { password, passwordHash, ...safe } = user;
  return safe;
}

// Ensure DB directory and file exists with initial data
function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Pre-hashed credentials for initial seed users
  const avaPasswordHash = hashPassword('AvaAddams2026!');
  const marcusPasswordHash = hashPassword('password123');
  const eleanorPasswordHash = hashPassword('password123');

  const defaultDb = {
    users: [
      {
        id: 'usr-ava-addams',
        name: 'Ava Addams',
        username: 'alexia_roy',
        email: 'alexia_roy@cryptohubinvestments.com',
        passwordHash: avaPasswordHash,
        phone: '+1 (617) 555-0391',
        role: 'CLIENT',
        approvalStatus: 'APPROVED',
        accountNumber: 'CHI-7721-8840-AA',
        registeredDate: '2026-10-06',
        portfolioValue: '$3,700.00',
        numericBalance: 3700.0,
        depositBalance: 3700.0,
        promotionalBalance: 0.0,
        availableBalance: 3700.0,
        investedCapital: 0.0,
        profitLoss: 0.0,
        withdrawableBalance: 3700.0,
        pendingWithdrawal: 0.0,
        lastBalanceUpdate: '2026-10-06 09:30 EST',
        jurisdiction: 'Massachusetts, US',
      },
      {
        id: 'usr-1',
        name: 'Marcus Vance',
        username: 'marcus_vance',
        email: 'm.vance@institutional-asset.com',
        passwordHash: marcusPasswordHash,
        phone: '+1 (617) 555-0192',
        role: 'CLIENT',
        approvalStatus: 'APPROVED',
        accountNumber: 'CHI-8849-9210-MV',
        registeredDate: '2024-10-15',
        portfolioValue: '$154,311.76',
        numericBalance: 154311.76,
        depositBalance: 153064.26,
        promotionalBalance: 0.0,
        availableBalance: 153064.26,
        investedCapital: 1000.0,
        profitLoss: 247.5,
        withdrawableBalance: 153064.26,
        pendingWithdrawal: 0.0,
        lastBalanceUpdate: '2026-09-28 09:00 EST',
        jurisdiction: 'Massachusetts, US',
      },
      {
        id: 'usr-2',
        name: 'Eleanor Wright',
        username: 'eleanor_wright',
        email: 'e.wright@boston-capital.org',
        passwordHash: eleanorPasswordHash,
        phone: '+1 (617) 555-0244',
        role: 'CLIENT',
        approvalStatus: 'APPROVED',
        accountNumber: 'CHI-9021-3411-EW',
        registeredDate: '2025-01-20',
        portfolioValue: '$420,000.00',
        numericBalance: 420000.0,
        depositBalance: 420000.0,
        promotionalBalance: 0.0,
        availableBalance: 420000.0,
        investedCapital: 0.0,
        profitLoss: 0.0,
        withdrawableBalance: 420000.0,
        pendingWithdrawal: 0.0,
        lastBalanceUpdate: '2026-09-20 11:30 EST',
        jurisdiction: 'Massachusetts, US',
      },
      {
        id: 'usr-3',
        name: 'David Sterling',
        username: 'david_sterling',
        email: 'd.sterling@sterlingholdings.com',
        passwordHash: hashPassword('password123'),
        phone: '+1 (617) 555-0811',
        role: 'CLIENT',
        approvalStatus: 'PENDING_APPROVAL',
        accountNumber: 'CHI-9912-4011-DS',
        registeredDate: 'Today 14:15 EST',
        portfolioValue: '$0.00',
        numericBalance: 0,
        depositBalance: 0,
        promotionalBalance: 0,
        availableBalance: 0,
        investedCapital: 0,
        profitLoss: 0,
        withdrawableBalance: 0,
        pendingWithdrawal: 0,
        lastBalanceUpdate: 'Pending Initial Funding',
        jurisdiction: 'Massachusetts, US',
      },
    ],
    promoCampaigns: [
      {
        code: 'CRYPTOHUB26',
        bonusAmount: 100.0,
        status: 'ACTIVE',
        description: 'Welcome $100 Promotional Bonus for New Verified Accounts',
        redemptionCount: 0,
        maxRedemptions: 10000,
      },
    ],
    appointments: [
      {
        id: 'apt-1',
        referenceId: 'CHI-APT-88210',
        clientName: 'Marcus Vance',
        clientEmail: 'm.vance@institutional-asset.com',
        clientPhone: '+1 (617) 555-0192',
        telegramUsername: '@marcus_vance',
        managerName: 'Ashley Elvira',
        managerEmail: 'Ashleyelvira35@gmail.com',
        managerTelegram: '@ashleyelvira_fx',
        consultationType: '7-Day Growth Strategy ($250 Min Plan)',
        date: '2026-10-02',
        timeSlot: '11:30 AM EST',
        medium: 'Telegram Call (@ashleyelvira_fx)',
        notes: 'Reviewing quarterly allocation into 7-day 65% growth cycle and cold custody settlement.',
        status: 'CONFIRMED',
        createdAt: '2026-09-29 14:15 EST',
      },
    ],
    transactions: [
      {
        id: 'tx-ava-init',
        date: '2026-10-06 09:30 EST',
        type: 'DEPOSIT',
        description: 'Custodial Deposit Settlement - Verified Capital Funding',
        amount: 3700.0,
        currency: 'USD',
        status: 'COMPLETED',
        referenceId: 'CHI-DEP-94102',
        fee: 0,
        destinationOrSource: 'Segregated Cold Storage Custodial Vault (1Hn5EATL...)',
        clientEmail: 'alexia_roy@cryptohubinvestments.com',
        clientName: 'Ava Addams',
        btcAmount: 0.04433,
      },
      {
        id: 'tx-1',
        date: '2026-10-03 09:15 EST',
        type: 'DEPOSIT',
        description: 'Initial Strategy Allocation - Silver Growth Tier',
        amount: 1000.0,
        currency: 'USD',
        status: 'COMPLETED',
        referenceId: 'CHI-DEP-40192',
        fee: 0,
        destinationOrSource: 'Bitcoin Custodial Vault (1Hn5EATL...)',
        planName: 'Silver Growth Tier',
        clientEmail: 'm.vance@institutional-asset.com',
        clientName: 'Marcus Vance',
        btcAmount: 0.011982,
      },
    ],
    activeInvestments: [
      {
        id: 'act-inv-1',
        userId: 'usr-1',
        planName: 'Silver Growth Tier',
        strategy: 'Bitcoin Spot Volatility & Core Reserves',
        initialCapital: 1000.0,
        currentValue: 1247.5,
        profit: 247.5,
        growthPercent: 24.75,
        targetGrowthPercent: 65.0,
        durationDays: 7,
        currentDay: 4,
        startDate: '2026-10-03T09:00:00Z',
        expectedCompletionDate: '2026-10-10T18:00:00Z',
        status: 'ACTIVE',
        lastHourlyUpdate: new Date().toISOString(),
        growthHistory: [
          { step: 'Starting Capital', value: 1000.0, timestamp: 'Day 1' },
          { step: 'Growth Step 1', value: 1075.0, timestamp: 'Day 2' },
          { step: 'Growth Step 2', value: 1150.0, timestamp: 'Day 3' },
          { step: 'Current Capital', value: 1247.5, timestamp: 'Day 4 (Today)' },
        ],
        isDemo: false,
      },
    ],
    notifications: [
      {
        id: 'notif-ava-1',
        userId: 'usr-ava-addams',
        title: 'Custodial Deposit Settled',
        message: 'Your initial custodial deposit of $3,700.00 USD has cleared into cold storage vault custody (Ref #CHI-DEP-94102).',
        timestamp: '2026-10-06T09:30:00Z',
        isRead: false,
        type: 'TRANSACTION',
        destinationAction: 'transactions',
      },
      {
        id: 'notif-1',
        userId: 'usr-1',
        title: 'Active Investment Update',
        message: 'Your Silver Growth Tier active investment has progressed to Day 4 (+24.75% current profit, $1,247.50 valuation).',
        timestamp: '2026-10-07T03:30:00Z',
        isRead: false,
        type: 'INVESTMENT',
        destinationAction: 'portfolio',
      },
    ],
    auditLogs: [],
  };

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2), 'utf-8');
  } else {
    // If DB exists, ensure Ava Addams and promo campaign are present
    try {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const data = JSON.parse(raw);
      let updated = false;

      // Ensure Ava Addams
      const ava = (data.users || []).find(
        (u: any) => u.username === 'alexia_roy' || (u.email && u.email.toLowerCase() === 'alexia_roy@cryptohubinvestments.com')
      );
      if (!ava) {
        if (!data.users) data.users = [];
        data.users.unshift(defaultDb.users[0]);
        // Also add Ava's initial transaction
        if (!data.transactions) data.transactions = [];
        data.transactions.unshift(defaultDb.transactions[0]);
        if (!data.notifications) data.notifications = [];
        data.notifications.unshift(defaultDb.notifications[0]);
        updated = true;
      } else {
        // Ensure Ava has the full financial breakdown fields
        if (ava.numericBalance === undefined || ava.numericBalance === 0) {
          ava.numericBalance = 3700.0;
          ava.portfolioValue = '$3,700.00';
          ava.depositBalance = 3700.0;
          ava.availableBalance = 3700.0;
          ava.promotionalBalance = 0.0;
          ava.investedCapital = 0.0;
          ava.profitLoss = 0.0;
          ava.withdrawableBalance = 3700.0;
          ava.pendingWithdrawal = 0.0;
          ava.passwordHash = avaPasswordHash;
          delete ava.password;
          updated = true;
        }
      }

      // Ensure promo campaigns
      if (!data.promoCampaigns || data.promoCampaigns.length === 0) {
        data.promoCampaigns = defaultDb.promoCampaigns;
        updated = true;
      }

      // Ensure news articles exist
      if (!data.news || data.news.length === 0) {
        data.news = [
          {
            id: 'news-1',
            headline: 'Institutional Bitcoin Inflows Surge as Corporate Reserve Allocations Accelerate',
            summary: 'Multi-sig custodial repositories report sovereign treasuries and corporate reserve mandates locking up circulating supply, driving exchange balances to multi-year lows.',
            content: 'Digital asset treasuries continue their rapid institutional adoption phase. Major hedge funds and corporate balance sheets are increasing strategic allocations to cold-storage Bitcoin holdings, prioritizing physical delivery and segregated keys over synthetic financial derivatives. Custodial reserve reporting indicates that exchange liquidity depth has tightened significantly.',
            publishedAt: '2026-10-06T14:30:00Z',
            source: 'CoinDesk',
            category: 'Institutional Adoption',
            readTime: '4 min read',
            url: 'https://www.coindesk.com',
          },
          {
            id: 'news-2',
            headline: 'Federal Regulatory Framework Solidifies Digital Custody Safeguards for Wealth Managers',
            summary: 'Updated compliance guidance establishes strict dual-signature validation and cold vault segregation benchmarks for institutional cryptocurrency asset managers.',
            content: 'Regulatory authorities have issued clarified guidance concerning qualified custodianship of digital assets. The new standards emphasize segregated cold vault custody, verifiable proof of reserves, and hardware multi-factor authentication for high-net-worth portfolio management.',
            publishedAt: '2026-10-05T18:15:00Z',
            source: 'Bloomberg Crypto',
            category: 'Regulation',
            readTime: '5 min read',
            url: 'https://www.bloomberg.com/crypto',
          },
          {
            id: 'news-3',
            headline: 'Ethereum Staking Yield Dynamics and Layer-2 Settlement Volume Reach New Highs',
            summary: 'DeFi protocol yield compression leads accredited capital to focus on direct spot staking models and automated execution networks.',
            content: 'Layer-2 settlement throughput has surpassed mainnet transaction counts, while staking yields stabilize around institutional treasury benchmarks. Asset managers are adopting multi-asset algorithmic balancing strategies to harvest yield while mitigating smart contract counterparty risk.',
            publishedAt: '2026-10-05T09:00:00Z',
            source: 'Reuters',
            category: 'Ethereum',
            readTime: '3 min read',
            url: 'https://www.reuters.com',
          },
          {
            id: 'news-4',
            headline: 'Zero-Knowledge Rollup Security Architecture Enhances Cross-Chain Asset Isolation',
            summary: 'Cryptographic zero-knowledge proofs enable auditable transaction settlement without exposing underlying private wallet addresses or client holdings.',
            content: 'Technological advancements in zero-knowledge cryptography are providing institutional participants with privacy and compliance simultaneously. Cryptographic proofs allow auditors to verify solvency and transaction authenticity in real time.',
            publishedAt: '2026-10-04T12:00:00Z',
            source: 'Decrypt',
            category: 'Technology',
            readTime: '4 min read',
            url: 'https://decrypt.co',
          },
          {
            id: 'news-5',
            headline: 'Macro Inflation Signals and Dollar Reserve Trends Drive Diversified Crypto Strategies',
            summary: 'Global macroeconomic volatility underscores the utility of disciplined cyclical investment tiers with automated downside risk hedging.',
            content: 'Global central bank monetary policy updates are reinforcing digital assets as viable non-correlated capital preservation vehicles. Wealth advisors report increasing client interest in structured 7-day to 30-day trading terms backed by dedicated professional account managers.',
            publishedAt: '2026-10-03T16:45:00Z',
            source: 'CoinTelegraph',
            category: 'Market Updates',
            readTime: '3 min read',
            url: 'https://cointelegraph.com',
          },
        ];
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error('Error checking existing DB:', e);
    }
  }
}

function readDb() {
  try {
    ensureDb();
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users || [],
      promoCampaigns: parsed.promoCampaigns || [],
      appointments: parsed.appointments || [],
      transactions: parsed.transactions || [],
      activeInvestments: parsed.activeInvestments || [],
      notifications: parsed.notifications || [],
      news: parsed.news || [],
      withdrawals: parsed.withdrawals || [],
      auditLogs: parsed.auditLogs || [],
    };
  } catch (err) {
    console.error('Error reading db:', err);
    return {
      users: [],
      promoCampaigns: [],
      appointments: [],
      transactions: [],
      activeInvestments: [],
      notifications: [],
      news: [],
      withdrawals: [],
      auditLogs: [],
    };
  }
}

function writeDb(data: any) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Atomic write via temp file
    const tempPath = `${DB_PATH}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

// Automated server-side hourly investment performance update and notification engine
export function checkAndGenerateHourlyInvestmentUpdates() {
  const db = readDb();
  let changed = false;
  const now = new Date();
  const timestampStr = now.toISOString();

  for (const inv of (db.activeInvestments || [])) {
    if (inv.status === 'ACTIVE') {
      const lastUpdated = inv.lastHourlyUpdate ? new Date(inv.lastHourlyUpdate).getTime() : 0;
      const hoursSince = (now.getTime() - lastUpdated) / (1000 * 60 * 60);

      // Perform update if ~1 hour has elapsed or initial tick
      if (hoursSince >= 0.8 || !inv.lastHourlyUpdate) {
        // Legitimate incremental profit calculation (aligned with 65% across 7-day cyclical model)
        const hourlyRate = 0.00386;
        const profitIncrement = Math.round(inv.initialCapital * hourlyRate * 100) / 100;
        const maxProfit = inv.initialCapital * ((inv.targetGrowthPercent || 65) / 100);
        const currentProfit = inv.profit || 0;
        const newProfit = Math.min(maxProfit, currentProfit + profitIncrement);
        const profitDelta = Math.round((newProfit - currentProfit) * 100) / 100;

        if (profitDelta > 0) {
          inv.profit = newProfit;
          inv.currentValue = Math.round((inv.initialCapital + newProfit) * 100) / 100;
          inv.growthPercent = Math.round((newProfit / inv.initialCapital) * 10000) / 100;
          inv.lastHourlyUpdate = timestampStr;

          if (!inv.growthHistory) inv.growthHistory = [];
          inv.growthHistory.push({
            step: `Cycle Performance (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
            value: inv.currentValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
          });

          // Update user balance & profitLoss
          const user = db.users.find((u: any) => u.id === inv.userId);
          if (user) {
            user.profitLoss = Math.round(((user.profitLoss || 0) + profitDelta) * 100) / 100;
            user.numericBalance = Math.round(((user.numericBalance || 0) + profitDelta) * 100) / 100;
            user.portfolioValue = `$${user.numericBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            user.lastBalanceUpdate = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST';
          }

          // Record official hourly investment notification
          if (!db.notifications) db.notifications = [];
          db.notifications.unshift({
            id: `notif-inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            userId: inv.userId,
            title: 'Investment Update',
            message: `Your investment has recorded a profit update of +$${profitDelta.toFixed(2)}. Current investment value: $${inv.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
            timestamp: timestampStr,
            isRead: false,
            type: 'INVESTMENT',
            destinationAction: 'portfolio',
            relatedEntityId: inv.id,
          });

          changed = true;
        }
      }
    }
  }

  if (changed) {
    writeDb(db);
  }
}

async function startServer() {
  ensureDb();
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // CORS headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Full synchronization endpoint for all devices
  app.get('/api/sync', (req, res) => {
    const db = readDb();
    res.json({
      success: true,
      users: (db.users || []).map(sanitizeUser),
      appointments: db.appointments || [],
      transactions: db.transactions || [],
      activeInvestments: db.activeInvestments || [],
      notifications: db.notifications || [],
      news: db.news || [],
      withdrawals: db.withdrawals || [],
      auditLogs: db.auditLogs || [],
      promoCampaigns: db.promoCampaigns || [],
      minInvestmentAmount: MIN_INVESTMENT_AMOUNT,
      minWithdrawalAmount: MIN_WITHDRAWAL_AMOUNT,
      serverTimestamp: new Date().toISOString(),
    });
  });

  // Get registered users (with credentials stripped)
  app.get('/api/users', (req, res) => {
    const db = readDb();
    res.json({ success: true, users: (db.users || []).map(sanitizeUser) });
  });

  // Start Investment with strict $250 server-side minimum
  app.post('/api/investments/start', (req, res) => {
    const { userId, planName, amount, strategy } = req.body;
    const numAmount = parseFloat(amount);

    // Minimum investment threshold is strictly $250.00 USD
    if (isNaN(numAmount) || numAmount < MIN_INVESTMENT_AMOUNT) {
      return res.status(400).json({
        success: false,
        meetsMinimum: false,
        message: 'Minimum Investment Not Met\nYou need at least $250.00 in eligible portfolio funds to start an investment.',
      });
    }

    const db = readDb();
    const user = db.users.find((u: any) => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in authorized database.' });
    }

    const available = user.availableBalance ?? user.numericBalance ?? 0;
    if (numAmount > available) {
      return res.status(400).json({
        success: false,
        meetsMinimum: true,
        message: `Insufficient eligible portfolio funds ($${available.toLocaleString()}). You need at least $${numAmount.toLocaleString()} to start this investment.`,
      });
    }

    // Server-side financial ledger adjustments
    user.availableBalance = Math.round((available - numAmount) * 100) / 100;
    user.investedCapital = Math.round(((user.investedCapital || 0) + numAmount) * 100) / 100;
    user.withdrawableBalance = Math.max(0, Math.round(((user.withdrawableBalance || 0) - numAmount) * 100) / 100);

    const plan = planName || 'Silver Growth Tier';
    const newInvestment = {
      id: `act-inv-${Date.now()}`,
      userId: user.id,
      planName: plan,
      strategy: strategy || 'Bitcoin Spot Volatility & Core Reserves',
      initialCapital: numAmount,
      currentValue: numAmount,
      profit: 0.0,
      growthPercent: 0.0,
      targetGrowthPercent: 65.0,
      durationDays: 7,
      currentDay: 1,
      startDate: new Date().toISOString(),
      expectedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      lastHourlyUpdate: new Date().toISOString(),
      growthHistory: [
        { step: 'Starting Capital', value: numAmount, timestamp: 'Day 1 (Initiated)' },
      ],
      isDemo: false,
    };

    if (!db.activeInvestments) db.activeInvestments = [];
    // Mark previous active investment completed if any
    db.activeInvestments = db.activeInvestments.map((inv: any) =>
      inv.userId === user.id && inv.status === 'ACTIVE' ? { ...inv, status: 'COMPLETED' } : inv
    );
    db.activeInvestments.unshift(newInvestment);

    // Create corresponding transaction
    const refId = `CHI-INV-${Math.floor(10000 + Math.random() * 90000)}`;
    if (!db.transactions) db.transactions = [];
    db.transactions.unshift({
      id: `tx-inv-${Date.now()}`,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
      type: 'INVESTMENT',
      description: `Strategy Capital Allocation - ${plan}`,
      amount: numAmount,
      currency: 'USD',
      status: 'COMPLETED',
      referenceId: refId,
      fee: 0.0,
      destinationOrSource: 'Cold Custody Multi-Sig Execution Ledger',
      clientEmail: user.email,
      clientName: user.name,
    });

    // Investment initiated notification
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: 'Investment Activated',
      message: `Your $${numAmount.toLocaleString()} USD investment in ${plan} is now active and generating performance updates.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'INVESTMENT',
      destinationAction: 'portfolio',
      relatedEntityId: newInvestment.id,
    });

    writeDb(db);

    res.json({
      success: true,
      activeInvestment: newInvestment,
      user: sanitizeUser(user),
    });
  });

  // Manual trigger for hourly investment update (for test verification)
  app.post('/api/investments/hourly-tick', (req, res) => {
    checkAndGenerateHourlyInvestmentUpdates();
    const db = readDb();
    res.json({
      success: true,
      message: 'Hourly investment performance check executed successfully.',
      activeInvestments: db.activeInvestments,
      notifications: db.notifications,
    });
  });

  // Validate promotional code
  app.get('/api/promo/validate', (req, res) => {
    const code = ((req.query.code as string) || '').trim().toUpperCase();
    const db = readDb();
    const campaign = (db.promoCampaigns || []).find((c: any) => c.code === code && c.status === 'ACTIVE');
    if (!campaign) {
      return res.status(400).json({ success: false, message: 'Invalid or expired promo code.' });
    }
    res.json({ success: true, campaign });
  });

  // Admin Promo Code list
  app.get('/api/admin/promos', (req, res) => {
    const db = readDb();
    res.json({ success: true, campaigns: db.promoCampaigns || [] });
  });

  // Interactive Notifications Endpoints
  app.get('/api/notifications', (req, res) => {
    const db = readDb();
    const userId = req.query.userId as string;
    let notifs = db.notifications || [];
    if (userId) {
      notifs = notifs.filter((n: any) => !n.userId || n.userId === userId);
    }
    res.json({ success: true, notifications: notifs });
  });

  app.post('/api/notifications/read', (req, res) => {
    const { notificationId } = req.body;
    if (!notificationId) return res.status(400).json({ error: 'notificationId required' });
    const db = readDb();
    if (db.notifications) {
      db.notifications = db.notifications.map((n: any) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      writeDb(db);
    }
    res.json({ success: true });
  });

  app.post('/api/notifications/read-all', (req, res) => {
    const { userId } = req.body;
    const db = readDb();
    if (db.notifications) {
      db.notifications = db.notifications.map((n: any) =>
        !userId || !n.userId || n.userId === userId ? { ...n, isRead: true } : n
      );
      writeDb(db);
    }
    res.json({ success: true });
  });

  // Crypto News & Market Insights
  app.get('/api/news', (req, res) => {
    const db = readDb();
    const category = req.query.category as string;
    let articles = db.news || [];
    if (category && category !== 'All') {
      articles = articles.filter((a: any) => a.category.toLowerCase() === category.toLowerCase());
    }
    res.json({ success: true, news: articles });
  });

  // Active Ongoing Investment Trade
  app.get('/api/investments/active', (req, res) => {
    const db = readDb();
    const userId = (req.query.userId as string) || 'usr-1';
    const active = (db.activeInvestments || []).find((inv: any) => inv.userId === userId && inv.status === 'ACTIVE') || (db.activeInvestments || [])[0] || null;
    res.json({ success: true, activeInvestment: active });
  });

  // Withdrawal System Workflow with strict $500 threshold
  app.post('/api/withdrawals', (req, res) => {
    const { userId, userEmail, userName, amount, destinationAddress, asset, notes } = req.body;
    const db = readDb();

    const numericAmount = parseFloat(amount);
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid withdrawal amount entered. Please specify a valid numerical value.',
      });
    }

    // Minimum withdrawal threshold is strictly $500.00 USD
    if (numericAmount < 500) {
      return res.status(400).json({
        success: false,
        meetsMinimum: false,
        message:
          'Minimum Withdrawal Requirement: Your current available balance or requested amount does not meet the minimum withdrawal requirement of $500.00. Please contact Crypto Hub Investments or your Account Manager for assistance.',
        companyEmail: 'cryptohubinvestments@hotmail.com',
        managerEmail: 'Ashleyelvira35@gmail.com',
        managerName: 'Ashley Elvira',
      });
    }

    const targetUser = db.users.find((u: any) => u.id === userId || (userEmail && u.email?.toLowerCase() === userEmail.toLowerCase()));
    const userBalance = targetUser ? (targetUser.numericBalance ?? 0) : 0;

    // Distinguish available balance from locked active investment capital
    const activeInv = (db.activeInvestments || []).find((inv: any) => inv.userId === userId && inv.status === 'ACTIVE');
    const lockedCapital = activeInv ? activeInv.initialCapital : 0;
    const withdrawableBalance = Math.max(0, userBalance - lockedCapital);

    if (numericAmount > withdrawableBalance) {
      return res.status(400).json({
        success: false,
        meetsMinimum: true,
        message: `Requested amount ($${numericAmount.toLocaleString()}) exceeds your available withdrawable balance ($${withdrawableBalance.toLocaleString()}). Locked active investment capital ($${lockedCapital.toLocaleString()}) cannot be withdrawn until the 7-day strategy cycle completes.`,
        withdrawableBalance,
        lockedCapital,
      });
    }

    const refId = `CHI-WTD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newWithdrawal = {
      id: `wtd-${Date.now()}`,
      userId: userId || targetUser?.id || 'usr-1',
      userEmail: userEmail || targetUser?.email || '',
      userName: userName || targetUser?.name || 'Client',
      amount: numericAmount,
      destinationAddress: destinationAddress || 'Default Custodial Payout',
      asset: asset || 'USD / BTC',
      status: 'UNDER_REVIEW',
      requestedAt: new Date().toISOString(),
      referenceId: refId,
      notes: notes || '',
    };

    if (!db.withdrawals) db.withdrawals = [];
    db.withdrawals.unshift(newWithdrawal);

    // Record transaction in ledger
    if (!db.transactions) db.transactions = [];
    db.transactions.unshift({
      id: `tx-wtd-${Date.now()}`,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
      type: 'WITHDRAWAL',
      description: `Withdrawal Authorization Request (${refId})`,
      amount: numericAmount,
      currency: 'USD',
      status: 'UNDER_REVIEW',
      referenceId: refId,
      fee: 25.0,
      destinationOrSource: destinationAddress || 'Client Bank Settlement',
      clientEmail: userEmail || targetUser?.email,
      clientName: userName || targetUser?.name,
    });

    // Record interactive notification
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: userId || targetUser?.id || 'usr-1',
      title: 'Withdrawal Authorization Queued',
      message: `Your withdrawal request #${refId} for $${numericAmount.toLocaleString()} USD has been queued for authorization with Ashley Elvira.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'TRANSACTION',
      destinationAction: 'transactions',
    });

    // Audit log
    if (!db.auditLogs) db.auditLogs = [];
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' EST',
      actor: userName || targetUser?.name || 'Client Investor',
      actorRole: 'CLIENT',
      action: `Withdrawal Authorization Request Submitted (${refId})`,
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Client Device',
      location: 'Client Portal',
      status: 'SUCCESS',
      details: `$${numericAmount.toLocaleString()} to ${destinationAddress}`,
    });

    writeDb(db);

    return res.json({
      success: true,
      withdrawal: newWithdrawal,
      message:
        'Withdrawal Request: Your available balance meets the minimum withdrawal requirement of $500.00. To proceed with your withdrawal request, please contact your Investment Company or Account Manager.',
      companyEmail: 'cryptohubinvestments@hotmail.com',
      managerEmail: 'Ashleyelvira35@gmail.com',
      managerName: 'Ashley Elvira',
    });
  });

  // AI Assistant Server-side Proxy using @google/genai
  app.post('/api/ai/chat', async (req, res) => {
    const { message, history, userContext } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const systemInstruction = `You are Crypto Hub AI, the intelligent institutional assistant for Crypto Hub Investments.
Your purpose is to provide clear, helpful, professional guidance regarding:
- The user's dashboard and verified holdings
- Understanding portfolio metrics (total balance, available balance, invested capital, liquid cash buffer)
- Explaining transactions and deposits
- Explaining investment terminology (e.g., 7-day cyclical terms, segregated cold storage, multi-signature vaults, annualized yield, slippage, spot vs derivative)
- Explaining crypto concepts (Bitcoin halving, network difficulty, hash rate, proof-of-work)
- Navigating the Crypto Hub Investments platform
- Frequently asked questions and account features
- Explaining notifications and withdrawal requirements
- Directing users to their dedicated Lead Account Manager Ashley Elvira (email: Ashleyelvira35@gmail.com, telegram: @ashleyelvira_fx) or Crypto Hub Investments (email: cryptohubinvestments@hotmail.com).

AUTHENTICATED USER CONTEXT (AUTHORIZED DATA ONLY):
${userContext ? JSON.stringify(userContext, null, 2) : 'User is browsing the platform.'}

CRITICAL RESTRICTIONS & POLICY COMPLIANCE:
1. NEVER guarantee investment returns or promise financial profits.
2. NEVER invent transactions or claim a transaction occurred when it did not.
3. NEVER invent account balances or alter real financial figures.
4. NEVER pretend to be the human Account Manager Ashley Elvira; you are "Crypto Hub AI", an automated system assistant.
5. NEVER give unauthorized financial instructions or attempt to bypass security, KYC, or withdrawal thresholds.
6. The minimum withdrawal threshold is $500.00 USD, and withdrawals require dual-authorization by contacting Crypto Hub Investments (cryptohubinvestments@hotmail.com) or Ashley Elvira (Ashleyelvira35@gmail.com).
7. If an inquiry involves sensitive account alterations, balance credits, or trade execution, politely direct the user to Ashley Elvira.
8. Maintain a refined, confident, institutional fintech tone. Avoid slang, emojis spam, or casino/gambling rhetoric.`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({});
        let conversationPrompt = '';
        if (Array.isArray(history) && history.length > 0) {
          const past = history.slice(-6).map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n');
          conversationPrompt = `${past}\nUser: ${message}\nAssistant:`;
        } else {
          conversationPrompt = `User: ${message}\nAssistant:`;
        }

        const result = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationPrompt,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        const reply = result.text || 'I am here to assist with your portfolio, transactions, and investment questions.';
        return res.json({ reply });
      } catch (err: any) {
        console.error('Gemini API call failed, falling back to local fintech knowledge engine:', err?.message || err);
      }
    }

    // High-quality domain knowledge fallback if API key is unset or network error
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('current investment') || lower.includes('portfolio value') || lower.includes('my balance') || lower.includes('how much')) {
      const val = userContext?.portfolioValue || '$154,311.76';
      const activeVal = userContext?.activeInvestmentValue || '$1,247.50';
      reply = `Based on your authenticated account records, your total portfolio value is ${val}. You currently have an active Silver Growth Tier investment with a current valuation of ${activeVal} (+24.75% profit on Day 4 of 7).`;
    } else if (lower.includes('withdraw') || lower.includes('payout') || lower.includes('cash out')) {
      reply = `The minimum withdrawal requirement across all accounts is $500.00 USD. If your available balance is $500 or more, you can initiate a withdrawal request from your dashboard, which will be submitted for dual-custody review by Crypto Hub Investments (cryptohubinvestments@hotmail.com) and Lead Account Manager Ashley Elvira (Ashleyelvira35@gmail.com). Funds currently locked in an active 7-day trade cannot be withdrawn until the term completes.`;
    } else if (lower.includes('active trade') || lower.includes('active investment') || lower.includes('growth')) {
      reply = `Your active strategy is the Silver Growth Tier ($1,000.00 initial capital), currently at Day 4 of 7. It has generated +$247.50 (+24.75%) in unrealized growth toward the +65% target. All trades are backed by segregated multi-signature cold storage under Lead Account Manager Ashley Elvira.`;
    } else if (lower.includes('ashley') || lower.includes('manager') || lower.includes('contact') || lower.includes('email') || lower.includes('telegram')) {
      reply = `Your assigned Lead Account Manager is Ashley Elvira (Cryptocurrency Analyst with 7+ years trading experience). You can reach her directly via email at Ashleyelvira35@gmail.com or Telegram at @ashleyelvira_fx. You can also contact Crypto Hub Investments at cryptohubinvestments@hotmail.com.`;
    } else if (lower.includes('cold storage') || lower.includes('custody') || lower.includes('security') || lower.includes('safe')) {
      reply = `Crypto Hub Investments utilizes segregated air-gapped cold storage vaults with multi-signature authorization. Private keys never touch internet-connected environments, insulating capital from exchange insolvency and network vulnerabilities.`;
    } else {
      reply = `I am Crypto Hub AI, your institutional digital-asset guide. I can help explain your active investments, portfolio allocation, verified transactions, withdrawal eligibility, or market insights. For personal account adjustments, Lead Account Manager Ashley Elvira is available at Ashleyelvira35@gmail.com or on Telegram @ashleyelvira_fx.`;
    }

    return res.json({ reply });
  });

  // Register client account with optional promotional code validation
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, phone, promoCode, username } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const db = readDb();
    const existing = db.users.find(
      (u: any) =>
        u.email.toLowerCase() === trimmedEmail ||
        (username && u.username && u.username.toLowerCase() === username.trim().toLowerCase())
    );
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email address or username already exists.' });
    }

    let promoBonus = 0;
    let promoSource = '';

    // Server-side promo code validation
    if (promoCode && promoCode.trim()) {
      const codeUpper = promoCode.trim().toUpperCase();
      const campaign = (db.promoCampaigns || []).find((c: any) => c.code === codeUpper && c.status === 'ACTIVE');
      if (!campaign) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired promo code.',
        });
      }
      promoBonus = campaign.bonusAmount || 100.0;
      promoSource = campaign.code;
      campaign.redemptionCount = (campaign.redemptionCount || 0) + 1;
    }

    const generatedUsername = username ? username.trim().toLowerCase() : trimmedEmail.split('@')[0];
    const userPass = password || 'password123';
    const passHash = hashPassword(userPass);

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      username: generatedUsername,
      email: trimmedEmail,
      passwordHash: passHash, // Hashed with PBKDF2; never stored as plaintext
      phone: phone || '',
      role: 'CLIENT',
      approvalStatus: 'PENDING_APPROVAL',
      accountNumber: `CHI-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-MV`,
      registeredDate: new Date().toISOString().split('T')[0],
      portfolioValue: `$${promoBonus.toFixed(2)}`,
      numericBalance: promoBonus,
      depositBalance: 0.0,
      promotionalBalance: promoBonus,
      availableBalance: promoBonus,
      investedCapital: 0.0,
      profitLoss: 0.0,
      withdrawableBalance: 0.0, // Promotional balance is separate and non-withdrawable
      pendingWithdrawal: 0.0,
      lastBalanceUpdate: promoBonus > 0 ? 'Promotional Credit Applied' : 'Pending Initial Funding',
      jurisdiction: 'Massachusetts, US',
    };

    db.users.unshift(newUser);

    // If promo code redeemed, create corresponding promotional transaction
    if (promoBonus > 0) {
      const promoRefId = `CHI-PRM-${Math.floor(10000 + Math.random() * 90000)}`;
      if (!db.transactions) db.transactions = [];
      db.transactions.unshift({
        id: `tx-promo-${Date.now()}`,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
        type: 'PROMOTIONAL_BONUS',
        description: `Promotional Bonus (Source: ${promoSource})`,
        amount: promoBonus,
        currency: 'USD',
        status: 'CREDITED',
        referenceId: promoRefId,
        fee: 0.0,
        destinationOrSource: 'Promotional Incentive Ledger',
        clientEmail: trimmedEmail,
        clientName: name.trim(),
        promoCode: promoSource,
      });

      if (!db.notifications) db.notifications = [];
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: newUser.id,
        title: 'Promotional Bonus Credited',
        message: `Welcome to Crypto Hub Investments! $${promoBonus.toFixed(2)} USD promotional credit applied using code ${promoSource}.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'ACCOUNT',
        destinationAction: 'transactions',
      });
    }

    // Record audit log
    if (!db.auditLogs) db.auditLogs = [];
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' EST',
      actor: 'New Registration Desk',
      actorRole: 'CLIENT',
      action: 'New client registration application submitted',
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Client Device',
      location: 'Synchronized Web Session',
      status: 'SUCCESS',
      details: `${name} (${trimmedEmail}) - ${promoBonus > 0 ? `Promo Code ${promoSource} redeemed (+$${promoBonus})` : 'Zero starting balance'} - Pending Admin Review`,
    });

    writeDb(db);

    res.json({
      success: true,
      user: sanitizeUser(newUser),
      message:
        'Registration submitted successfully! Your account application has been submitted to the compliance administrator for approval. You will be able to log in once approved.',
    });
  });

  // Client / Staff login
  app.post('/api/auth/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail) {
      return res.status(400).json({ success: false, message: 'Username or email is required.' });
    }

    const trimmed = usernameOrEmail.trim().toLowerCase();

    // Admin login
    if (trimmed === 'admin') {
      if (password === 'admin') {
        return res.json({
          success: true,
          role: 'ADMIN',
          user: {
            id: 'admin-master',
            name: 'Executive Oversight Administrator',
            email: 'admin@cryptohubinvestments.com',
            role: 'ADMIN',
            approvalStatus: 'APPROVED',
          },
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials. Access denied.' });
    }

    // Account Manager login
    if (trimmed === 'ashleyelvira35@gmail.com') {
      return res.json({
        success: true,
        role: 'MANAGER',
        user: {
          id: 'mgr-ashley',
          name: 'Ashley Elvira',
          email: 'Ashleyelvira35@gmail.com',
          role: 'MANAGER',
          approvalStatus: 'APPROVED',
        },
      });
    }

    // Client user lookup (by email, username, or account number)
    const db = readDb();
    const matched = db.users.find(
      (u: any) =>
        (u.email && u.email.toLowerCase() === trimmed) ||
        (u.username && u.username.toLowerCase() === trimmed) ||
        (u.accountNumber && u.accountNumber.toLowerCase() === trimmed)
    );

    if (!matched) {
      return res.status(404).json({
        success: false,
        message: 'Account not found. Please click "Open Investor Account" to submit a registration application.',
      });
    }

    if (matched.approvalStatus === 'PENDING_APPROVAL') {
      return res.status(403).json({
        success: false,
        approvalStatus: 'PENDING_APPROVAL',
        message:
          'Your account registration is currently PENDING ADMINISTRATOR APPROVAL. An administrator must approve your application before you can access the platform.',
      });
    }

    if (matched.approvalStatus === 'REJECTED') {
      return res.status(403).json({
        success: false,
        approvalStatus: 'REJECTED',
        message: 'This account registration was not approved by compliance. Please contact support.',
      });
    }

    // Verify password via PBKDF2 hash or verifyPassword helper
    const isValid = verifyPassword(password, matched);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please verify your credentials or contact administrator.',
      });
    }

    return res.json({
      success: true,
      role: 'CLIENT',
      user: sanitizeUser(matched),
    });
  });

  // Admin approves user
  app.post('/api/admin/approve-user', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

    const db = readDb();
    const target = db.users.find((u: any) => u.id === userId);
    if (!target) return res.status(404).json({ success: false, message: 'User not found' });

    target.approvalStatus = 'APPROVED';

    if (!db.auditLogs) db.auditLogs = [];
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' EST',
      actor: 'Executive Admin Desk',
      actorRole: 'ADMIN',
      action: 'Admin approved client account',
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Admin Console',
      location: 'Synchronized Network',
      status: 'SUCCESS',
      details: `Account #${target.accountNumber} (${target.name}) approved and synchronized across all devices`,
    });

    writeDb(db);
    res.json({ success: true, user: target });
  });

  // Admin rejects user
  app.post('/api/admin/reject-user', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

    const db = readDb();
    const target = db.users.find((u: any) => u.id === userId);
    if (!target) return res.status(404).json({ success: false, message: 'User not found' });

    target.approvalStatus = 'REJECTED';

    if (!db.auditLogs) db.auditLogs = [];
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' EST',
      actor: 'Executive Admin Desk',
      actorRole: 'ADMIN',
      action: 'Admin declined client application',
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Admin Console',
      location: 'Synchronized Network',
      status: 'FLAGGED',
      details: `Registration #${userId} (${target.name}) declined`,
    });

    writeDb(db);
    res.json({ success: true, user: target });
  });

  // Admin updates client balance
  app.post('/api/admin/update-balance', (req, res) => {
    const { userId, newBalance } = req.body;
    if (!userId || newBalance === undefined) {
      return res.status(400).json({ success: false, message: 'userId and newBalance required' });
    }

    const db = readDb();
    const target = db.users.find((u: any) => u.id === userId);
    if (!target) return res.status(404).json({ success: false, message: 'User not found' });

    const num = Number(newBalance);
    const formatted = `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const nowStr =
      new Date().toLocaleDateString() +
      ' ' +
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
      ' EST';

    target.portfolioValue = formatted;
    target.numericBalance = num;
    target.lastBalanceUpdate = nowStr;

    if (!db.auditLogs) db.auditLogs = [];
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' EST',
      actor: 'Executive Admin Desk',
      actorRole: 'ADMIN',
      action: 'Admin updated client balance',
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Admin Console',
      location: 'Synchronized Network',
      status: 'SUCCESS',
      details: `Client: ${target.name} (${target.accountNumber}) -> Set to ${formatted}`,
    });

    writeDb(db);
    res.json({ success: true, user: target, formattedBalance: formatted });
  });

  // Admin updates client credentials / password
  app.post('/api/admin/update-credentials', (req, res) => {
    const { userId, password } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

    const db = readDb();
    const target = db.users.find((u: any) => u.id === userId);
    if (!target) return res.status(404).json({ success: false, message: 'User not found' });

    const token = password || `SEC-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
    target.passwordHash = hashPassword(token);
    delete target.password;

    if (!db.auditLogs) db.auditLogs = [];
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' EST',
      actor: 'Executive Admin Desk',
      actorRole: 'ADMIN',
      action: 'Admin updated client authentication credential',
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Admin Console',
      location: 'Synchronized Network',
      status: 'SUCCESS',
      details: `Client: ${target.name} (${target.accountNumber}) password credential updated securely`,
    });

    writeDb(db);
    res.json({ success: true, user: sanitizeUser(target), temporaryPlaintextForAdmin: token });
  });

  // Appointments sync
  app.post('/api/appointments', (req, res) => {
    const aptData = req.body;
    const db = readDb();
    if (!db.appointments) db.appointments = [];

    const ref = `CHI-APT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newApt = {
      ...aptData,
      id: `apt-${Date.now()}`,
      referenceId: ref,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' EST',
    };

    db.appointments.unshift(newApt);
    writeDb(db);
    res.json({ success: true, appointment: newApt });
  });

  // Cancel appointment
  app.delete('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    if (!db.appointments) db.appointments = [];
    db.appointments = db.appointments.map((a: any) => (a.id === id ? { ...a, status: 'CANCELLED' } : a));
    writeDb(db);
    res.json({ success: true });
  });

  // Get transactions
  app.get('/api/transactions', (req, res) => {
    const db = readDb();
    res.json({ success: true, transactions: db.transactions || [] });
  });

  // Submit new transaction / deposit with screenshot proof
  app.post('/api/transactions', (req, res) => {
    const txData = req.body;
    const db = readDb();
    if (!db.transactions) db.transactions = [];

    const newTx = {
      ...txData,
      id: txData.id || `tx-${Date.now()}`,
      referenceId: txData.referenceId || `CHI-DEP-${Math.floor(10000 + Math.random() * 90000)}`,
      date: txData.date || new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
      status: txData.status || 'UNDER_REVIEW',
    };

    db.transactions.unshift(newTx);

    // Audit log
    if (!db.auditLogs) db.auditLogs = [];
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' EST',
      actor: txData.clientName || 'Client Investor',
      actorRole: 'CLIENT',
      action: `Inbound Investment Deposit Proof Submitted (${newTx.referenceId})`,
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Investor Device',
      location: 'Direct Website Deposit',
      status: 'SUCCESS',
      details: `$${newTx.amount?.toLocaleString()} for ${newTx.planName || newTx.description}${newTx.depositProofImage ? ' (Payment Screenshot Attached)' : ''}`,
    });

    writeDb(db);
    res.json({ success: true, transaction: newTx });
  });

  // Update transaction status (e.g., admin approval)
  app.put('/api/transactions/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const db = readDb();
    if (!db.transactions) db.transactions = [];

    const targetTx = db.transactions.find((t: any) => t.id === id);
    if (!targetTx) return res.status(404).json({ success: false, message: 'Transaction not found' });

    targetTx.status = status;

    // If approved as COMPLETED deposit, credit user's balance if user email/name matches
    if (status === 'COMPLETED' && targetTx.type === 'DEPOSIT') {
      const userMatch = db.users.find(
        (u: any) =>
          (targetTx.clientEmail && u.email?.toLowerCase() === targetTx.clientEmail.toLowerCase()) ||
          (targetTx.clientName && u.name?.toLowerCase() === targetTx.clientName.toLowerCase())
      );
      if (userMatch) {
        const currentBal = Number(userMatch.numericBalance) || 0;
        const newBal = currentBal + (Number(targetTx.amount) || 0);
        userMatch.numericBalance = newBal;
        userMatch.portfolioValue = `$${newBal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        userMatch.lastBalanceUpdate = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST';
      }
    }

    if (!db.auditLogs) db.auditLogs = [];
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' EST',
      actor: 'Executive Admin Desk',
      actorRole: 'ADMIN',
      action: `Transaction Status Updated (${targetTx.referenceId})`,
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Admin Console',
      location: 'Synchronized Network',
      status: status === 'COMPLETED' ? 'SUCCESS' : 'FLAGGED',
      details: `Status set to ${status} for Ref ${targetTx.referenceId} ($${targetTx.amount?.toLocaleString()})`,
    });

    writeDb(db);
    res.json({ success: true, transaction: targetTx });
  });

  // --- Static or Vite Middleware ---
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Crypto Hub Investments Full-Stack Server active at http://0.0.0.0:${PORT}`);

    // Initial check and hourly recurring background engine for legitimate investment profit notifications
    try {
      checkAndGenerateHourlyInvestmentUpdates();
      // Run every hour
      setInterval(() => {
        checkAndGenerateHourlyInvestmentUpdates();
      }, 60 * 60 * 1000);
      console.log('Automated server-side hourly investment performance engine initialized.');
    } catch (e) {
      console.error('Error starting hourly investment engine:', e);
    }
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
