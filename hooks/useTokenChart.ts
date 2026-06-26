"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { OHLCV, TimeFrame } from "@/lib/types";
import { getTokenOHLCV } from "@/lib/api/birdeye";

interface UseTokenChartReturn {
  chartData: OHLCV[];
  loading: boolean;
  error: string | null;
  timeFrame: TimeFrame;
  setTimeFrame: (tf: TimeFrame) => void;
  refetch: () => Promise<void>;
}

export function useTokenChart(
  mint: string | null,
  initialTimeFrame: TimeFrame = "1H"
): UseTokenChartReturn {
  const [chartData, setChartData] = useState<OHLCV[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(initialTimeFrame);

  // Client-side cache throttling timestamps
  const lastFetchTime = useRef<Record<string, number>>({});
  const THROTTLE_DURATION = 60 * 1000; // 1 minute

  const fetchChart = useCallback(async (force = false) => {
    if (!mint) {
      setChartData([]);
      setLoading(false);
      setError(null);
      return;
    }

    const cacheKey = `${mint}_${timeFrame}`;
    const now = Date.now();
    
    if (!force && chartData.length > 0 && now - (lastFetchTime.current[cacheKey] || 0) < THROTTLE_DURATION) {
      // Throttle client-side requests within the 1-minute window
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getTokenOHLCV(mint, timeFrame);
      setChartData(data);
      lastFetchTime.current[cacheKey] = now;
    } catch (err: any) {
      console.error(`[useTokenChart] Fetch failed for mint ${mint} on ${timeFrame}:`, err);
      setError(err instanceof Error ? err.message : "Failed to fetch chart data");
    } finally {
      setLoading(false);
    }
  }, [mint, timeFrame, chartData.length]);

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  const refetch = useCallback(() => fetchChart(true), [fetchChart]);

  return {
    chartData,
    loading,
    error,
    timeFrame,
    setTimeFrame,
    refetch,
  };
}
