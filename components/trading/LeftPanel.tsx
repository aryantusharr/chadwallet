"use client";

import { memo, useMemo, useState, useEffect } from "react";
import { useTrendingTokens } from "@/hooks/useTrendingTokens";
import { useTokens } from "@/context/AppContext";
import type { Token } from "@/lib/types";
import { formatPrice, formatPercent } from "@/lib/utils/format";

export default memo(function LeftPanel() {
  const { tokens, loading, error, refetch } = useTrendingTokens(15);
  const { selectedToken, setSelectedToken } = useTokens();
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    } else {
      setLocalError(null);
    }
  }, [error]);

  const handleTokenClick = (token: Token) => {
    try {
      setSelectedToken(token);
    } catch (err: any) {
      console.error("[LeftPanel] Failed to select token:", err);
      setLocalError("Failed to select token. Please try again.");
    }
  };

  const tokenListContent = useMemo(() => {
    if (loading && tokens.length === 0) {
      return (
        <div className="p-4 space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-4 skeleton-box" />
              <div className="w-8 h-8 skeleton-circle" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 skeleton-box" />
                <div className="h-3 w-1/2 skeleton-box" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (localError && tokens.length === 0) {
      return (
        <div className="p-4 text-center">
          <p className="text-sm text-neon-red mb-3">{localError}</p>
          <button
            onClick={() => {
              setLocalError(null);
              refetch();
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (tokens.length === 0) {
      return (
        <div className="p-6 text-center text-sm text-gray-400">
          No trending tokens found
        </div>
      );
    }

    return (
      <div className="divide-y divide-chad-border/30">
        {tokens.map((token, index) => {
          const isSelected = selectedToken?.mint === token.mint;
          const isPositive = token.change24h >= 0;

          return (
            <button
              key={token.mint || index}
              onClick={() => handleTokenClick(token)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 text-left ${
                isSelected
                  ? "bg-neon-cyan/5 border-l-2 border-l-neon-cyan"
                  : "hover:bg-chad-bg-card-hover border-l-2 border-l-transparent"
              }`}
            >
              <span className="text-xs text-gray-500 w-5 text-right font-mono">
                {index + 1}
              </span>

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-green/20 flex items-center justify-center border border-chad-border flex-shrink-0">
                {token.imageUrl ? (
                  <img
                    src={token.imageUrl}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-xs font-bold text-neon-cyan">
                    {token.symbol?.charAt(0) || "?"}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white truncate">
                    {token.symbol || "???"}
                  </span>
                  <span className="text-sm font-mono text-white ml-2">
                    {formatPrice(token.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-gray-400 truncate">
                    {token.name || "Unknown Token"}
                  </span>
                  <span
                    className={`text-xs font-semibold ml-2 ${
                      isPositive ? "text-neon-green" : "text-neon-red"
                    }`}
                  >
                    {formatPercent(token.change24h)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }, [tokens, loading, localError, selectedToken, refetch]);

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-chad-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Trending
            </h2>
          </div>
          <button
            onClick={() => refetch()}
            className="p-1.5 rounded-lg hover:bg-chad-surface transition-colors group"
            title="Refresh"
          >
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-neon-cyan transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto hide-scrollbar">
        {tokenListContent}
      </div>
    </div>
  );
});
