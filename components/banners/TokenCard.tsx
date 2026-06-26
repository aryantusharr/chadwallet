"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import type { Token } from "@/lib/types";
import { formatPrice, formatPercent } from "@/lib/utils/format";

interface TokenCardProps {
  token: Token;
  compact?: boolean;
}

export default memo(function TokenCard({ token, compact = false }: TokenCardProps) {
  const router = useRouter();

  if (!token) return null;

  const isPositive = (token.change24h || 0) >= 0;

  const handleClick = () => {
    if (token.mint) {
      router.push(`/trading?token=${token.mint}`);
    }
  };

  const symbolChar = token.symbol?.charAt(0) || "?";

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-chad-bg-card border border-chad-border/50 hover:border-neon-cyan/40 transition-all duration-300 hover:shadow-card-hover min-w-[200px] group"
      >
        {/* Token icon */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-green/20 flex items-center justify-center border border-neon-cyan/20 flex-shrink-0">
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
              {symbolChar}
            </span>
          )}
        </div>

        <div className="flex flex-col items-start min-w-0">
          <span className="text-sm font-semibold text-white truncate">
            {token.symbol || "???"}
          </span>
          <span className="text-xs text-gray-400 truncate">
            {formatPrice(token.price)}
          </span>
        </div>

        <span
          className={`text-xs font-semibold ml-auto flex-shrink-0 ${
            isPositive ? "text-neon-green" : "text-neon-red"
          }`}
        >
          {formatPercent(token.change24h)}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex flex-col p-4 rounded-2xl bg-chad-bg-card border border-chad-border/50 hover:border-neon-cyan/40 transition-all duration-300 hover:shadow-card-hover min-w-[160px] w-[160px] group cursor-pointer"
    >
      {/* Token icon */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-green/20 flex items-center justify-center border border-neon-cyan/20 mb-3 group-hover:scale-110 transition-transform flex-shrink-0">
        {token.imageUrl ? (
          <img
            src={token.imageUrl}
            alt={token.symbol}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <span className="text-sm font-bold text-neon-cyan">
            {symbolChar}
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="text-sm font-bold text-white mb-0.5 truncate w-full text-left">
        {token.name || "Unknown Token"}
      </h3>
      <p className="text-xs text-gray-400 mb-2 truncate w-full text-left">
        {token.symbol || "???"}
      </p>

      {/* Price */}
      <p className="text-lg font-bold text-neon-cyan mb-1 text-left">
        {formatPrice(token.price)}
      </p>

      {/* Change */}
      <div
        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold w-fit ${
          isPositive
            ? "bg-neon-green/10 text-neon-green"
            : "bg-neon-red/10 text-neon-red"
        }`}
      >
        <svg
          className={`w-3 h-3 ${!isPositive ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7 14l5-5 5 5z" />
        </svg>
        {formatPercent(token.change24h)}
      </div>
    </button>
  );
});
