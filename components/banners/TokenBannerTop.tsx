"use client";

import { useTrendingTokens } from "@/hooks/useTrendingTokens";
import TokenCard from "@/components/banners/TokenCard";

interface TokenBannerProps {
  position?: "top" | "bottom";
}

export default function TokenBannerTop({ position = "top" }: TokenBannerProps) {
  const { tokens, loading } = useTrendingTokens(15);

  if (loading) {
    return (
      <div className="w-full py-2 bg-chad-bg overflow-hidden border-y border-chad-border/30">
        <div className="flex gap-4 px-4 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="min-w-[200px] h-[52px] rounded-xl bg-chad-bg-card border border-chad-border/50 shimmer"
            />
          ))}
        </div>
      </div>
    );
  }

  if (tokens.length === 0) return null;

  // Quadruple the tokens list to ensure the marquee content is wide enough for seamless looping
  const marqueeTokens = [...tokens, ...tokens, ...tokens, ...tokens];

  return (
    <div
      className={`w-full bg-[#080b1e] border-y border-chad-border/30 py-2 relative overflow-hidden select-none`}
    >
      {/* Seamless Marquee Container */}
      <div className="flex w-full overflow-hidden">
        <div className="flex gap-4 animate-banner-scroll w-max hover:[animation-play-state:paused] py-0.5">
          {marqueeTokens.map((token, index) => (
            <div
              key={`${token.mint}-${index}`}
              className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
            >
              <TokenCard token={token} compact />
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Neon Glow / Shadow Edges */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-chad-bg to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-chad-bg to-transparent pointer-events-none z-10" />
    </div>
  );
}

