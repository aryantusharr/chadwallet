"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { OHLCV, TimeFrame } from "@/lib/types";
import { useTokenChart } from "@/hooks/useTokenChart";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface PriceChartProps {
  mint: string | null;
}

const TIME_FRAMES: { label: string; value: TimeFrame }[] = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1H", value: "1H" },
  { label: "4H", value: "4H" },
  { label: "1D", value: "1D" },
];

export default function PriceChart({ mint }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<unknown>(null);
  const seriesRef = useRef<unknown>(null);
  const { chartData, loading, error, timeFrame, setTimeFrame } = useTokenChart(
    mint,
    "1H"
  );
  const [isChartReady, setIsChartReady] = useState(false);

  const initChart = useCallback(async () => {
    if (!chartContainerRef.current) return;

    try {
      const { createChart, ColorType, CrosshairMode } = await import(
        "lightweight-charts"
      );

      // Clear existing chart
      if (chartRef.current) {
        (chartRef.current as { remove: () => void }).remove();
      }

      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "#9ca3af",
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
        },
        grid: {
          vertLines: { color: "rgba(45, 58, 92, 0.3)" },
          horzLines: { color: "rgba(45, 58, 92, 0.3)" },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: "rgba(0, 217, 255, 0.3)",
            labelBackgroundColor: "#141937",
          },
          horzLine: {
            color: "rgba(0, 217, 255, 0.3)",
            labelBackgroundColor: "#141937",
          },
        },
        timeScale: {
          borderColor: "rgba(45, 58, 92, 0.5)",
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: "rgba(45, 58, 92, 0.5)",
        },
        handleScroll: { vertTouchDrag: false },
      });

      const series = chart.addCandlestickSeries({
        upColor: "#00FF41",
        downColor: "#FF006E",
        borderDownColor: "#FF006E",
        borderUpColor: "#00FF41",
        wickDownColor: "#FF006E",
        wickUpColor: "#00FF41",
      });

      chartRef.current = chart;
      seriesRef.current = series;
      setIsChartReady(true);

      // Responsive resize
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          chart.applyOptions({ width, height });
        }
      });

      resizeObserver.observe(chartContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        chart.remove();
      };
    } catch (err) {
      console.error("Failed to initialize chart:", err);
    }
  }, []);

  // Initialize chart
  useEffect(() => {
    initChart();
  }, [initChart]);

  // Update chart data
  useEffect(() => {
    if (!isChartReady || !seriesRef.current || chartData.length === 0) return;

    const formattedData = chartData
      .map((d: OHLCV) => ({
        time: d.time as unknown as import("lightweight-charts").Time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
      .sort((a, b) => (a.time as number) - (b.time as number));

    try {
      const series = seriesRef.current as {
        setData: (data: unknown[]) => void;
      };
      series.setData(formattedData);

      const chart = chartRef.current as {
        timeScale: () => { fitContent: () => void };
      };
      chart.timeScale().fitContent();
    } catch (err) {
      console.error("Failed to update chart data:", err);
    }
  }, [chartData, isChartReady]);

  return (
    <div className="glass-card overflow-hidden">
      {/* Timeframe Selector */}
      <div className="flex items-center justify-between p-3 border-b border-chad-border/50">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Price Chart
        </span>
        <div className="flex gap-1">
          {TIME_FRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeFrame(tf.value)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                timeFrame === tf.value
                  ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30"
                  : "text-gray-400 hover:text-white hover:bg-chad-surface"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-[350px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-chad-bg/50">
            <LoadingSpinner size="md" text="Loading chart..." />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-chad-bg/50">
            <p className="text-sm text-neon-red mb-2">{error}</p>
            <button onClick={() => setTimeFrame(timeFrame)} className="btn-secondary text-xs py-1.5 px-3">
              Retry
            </button>
          </div>
        )}

        {!mint && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <p className="text-sm text-gray-400">Select a token to view chart</p>
          </div>
        )}

        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
