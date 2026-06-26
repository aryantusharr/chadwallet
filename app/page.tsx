"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useAuth } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import TokenBannerTop from "@/components/banners/TokenBannerTop";
import { useTrendingTokens } from "@/hooks/useTrendingTokens";
import { formatPrice, formatPercent } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const { authenticated } = usePrivy();
  const { walletAddress } = useAuth();
  const router = useRouter();
  const { tokens: trendingTokens, loading: tokensLoading } = useTrendingTokens(4);

  return (
    <div className="flex flex-col min-h-screen bg-[#06091e] overflow-hidden">
      {/* Top Banner Ticker */}
      <TokenBannerTop />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 border-b border-chad-border/20">
        {/* Abstract background grids/circles */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/3 w-[300px] h-[300px] bg-neon-green/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Logo Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-cyan/5 border border-neon-cyan/20 backdrop-blur-md animate-float">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-neon-cyan uppercase">
              Solana Web3 Trading Terminal
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight max-w-4xl mx-auto">
            Trade Memecoins Like A <br className="hidden sm:inline" />
            <span className="text-gradient-green">GigaChad</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
            The ultimate Solana terminal to scan trending tokens, track live holders, and trade with simulated balance in real-time.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => router.push("/trading")}
              className="w-full sm:w-auto btn-primary px-8 py-4 flex items-center justify-center gap-2.5 shadow-neon-green"
            >
              <svg className="w-5 h-5 text-[#0A0E27]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Start Trading Now
            </button>

            {!authenticated && (
              <button
                onClick={() => {
                  const el = document.querySelector("[data-privy-login]");
                  if (el) (el as HTMLElement).click();
                }}
                className="w-full sm:w-auto btn-secondary px-8 py-4 flex items-center justify-center gap-2 hover:bg-neon-cyan/10"
              >
                Connect Privy Wallet
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Live Market Section */}
      <section className="py-16 border-b border-chad-border/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left md:flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Live Memecoin Market
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">
                Real-time price updates powered by Birdeye Solana API.
              </p>
            </div>
            <Link
              href="/trading"
              className="hidden md:inline-flex items-center gap-2 text-xs font-bold text-neon-cyan hover:underline hover:text-white transition-colors"
            >
              Go to Trading Terminal
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Tokens Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tokensLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-[120px] rounded-2xl bg-chad-bg-card border border-chad-border/50 shimmer" />
              ))
            ) : trendingTokens && trendingTokens.length > 0 ? (
              trendingTokens.map((token, idx) => {
                const isPositive = (token.change24h || 0) >= 0;
                return (
                  <button
                    key={token.mint || idx}
                    onClick={() => router.push(`/trading?token=${token.mint}`)}
                    className="flex flex-col p-5 rounded-2xl bg-chad-bg-card border border-chad-border/60 hover:border-neon-cyan/40 transition-all duration-300 hover:shadow-card-hover group text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-green/20 flex items-center justify-center border border-neon-cyan/15 group-hover:scale-105 transition-transform">
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
                            {token.symbol?.charAt(0) || "?"}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white truncate max-w-[120px]">
                          {token.symbol || "???"}
                        </h3>
                        <p className="text-[11px] text-gray-400 truncate max-w-[120px]">
                          {token.name || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between mt-auto">
                      <span className="text-lg font-bold text-neon-cyan font-mono">
                        {formatPrice(token.price)}
                      </span>
                      <span
                        className={`text-xs font-bold font-mono ${
                          isPositive ? "text-neon-green" : "text-neon-red"
                        }`}
                      >
                        {formatPercent(token.change24h)}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500 text-sm">
                No market data currently available.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature section */}
      <section className="py-16 md:py-24 border-b border-chad-border/20 bg-[#080b1e]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-white">Why Trade with ChadWallet?</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-3 leading-relaxed">
              We leverage real-time API caches to bypass Solana RPC congestion, giving you the fastest price feeds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Zero Lag Price Feeds",
                desc: "Server-side caching filters and processes API updates in milliseconds for a high-frequency trading feel.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Holder Analysis",
                desc: "Identify whales and analyze top holders instantly to secure your trades against sudden dumps.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-[#FF006E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Privy Smart Authentication",
                desc: "Seamless Google, Apple, and Email logins without seed phrases or third-party extension delays.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="glass-card p-8 hover:border-neon-cyan/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-chad-surface border border-chad-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App promo section (matches fomo.family landing scroll 2) */}
      <section className="py-20 bg-[#070a1c] border-b border-chad-border/20 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-neon-green/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Trade Anywhere. <br />
              Download the Mobile App.
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-lg leading-relaxed">
              Take the ChadWallet terminal on the go. Scan trending charts, execute virtual swaps, and manage your portfolio directly from iOS and Android.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <a href="#" className="flex items-center gap-3 px-5 py-3 bg-chad-surface hover:bg-chad-bg-card-hover border border-chad-border/60 hover:border-neon-cyan/40 rounded-xl transition-all group">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-neon-cyan transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.74-1.2 1.88-1.05 2.99 1.12.09 2.27-.58 2.99-1.44z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold leading-none">Download on the</p>
                  <p className="text-xs font-bold text-white group-hover:text-neon-cyan transition-colors leading-tight mt-0.5">App Store</p>
                </div>
              </a>

              <a href="#" className="flex items-center gap-3 px-5 py-3 bg-chad-surface hover:bg-chad-bg-card-hover border border-chad-border/60 hover:border-neon-green/40 rounded-xl transition-all group">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-neon-green transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 5.277c0-.203.018-.4.053-.585L12.41 14.1l-9.303 9.3c-.07-.176-.107-.37-.107-.577V5.277zm1.18-1.554a1.86 1.86 0 0 1 .865-.223c.335 0 .668.09 1.002.268l11.458 6.55L4.18 3.723zm13.325 6.545L6.046 22.82c-.334.177-.667.268-1.002.268a1.86 1.86 0 0 1-.865-.224l13.326-12.593zm.74-.707l3.298 1.885c.983.56 1.457 1.458 1.457 2.553 0 1.096-.474 1.993-1.457 2.553l-3.298 1.886-4.004-4.437 4.004-4.44z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold leading-none">Get it on</p>
                  <p className="text-xs font-bold text-white group-hover:text-neon-green transition-colors leading-tight mt-0.5">Google Play</p>
                </div>
              </a>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-72 h-[500px] border-[6px] border-chad-border bg-chad-bg rounded-[40px] shadow-2xl overflow-hidden flex flex-col justify-between p-4 z-20 hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-4 bg-chad-border rounded-full mx-auto mb-2" />
              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                <Image
                  src="/logo-cyan.png"
                  alt="ChadWallet App icon"
                  width={64}
                  height={64}
                  className="animate-float"
                />
                <h4 className="text-sm font-bold text-white">ChadWallet Mobile</h4>
                <p className="text-[11px] text-gray-400 max-w-[200px]">Scan, analyze, and trade memecoins with a tap.</p>
                <button
                  onClick={() => router.push("/trading")}
                  className="btn-primary py-2 px-6 text-xs"
                >
                  Start Demo
                </button>
              </div>
              <div className="w-24 h-1.5 bg-chad-border rounded-full mx-auto mt-2" />
            </div>
            {/* Ambient background shadow behind device */}
            <div className="absolute right-12 w-64 h-64 bg-neon-cyan/10 rounded-full blur-[80px]" />
          </div>
        </div>
      </section>
    </div>
  );
}
