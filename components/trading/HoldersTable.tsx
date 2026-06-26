"use client";

import { useState, useCallback } from "react";
import type { TokenHolder } from "@/lib/types";

interface HoldersTableProps {
  holders: TokenHolder[];
  loading?: boolean;
}

export default function HoldersTable({ holders, loading }: HoldersTableProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopy = useCallback(async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch {
      console.error("Failed to copy");
    }
  }, []);

  const truncate = (addr: string) =>
    addr.length > 8 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr;

  const formatAmount = (amount: number): string => {
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(2)}B`;
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(2)}K`;
    return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div className="glass-card p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Top Holders
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
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Top Holders
        </h3>
      </div>

      {holders.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-gray-400">No holder data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2.5 text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                  Address
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-neon-cyan uppercase tracking-wider text-right">
                  Amount
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-neon-cyan uppercase tracking-wider text-right">
                  % Supply
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chad-border/20">
              {holders.map((holder, index) => (
                <tr
                  key={holder.address}
                  className="hover:bg-chad-bg-card-hover transition-colors"
                >
                  <td className="px-4 py-2.5 text-sm text-gray-400 font-mono">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-white" title={holder.address}>
                        {truncate(holder.address)}
                      </span>
                      <button
                        onClick={() => handleCopy(holder.address)}
                        className="p-1 rounded hover:bg-chad-surface transition-colors"
                        title="Copy address"
                      >
                        {copiedAddress === holder.address ? (
                          <svg className="w-3.5 h-3.5 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-white text-right font-mono">
                    {formatAmount(holder.amount)}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-chad-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-green"
                          style={{ width: `${Math.min(holder.percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-neon-cyan font-mono">
                        {holder.percentage.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {copiedAddress && <div className="toast">✓ Address copied</div>}
    </div>
  );
}
