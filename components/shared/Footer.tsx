"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-[#070a1c] border-t border-chad-border/40 py-12 overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo-green.png"
                  alt="ChadWallet Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-white tracking-tight">Chad</span>
                <span className="text-lg font-bold text-neon-green tracking-tight">Wallet</span>
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              The premier high-performance Solana trading terminal. Instant quotes, charts, and lightning-fast execution.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-chad-surface border border-chad-border/40 hover:border-neon-cyan/50 hover:text-neon-cyan transition-all text-gray-400" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-chad-surface border border-chad-border/40 hover:border-neon-green/50 hover:text-neon-green transition-all text-gray-400" aria-label="Telegram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-chad-surface border border-chad-border/40 hover:border-neon-red/50 hover:text-neon-red transition-all text-gray-400" aria-label="Discord">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.504 4.8a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 01-1.873-.894.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 01.078.009c.12.099.246.195.373.289a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neon-cyan">Terminal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/trading" className="text-xs text-gray-400 hover:text-white transition-colors">
                  Swap Interface
                </Link>
              </li>
              <li>
                <Link href="/trading" className="text-xs text-gray-400 hover:text-white transition-colors">
                  Live Charts
                </Link>
              </li>
              <li>
                <Link href="/trading" className="text-xs text-gray-400 hover:text-white transition-colors">
                  Trending Tokens
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neon-green">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile App Download badges */}
          <div className="space-y-3 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Get the App</h4>
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 pt-1">
              {/* App Store badge */}
              <a href="#" className="flex items-center gap-3 px-4 py-2 bg-chad-surface hover:bg-chad-bg-card-hover border border-chad-border/60 hover:border-neon-cyan/40 rounded-xl transition-all group">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-neon-cyan transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.74-1.2 1.88-1.05 2.99 1.12.09 2.27-.58 2.99-1.44z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold leading-none">Download on the</p>
                  <p className="text-xs font-bold text-white group-hover:text-neon-cyan transition-colors leading-tight mt-0.5">App Store</p>
                </div>
              </a>

              {/* Google Play badge */}
              <a href="#" className="flex items-center gap-3 px-4 py-2 bg-chad-surface hover:bg-chad-bg-card-hover border border-chad-border/60 hover:border-neon-green/40 rounded-xl transition-all group">
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
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-chad-border/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} ChadWallet. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              All systems operational
            </span>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
              Status Page
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
