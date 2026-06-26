"use client";

import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTokens } from "@/context/AppContext";
import { useTokenData } from "@/hooks/useTokenData";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  formatPrice,
  formatPercent,
  formatAddress,
  formatTokenAmount,
  formatTime,
} from "@/lib/utils/format";

const PriceChart = dynamic(() => import("@/components/trading/PriceChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-chad-bg-card border border-chad-border/30 rounded-xl">
      <LoadingSpinner text="Initializing terminal chart..." />
    </div>
  ),
});

export default memo(function MiddlePanel({ selectedToken: propToken }: any) {
  const { selectedToken: contextToken } = useTokens();
  const selectedToken = propToken || contextToken;

  const { price, holders, trades, loading, error, refetch } = useTokenData(
    selectedToken?.mint || null
  );

  const displayToken = price || selectedToken;
  const isPositive = (displayToken?.change24h || 0) >= 0;

  const tokenHeader = useMemo(() => {
    if (!displayToken) return null;
    return (
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-green/20 flex items-center justify-center border border-neon-cyan/20">
            {displayToken.imageUrl ? (
              <img
                src={displayToken.imageUrl}
                alt={displayToken.symbol}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-lg font-bold text-neon-cyan">
                {displayToken.symbol?.charAt(0) || "?"}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                {displayToken.name || "Unknown Token"}
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-chad-surface text-xs font-semibold text-gray-400">
                {displayToken.symbol || "???"}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-bold text-neon-cyan text-glow-cyan">
                {formatPrice(displayToken.price)}
              </span>
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-semibold ${
                  isPositive
                    ? "bg-neon-green/10 text-neon-green"
                    : "bg-neon-red/10 text-neon-red"
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 ${!isPositive ? "rotate-180" : ""}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 14l5-5 5 5z" />
                </svg>
                {formatPercent(displayToken.change24h)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {displayToken.volume24h !== undefined && (
            <div className="text-right">
              <p className="text-xs text-gray-400">24h Volume</p>
              <p className="text-sm font-semibold text-white">
                {formatPrice(displayToken.volume24h)}
              </p>
            </div>
          )}
          {displayToken.marketCap !== undefined && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Market Cap</p>
              <p className="text-sm font-semibold text-white">
                {formatPrice(displayToken.marketCap)}
              </p>
            </div>
          )}
          {displayToken.liquidity !== undefined && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Liquidity</p>
              <p className="text-sm font-semibold text-white">
                {formatPrice(displayToken.liquidity)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }, [displayToken, isPositive]);

  const holdersContent = useMemo(() => {
    if (loading && holders.length === 0) {
      return (
        <div className="space-y-2 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 skeleton-box" />
          ))}
        </div>
      );
    }
    if (error && holders.length === 0) {
      return (
        <div className="text-neon-red p-6 text-center text-sm">
          Failed to load holders: {error}
        </div>
      );
    }
    if (!holders || holders.length === 0) {
      return (
        <div className="p-6 text-center text-sm text-gray-400">
          No holders data available
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-chad-border/30">
              <th className="px-4 py-2 text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                Rank
              </th>
              <th className="px-4 py-2 text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                Address
              </th>
              <th className="px-4 py-2 text-xs font-semibold text-neon-cyan uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="px-4 py-2 text-xs font-semibold text-neon-cyan uppercase tracking-wider text-right">
                % Supply
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-chad-border/20">
            {holders.map((holder, idx) => (
              <tr
                key={holder.address || idx}
                className="hover:bg-chad-bg-card-hover transition-colors"
              >
                <td className="px-4 py-2 text-sm text-gray-400 font-mono">
                  {idx + 1}
                </td>
                <td className="px-4 py-2 text-sm font-mono text-white">
                  <div className="flex items-center gap-2">
                    <span>{formatAddress(holder.address)}</span>
                    <button
                      onClick={() => {
                        if (holder.address) {
                          navigator.clipboard.writeText(holder.address);
                        }
                      }}
                      className="p-1 rounded hover:bg-chad-surface text-gray-500 hover:text-gray-300 transition-colors"
                      title="Copy Address"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-white text-right font-mono">
                  {formatTokenAmount(holder.amount)}
                </td>
                <td className="px-4 py-2 text-sm text-neon-cyan text-right font-mono">
                  {formatPercent(holder.percentage)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [holders, loading, error]);

  const tradesContent = useMemo(() => {
    if (loading && trades.length === 0) {
      return (
        <div className="space-y-2 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 skeleton-box" />
          ))}
        </div>
      );
    }
    if (error && trades.length === 0) {
      return (
        <div className="text-neon-red p-6 text-center text-sm">
          Failed to load trades: {error}
        </div>
      );
    }
    if (!trades || trades.length === 0) {
      return (
        <div className="p-6 text-center text-sm text-gray-400">
          No trades yet
        </div>
      );
    }

    return (
      <div className="overflow-x-auto max-h-[300px] overflow-y-auto hide-scrollbar">
        <table className="w-full">
          <thead className="sticky top-0 bg-chad-bg-card z-10">
            <tr className="text-left border-b border-chad-border/30">
              <th className="px-4 py-2 text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-2 text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-2 text-xs font-semibold text-neon-cyan uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="px-4 py-2 text-xs font-semibold text-neon-cyan uppercase tracking-wider text-right">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-chad-border/20">
            {trades.map((trade, idx) => (
              <tr
                key={trade.txHash || idx}
                className="hover:bg-chad-bg-card-hover transition-colors"
              >
                <td className="px-4 py-2 text-xs text-gray-400 whitespace-nowrap">
                  {formatTime(trade.time)}
                </td>
                <td className="px-4 py-2 text-xs font-bold uppercase">
                  <span
                    className={
                      trade.type === "buy"
                        ? "text-neon-green bg-neon-green/10 px-1.5 py-0.5 rounded"
                        : "text-neon-red bg-neon-red/10 px-1.5 py-0.5 rounded"
                    }
                  >
                    {trade.type}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-white text-right font-mono">
                  {formatTokenAmount(trade.amount)}
                </td>
                <td className="px-4 py-2 text-sm text-white text-right font-mono">
                  {formatPrice(trade.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [trades, loading, error]);

  if (!selectedToken) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-neon-cyan/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Select a Token
        </h3>
        <p className="text-sm text-gray-400">
          Choose a token from the trending list to view charts and data
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass-card p-4">
        {tokenHeader}

        {error && (
          <div className="mt-3 flex items-center justify-between p-2 rounded-lg bg-neon-red/5 border border-neon-red/20">
            <p className="text-xs text-neon-red">{error}</p>
            <button
              onClick={() => refetch()}
              className="text-xs text-neon-cyan hover:underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div className="glass-card p-4">
        <PriceChart mint={selectedToken.mint} />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-chad-border/50">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Top Holders
          </h3>
        </div>
        {holdersContent}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-chad-border/50 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Live Trades
          </h3>
        </div>
        {tradesContent}
      </div>
    </div>
  );
});
