export interface Token {
  mint: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  liquidity?: number;
  imageUrl?: string;
  volume24h?: number;
  marketCap?: number;
}

export interface TrendingToken extends Token {
  rank?: number;
}

export interface TokenHolder {
  address: string;
  amount: number;
  percentage: number;
  rank?: number;
}

export interface Trade {
  txHash: string;
  time: string;
  timestamp: number;
  buyer: string;
  seller: string;
  amount: number;
  price: number;
  type: "buy" | "sell";
  tokenSymbol?: string;
}

export interface OHLCV {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TokenBannerItem {
  mint: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
}

export interface AppState {
  isLoggedIn: boolean;
  walletAddress: string | null;
  solBalance: number;
  selectedToken: Token | null;
  trendingTokens: Token[];
  network: "devnet" | "mainnet";
}

export type TimeFrame = "1m" | "5m" | "15m" | "1H" | "4H" | "1D";

export interface ChartDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}
