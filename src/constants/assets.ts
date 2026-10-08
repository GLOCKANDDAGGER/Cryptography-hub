// Generated Brand Assets for Crypto Hub Investments
export const ASSETS = {
  ashleyElviraPortrait: '/src/assets/images/ashley_elvira_portrait_1790569554013.jpg',
  heroBanner: '/src/assets/images/crypto_hub_hero_banner_1790569565350.jpg',
  marketBtcMedallion: '/src/assets/images/market_intelligence_btc_1790569576938.jpg',
};

export const COMPANY_DETAILS = {
  name: 'Crypto Hub Investments',
  tagline: 'Digital Assets. Intelligent Strategies. Responsible Growth.',
  location: 'Massachusetts, United States',
  primaryEmail: 'cryptohubinvestments@hotmail.com',
  companyEmail: 'cryptohubinvestments@hotmail.com',
  customerCareEmail: 'myhelpsdesk@outlook.com',
  minInvestmentAmount: 250,
  minWithdrawalAmount: 500,
  activePromoCode: 'CRYPTOHUB26',
  promoBonusAmount: 100,
  accountManager: {
    name: 'Ashley Elvira',
    role: 'Account Manager',
    specialties: ['Cryptocurrency Analyst', 'Bitcoin & Forex Account Manager'],
    experience: 'More than 7 years of trading experience',
    email: 'Ashleyelvira35@gmail.com',
    telegram: '@ashleyelvira_fx',
    telegramUrl: 'https://t.me/ashleyelvira_fx',
  },
  officialDeposit: {
    asset: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin (BTC Network)',
    address: '1Hn5EATL7UNJfkKUNfbuvdRp15KXKCYkoZ',
    minDepositUsd: 250,
    instructions: 'Send your investment deposit directly to our official custodial BTC address. After sending, upload your transaction screenshot and notify Lead Account Manager Ashley Elvira.',
  },
  disclaimer:
    'Digital-asset and foreign-exchange markets involve significant risk and may be highly volatile. The value of investments can rise or fall, and clients may lose some or all of their invested capital. Past performance does not guarantee future results.',
};

export const MIN_INVESTMENT_AMOUNT = 250;
export const MIN_WITHDRAWAL_AMOUNT = 500;
export const ACTIVE_PROMO_CODE = 'CRYPTOHUB26';
export const PROMO_BONUS_AMOUNT = 100;

export interface InvestmentPlanTier {
  id: string;
  name: string;
  minAmount: number;
  maxAmount?: number;
  growthPercent: number; // e.g. 65%
  durationDays: number; // e.g. 7
  durationLabel: string;
  payoutFrequency: string;
  riskRating: 'Moderate' | 'Balanced Growth' | 'High Growth' | 'Sovereign Institutional';
  targetAssets: string;
  description: string;
}

export const OFFICIAL_INVESTMENT_PLANS: InvestmentPlanTier[] = [
  {
    id: 'starter-7d',
    name: 'Silver Growth Tier',
    minAmount: 250,
    maxAmount: 999,
    growthPercent: 65,
    durationDays: 7,
    durationLabel: '7 Days (Minimum Trading Duration)',
    payoutFrequency: 'End of 7-Day Term',
    riskRating: 'Moderate',
    targetAssets: 'Bitcoin (BTC) Spot Volatility & Core Reserves',
    description: 'Disciplined entry-level investment strategy with a fixed minimum trading cycle of 7 days, delivering 65% target growth on capital reserves with automated downside mitigation.',
  },
  {
    id: 'executive-14d',
    name: 'Gold Multiplier Tier',
    minAmount: 1000,
    maxAmount: 4999,
    growthPercent: 110,
    durationDays: 14,
    durationLabel: '14 Days Trading Horizon',
    payoutFrequency: 'End of 14-Day Term',
    riskRating: 'Balanced Growth',
    targetAssets: 'Bitcoin (BTC) + Ethereum (ETH) + DeFi Protocol Yield',
    description: 'Medium-term growth plan engineered for accredited capital participants seeking enhanced returns through multi-asset smart contract liquidity and high-volume arbitrage.',
  },
  {
    id: 'institutional-21d',
    name: 'Platinum High-Conviction Tier',
    minAmount: 5000,
    maxAmount: 19999,
    growthPercent: 175,
    durationDays: 21,
    durationLabel: '21 Days Trading Horizon',
    payoutFrequency: 'End of 21-Day Term',
    riskRating: 'High Growth',
    targetAssets: 'Layer-1 Infrastructure (BTC, ETH, SOL) & On-Chain Quantitative Models',
    description: 'High-conviction algorithmic trading strategy harnessing on-chain network velocity, cross-exchange liquidity spreads, and institutional hedge positioning.',
  },
  {
    id: 'sovereign-30d',
    name: 'Diamond Sovereign Mandate',
    minAmount: 20000,
    growthPercent: 260,
    durationDays: 30,
    durationLabel: '30 Days Custodial Mandate',
    payoutFrequency: 'End of 30-Day Term (Custom compounding available)',
    riskRating: 'Sovereign Institutional',
    targetAssets: 'Dedicated Multi-Signature Cold Vault Portfolio',
    description: 'Bespoke high-volume portfolio allocation overseen directly by Lead Account Manager Ashley Elvira with air-gapped cold custody, VIP execution, and dedicated reporting.',
  },
];

