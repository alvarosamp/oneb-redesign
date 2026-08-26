import type { Confidence, DataStatus } from "@/components/oneb/Badges";

export interface QuoteRow {
  symbol: string;
  label: string;
  price: number;
  change_pct: number;
  volume: string;
  taken_at: string;
  status: DataStatus;
  confidence: Confidence;
  score: number;
  spark: number[];
}

export interface AlertItem {
  id: string;
  symbol: string;
  title: string;
  rule: string;
  severity: "alta" | "media" | "baixa";
  confidence: Confidence;
  created_at: string;
  read: boolean;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  label: string;
  asset_type: "acao" | "fii" | "indice" | "us";
  price: number;
  change_pct: number;
  status: DataStatus;
  rules: WatchlistRule[];
}

export interface WatchlistRule {
  id: string;
  description: string;
  indicator: string;
  operator: ">" | "<" | "cruza acima" | "cruza abaixo";
  value: number;
  confidence: Confidence;
  active: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  published_at: string;
  impact_score: number;
  symbols: string[];
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  title: string;
  impact: "high" | "medium" | "low";
}

export interface FxQuote {
  rate: number;
  change_pct: number;
  updated_at: string;
  spark: number[];
}

export interface DashboardSummary {
  rows: QuoteRow[];
  alerts: AlertItem[];
  news: NewsItem[];
  econ: EconomicEvent[];
  fx: FxQuote;
  gold: { usd: number; brl: number; change_pct: number };
  portfolio: { market_value: number; unrealized_pnl: number; positions: number };
}

export interface BacktestResult {
  hits: number;
  tries: number;
  hit_rate: number;
  avg_move_pct: number;
  confidence: Confidence;
}
