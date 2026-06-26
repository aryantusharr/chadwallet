import axios from "axios";
import type { Token, TokenHolder, Trade, OHLCV } from "@/lib/types";
import { APICache, CACHE_DURATIONS, cacheKeys } from "@/lib/utils/cache";
import { formatTime } from "@/lib/utils/format";

const BIRDEYE_BASE_URL = "https://public-api.birdeye.so";
const API_KEY = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || "";

const birdeyeClient = axios.create({
  baseURL: BIRDEYE_BASE_URL,
  headers: {
    "X-API-KEY": API_KEY,
    "x-chain": "solana",
  },
  timeout: 15000,
});

const cache = new APICache();

/**
 * Helper to fetch with retry on 429 rate limits
 */
async function fetchWithRetry<T>(fn: () => Promise<T>, retries = 1, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && error?.response?.status === 429) {
      console.warn(`[Birdeye API] 429 Rate limited. Retrying after ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function fetchFromProxy<T>(endpoint: string, params: Record<string, string | number>): Promise<T> {
  const query = new URLSearchParams();
  query.set("endpoint", endpoint);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      query.set(key, String(val));
    }
  });
  const res = await fetch(`/api/birdeye?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch from proxy: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Get trending/new tokens
 */
export async function getTrendingTokens(limit = 10): Promise<Token[]> {
  if (typeof window !== "undefined") {
    return fetchFromProxy<Token[]>("trending", { limit });
  }

  const cacheKey = cacheKeys.getTrendingTokensKey(limit);
  const cached = cache.get<Token[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithRetry(() =>
      birdeyeClient.get("/defi/token_trending", {
        params: {
          sort_by: "rank",
          sort_type: "asc",
          offset: 0,
          limit,
        },
      })
    );

    const tokens: Token[] = (response.data?.data?.tokens || []).map(
      (t: Record<string, unknown>) => ({
        mint: (t.address as string) || "",
        name: (t.name as string) || "Unknown Token",
        symbol: (t.symbol as string) || "???",
        price: Number(t.price) || 0,
        change24h: Number(t.priceChange24hPercent) || 0,
        liquidity: Number(t.liquidity) || 0,
        volume24h: Number(t.volume24h) || 0,
        imageUrl: (t.logoURI as string) || "",
      })
    );

    cache.set(cacheKey, tokens, CACHE_DURATIONS.TRENDING_TOKENS);
    return tokens;
  } catch (error: any) {
    console.error(
      `[Birdeye API] getTrendingTokens failed. Error: ${error?.message || error}`
    );
    // Return empty array as requested, or fallback if needed
    return [];
  }
}

/**
 * Get token price and info
 */
export async function getTokenPrice(mint: string): Promise<Token | null> {
  if (!mint) return null;
  if (typeof window !== "undefined") {
    return fetchFromProxy<Token | null>("price", { mint });
  }

  const cacheKey = cacheKeys.getTokenPriceKey(mint);
  const cached = cache.get<Token>(cacheKey);
  if (cached) return cached;

  try {
    const [priceRes, metaRes] = await Promise.allSettled([
      fetchWithRetry(() =>
        birdeyeClient.get("/defi/price", {
          params: { address: mint },
        })
      ),
      fetchWithRetry(() =>
        birdeyeClient.get("/defi/token_overview", {
          params: { address: mint },
        })
      ),
    ]);

    const priceData =
      priceRes.status === "fulfilled" ? priceRes.value.data?.data : null;
    const metaData =
      metaRes.status === "fulfilled" ? metaRes.value.data?.data : null;

    if (!priceData && !metaData) {
      throw new Error("Failed to retrieve both price and metadata overview");
    }

    const token: Token = {
      mint,
      name: metaData?.name || "Unknown Token",
      symbol: metaData?.symbol || "???",
      price: priceData?.value || metaData?.price || 0,
      change24h: metaData?.priceChange24hPercent || 0,
      liquidity: metaData?.liquidity || 0,
      volume24h: metaData?.v24hUSD || 0,
      marketCap: metaData?.mc || 0,
      imageUrl: metaData?.logoURI || "",
    };

    cache.set(cacheKey, token, CACHE_DURATIONS.TOKEN_PRICE);
    return token;
  } catch (error: any) {
    console.error(
      `[Birdeye API] getTokenPrice failed for mint: ${mint}. Error: ${
        error?.message || error
      }`
    );
    return null;
  }
}

/**
 * Get top token holders
 */
export async function getTokenHolders(mint: string, limit = 5): Promise<TokenHolder[]> {
  if (!mint) return [];
  if (typeof window !== "undefined") {
    return fetchFromProxy<TokenHolder[]>("holders", { mint, limit });
  }

  const cacheKey = cacheKeys.getTokenHoldersKey(mint);
  const cached = cache.get<TokenHolder[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithRetry(() =>
      birdeyeClient.get("/defi/v2/tokens/top_holders", {
        params: {
          address: mint,
          limit,
        },
      })
    );

    const holders: TokenHolder[] = (response.data?.data?.items || []).map(
      (h: Record<string, unknown>, i: number) => ({
        address: (h.owner as string) || "",
        amount: Number(h.uiAmount) || 0,
        percentage: Number(h.percentage) || 0,
        rank: i + 1,
      })
    );

    cache.set(cacheKey, holders, CACHE_DURATIONS.HOLDERS);
    return holders;
  } catch (error: any) {
    console.error(
      `[Birdeye API] getTokenHolders failed for mint: ${mint}. Error: ${
        error?.message || error
      }`
    );
    return [];
  }
}

/**
 * Get recent token trades/transactions
 */
export async function getTokenTrades(mint: string, limit = 10): Promise<Trade[]> {
  if (!mint) return [];
  if (typeof window !== "undefined") {
    return fetchFromProxy<Trade[]>("trades", { mint, limit });
  }

  const cacheKey = cacheKeys.getTokenTradesKey(mint);
  const cached = cache.get<Trade[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithRetry(() =>
      birdeyeClient.get("/defi/txs/token", {
        params: {
          address: mint,
          limit,
          tx_type: "all",
        },
      })
    );

    const trades: Trade[] = (response.data?.data?.items || []).map(
      (t: Record<string, unknown>) => {
        const timestamp = Number(t.blockUnixTime) || Date.now() / 1000;
        return {
          txHash: (t.txHash as string) || "",
          time: formatTime(timestamp),
          timestamp,
          buyer: (t.from as string) || (t.owner as string) || "",
          seller: (t.to as string) || "",
          amount: Number(t.tokenAmount) || 0,
          price: Number(t.price) || 0,
          type: (t.side as string) === "buy" ? ("buy" as const) : ("sell" as const),
          tokenSymbol: (t.tokenSymbol as string) || "",
        };
      }
    );

    cache.set(cacheKey, trades, CACHE_DURATIONS.TRADES);
    return trades;
  } catch (error: any) {
    console.error(
      `[Birdeye API] getTokenTrades failed for mint: ${mint}. Error: ${
        error?.message || error
      }`
    );
    return [];
  }
}

/**
 * Get OHLCV data for charts
 */
export async function getTokenOHLCV(mint: string, timeFrame = "1H"): Promise<OHLCV[]> {
  if (!mint) return [];
  if (typeof window !== "undefined") {
    return fetchFromProxy<OHLCV[]>("ohlcv", { mint, timeframe: timeFrame });
  }

  const cacheKey = cacheKeys.getTokenOHLCVKey(mint, timeFrame);
  const cached = cache.get<OHLCV[]>(cacheKey);
  if (cached) return cached;

  try {
    const timeMap: Record<string, string> = {
      "1m": "1m",
      "5m": "5m",
      "15m": "15m",
      "1H": "1H",
      "4H": "4H",
      "1D": "1D",
    };

    const now = Math.floor(Date.now() / 1000);
    const rangeMap: Record<string, number> = {
      "1m": 3600,        // 1 hour of 1m candles
      "5m": 14400,       // 4 hours of 5m candles
      "15m": 43200,      // 12 hours of 15m candles
      "1H": 604800,      // 7 days of 1H candles
      "4H": 2592000,     // 30 days of 4H candles
      "1D": 7776000,     // 90 days of 1D candles
    };

    const timeFrom = now - (rangeMap[timeFrame] || 604800);

    const response = await fetchWithRetry(() =>
      birdeyeClient.get("/defi/ohlcv", {
        params: {
          address: mint,
          type: timeMap[timeFrame] || "1H",
          time_from: timeFrom,
          time_to: now,
        },
      })
    );

    const ohlcv: OHLCV[] = (response.data?.data?.items || []).map(
      (c: Record<string, unknown>) => ({
        time: Number(c.unixTime) || 0,
        open: Number(c.o) || 0,
        high: Number(c.h) || 0,
        low: Number(c.l) || 0,
        close: Number(c.c) || 0,
        volume: Number(c.v) || 0,
      })
    );

    if (ohlcv.length > 0) {
      cache.set(cacheKey, ohlcv, CACHE_DURATIONS.OHLCV);
    }
    return ohlcv;
  } catch (error: any) {
    console.error(
      `[Birdeye API] getTokenOHLCV failed for mint: ${mint}, timeFrame: ${timeFrame}. Error: ${
        error?.message || error
      }`
    );
    return [];
  }
}
