
export interface MarketTrend {
  symbol: string;
  price: number;
  change24h: number;
  trend: 'bullish' | 'bearish';
  confidence: number; // 0-100 (Gemini's confidence in the data)
  trendStrengthScore: number; // 0-100 (ADX/Volume intensity)
  reasoning: string;
  sparkline: number[]; // Array of simulated price points for visualization
  volume: string;
  support: number;
  resistance: number;
}

export interface MarketAnalysisData {
  timestamp: string;
  summary: string;
  bullish: MarketTrend[];
  bearish: MarketTrend[];
}

export type AppStep = 'prompt' | 'input' | 'dashboard';

export type Timeframe = '1m' | '3m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
