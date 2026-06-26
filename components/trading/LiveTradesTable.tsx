"use client";

import type { Trade } from "@/lib/types";

interface LiveTradesTableProps {
  trades: Trade[];
  loading?: boolean;
}

export default function LiveTradesTable({
  trades,
  loading,
}: LiveTradesTableProps) {
  const truncate = (addr: string) =>
    addr && addr.length > 8 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr || "—";

  const formatAmount = (amount: number): string => {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(2)}K`;
    return amount.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  const formatPrice = (price: number): string => {
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toExponential(2)}`;
  };

  if (loading) {
    return (
      <div className="glass-card p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Live Trades
        </h3>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 shimmer rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-chad-border/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Live Trades
          </h3>
        </div>
      </div>

      {trades.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-gray-400">No recent trades</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto hide-scrollbar">
          <table className="w-full">
            <thead className="sticky top-0 bg-chad-bg-card z-10">
              <tr className="text-left">
                <th className="px-4 py-2.5 text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-neon-cyan uppercase tracking-wider text-right">
                  Amount
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-neon-cyan uppercase tracking-wider text-right">
                  Price
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-neon-cyan uppercase tracking-wider hidden sm:table-cell">
                  Maker
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chad-border/20">
              {trades.map((trade, index) => (
                <tr
                  key={`${trade.txHash}-${index}`}
                  className="hover:bg-chad-bg-card-hover transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-4 py-2.5 text-xs text-gray-400 whitespace-nowrap">
                    {trade.time}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        trade.type === "buy"
                          ? "bg-neon-green/10 text-neon-green"
                          : "bg-neon-red/10 text-neon-red"
                      }`}
                    >
                      {trade.type === "buy" ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14l5-5 5 5z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      )}
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-white text-right font-mono">
                    {formatAmount(trade.amount)}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-white text-right font-mono">
                    {formatPrice(trade.price)}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-400 font-mono hidden sm:table-cell">
                    {truncate(trade.buyer)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
