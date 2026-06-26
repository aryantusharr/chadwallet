"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Token, TokenHolder, Trade, OHLCV } from "@/lib/types";
import {
  getTokenPrice,
  getTokenHolders,
  getTokenTrades,
  getTokenOHLCV,
} from "@/lib/api/birdeye";

interface UseTokenDataReturn {
  price: Token | null;
  holders: TokenHolder[];
  trades: Trade[];
  ohlcv: OHLCV[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTokenData(mint: string | null): UseTokenDataReturn {
  const [price, setPrice] = useState<Token | null>(null);
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCV[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAllData = useCallback(async () => {
    if (!mint) {
      setPrice(null);
      setHolders([]);
      setTrades([]);
      setOhlcv([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all endpoints concurrently
      const [priceData, holdersData, tradesData, ohlcvData] = await Promise.allSettled([
        getTokenPrice(mint),
        getTokenHolders(mint, 5),
        getTokenTrades(mint, 10),
        getTokenOHLCV(mint, "1H"),
      ]);

      if (priceData.status === "fulfilled" && priceData.value !== null) {
        setPrice(priceData.value);
      } else if (priceData.status === "fulfilled" && priceData.value === null) {
        setPrice(null);
      }
      
      if (holdersData.status === "fulfilled") {
        setHolders(holdersData.value);
      }
      if (tradesData.status === "fulfilled") {
        setTrades(tradesData.value);
      }
      if (ohlcvData.status === "fulfilled") {
        setOhlcv(ohlcvData.value);
      }

      const isPriceFailed = priceData.status === "rejected" || (priceData.status === "fulfilled" && priceData.value === null);

      if (isPriceFailed) {
        setError("Failed to load token data. Please check the mint address.");
      }
    } catch (err: any) {
      console.error("[useTokenData] Fetch failed for mint:", mint, err);
      setError(err instanceof Error ? err.message : "Failed to fetch token data");
    } finally {
      setLoading(false);
    }
  }, [mint]);

  useEffect(() => {
    // Clear existing timer if any
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!mint) {
      setPrice(null);
      setHolders([]);
      setTrades([]);
      setOhlcv([]);
      setError(null);
      setLoading(false);
      return;
    }

    // Set loading immediately to show responsive UI during debounce
    setLoading(true);

    debounceTimerRef.current = setTimeout(() => {
      fetchAllData();
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [mint, fetchAllData]);

  return {
    price,
    holders,
    trades,
    ohlcv,
    loading,
    error,
    refetch: fetchAllData,
  };
}
