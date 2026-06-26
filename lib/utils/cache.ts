export class APICache {
  private store = new Map<string, { data: unknown; expiresAt: number }>();

  /**
   * Retrieves data from the cache. Returns null if expired or not found.
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Sets data in the cache with a specific duration (in milliseconds).
   */
  set(key: string, data: unknown, durationMs: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + durationMs,
    });
  }

  /**
   * Clears a specific cache entry.
   */
  clear(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clears all cache entries.
   */
  clearAll(): void {
    this.store.clear();
  }
}

// Durations in milliseconds
export const CACHE_DURATIONS = {
  TRENDING_TOKENS: 2 * 60 * 1000, // 2 minutes
  TOKEN_PRICE: 30 * 1000,         // 30 seconds
  HOLDERS: 2 * 60 * 1000,         // 2 minutes
  TRADES: 15 * 1000,              // 15 seconds
  OHLCV: 60 * 1000,               // 1 minute
};

// Cache Key Generators
export const cacheKeys = {
  getTrendingTokensKey: (limit: number) => `trending_tokens_${limit}`,
  getTokenPriceKey: (mint: string) => `token_price_${mint}`,
  getTokenHoldersKey: (mint: string) => `token_holders_${mint}`,
  getTokenTradesKey: (mint: string) => `token_trades_${mint}`,
  getTokenOHLCVKey: (mint: string, timeFrame: string) => `token_ohlcv_${mint}_${timeFrame}`,
};
