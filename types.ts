
export interface Coin {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume: string;
  trend: number[]; // Simple array for sparklines
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isGrounding?: boolean;
  sources?: { uri: string; title: string }[];
}

export interface GameChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isAI: boolean;
  avatar?: string;
  color?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  duration: string;
}

export interface MarketInsight {
  title: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  score: number; // 0-100
  summary: string;
}

// --- Wallet Types ---

export interface WalletAsset {
  symbol: string;
  name: string;
  amount: number;
  valueUsd: number;
  pnl: number;
  allocation: number; // Percentage of portfolio
  suggestedAllocation?: number; // AI suggested percentage
}

export interface UserProfile {
  id: string;
  name: string;
  walletAddress: string;
  assets: WalletAsset[];
  riskProfile: 'Degen' | 'Conservative' | 'Balanced';
}

// --- New Features Types ---

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  reliabilityScore: number; // 0-100%
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
}

export interface WhaleTransaction {
  id: string;
  coin: string;
  amount: string;
  value: string;
  from: string;
  to: string;
  type: 'Buy' | 'Sell' | 'Transfer';
  timestamp: string;
}

export interface ESGReport {
  score: number; // 0-100 (Higher is better)
  summary: string;
  controversies: {
    date: string;
    title: string;
    severity: 'High' | 'Medium' | 'Low';
    description: string;
  }[];
}

export interface AssetBackground {
  description: string; // What does it do?
  consensus: string; // PoW, PoS, etc.
  utility: string; // Gas, Governance, Store of Value
}

export interface TraderProfile {
  id: string;
  name: string;
  handle: string;
  winRate: number;
  pnl: number;
  riskScore: number;
  strategy: string;
  followers: string;
  avatarUrl?: string;
}

// --- BitPoly Types ---

export type TileType = 'ASSET' | 'NEWS' | 'CHANCE' | 'FATE' | 'JAIL' | 'START' | 'PARKING' | 'SENTIMENT';

export interface GameTile {
  id: number;
  type: TileType;
  label: string;
  subLabel?: string;
  cost?: number; // If asset
  assetId?: string;
  color?: string;
}

export interface AIPartner {
  id: string;
  name: string;
  specialty: string;
  perk: string;
  perkDescription: string;
  affinity: number; // 0-100
  avatar: string;
}

export interface PlayerState {
  balance: number;
  position: number;
  assets: { symbol: string; amount: number; value: number }[];
  isJailed: boolean;
  jailTurns: number;
  riskResistance: number; // 0-100% (Reduces impact of FATE events)
  landlordLevel: number; // 1-5 (Unlocks data visibility)
  badges: string[]; // e.g., 'Whale', 'Survivor'
  gameRulesSeen: boolean;
  history: string[];
  activeAllianceId?: string;
}

export interface GameEvent {
  title: string;
  description: string;
  type: 'QUIZ' | 'DECISION' | 'INFO';
  question?: string;
  options?: string[];
  correctAnswer?: number; // Index
  explanation?: string; // New field for detailed educational feedback
  reward?: number;
  penalty?: number;
}
