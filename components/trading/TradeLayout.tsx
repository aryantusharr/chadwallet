"use client";

import { ReactNode } from "react";

interface TradeLayoutProps {
  leftPanel: ReactNode;
  middlePanel: ReactNode;
  rightPanel: ReactNode;
}

export default function TradeLayout({
  leftPanel,
  middlePanel,
  rightPanel,
}: TradeLayoutProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Panel - Trending Tokens */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <div className="sticky top-20">{leftPanel}</div>
        </div>

        {/* Middle Panel - Chart + Data */}
        <div className="lg:col-span-6 order-1 lg:order-2">{middlePanel}</div>

        {/* Right Panel - Buy/Sell */}
        <div className="lg:col-span-3 order-3">
          <div className="sticky top-20">{rightPanel}</div>
        </div>
      </div>
    </div>
  );
}
