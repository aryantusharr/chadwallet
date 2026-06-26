"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Token } from "@/lib/types";
import { getTrendingTokens } from "@/lib/api/birdeye";

interface UseTrendingTokensReturn {
  tokens: Token[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTrendingTokens(limit = 10): UseTrendingTokensReturn {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Throttling timer to prevent requests within 2 minutes
  const lastFetchTime = useRef<number>(0);
  const THROTTLE_DURATION = 2 * 60 * 1000; // 2 minutes

  const fetchTokens = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && tokens.length > 0 && now - lastFetchTime.current < THROTTLE_DURATION) {
      // Skip if throttled and not a forced refresh
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getTrendingTokens(limit);
      setTokens(data);
      lastFetchTime.current = now;
    } catch (err: any) {
      console.error("[useTrendingTokens] Fetch failed:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch trending tokens");
    } finally {
      setLoading(false);
    }
  }, [limit, tokens.length]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const refetch = useCallback(() => fetchTokens(true), [fetchTokens]);

  return { tokens, loading, error, refetch };
}
