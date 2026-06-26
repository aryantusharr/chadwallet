"use client";

import Link from "next/link";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import LoginButton from "@/components/auth/LoginButton";
import WalletDisplay from "@/components/auth/WalletDisplay";
import { useAuth } from "@/context/AppContext";

export default function Header() {
  const { authenticated, user } = usePrivy();
  const { setLoggedIn, setWalletAddress } = useAuth();

  // Sync Privy state with AppContext
  useEffect(() => {
    setLoggedIn(authenticated);
    if (authenticated && user?.wallet?.address) {
      setWalletAddress(user.wallet.address);
    } else {
      setWalletAddress(null);
    }
  }, [authenticated, user, setLoggedIn, setWalletAddress]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-chad-bg/80 backdrop-blur-xl border-b border-chad-border/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/logo-green.png"
                alt="ChadWallet Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white tracking-tight">
                Chad
              </span>
              <span className="text-xl font-bold text-neon-green tracking-tight">
                Wallet
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Home
            </Link>
            {authenticated && (
              <Link
                href="/trading"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/5 transition-all duration-200"
              >
                Trading
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {/* Mobile nav */}
            {authenticated && (
              <Link
                href="/trading"
                className="sm:hidden p-2 rounded-lg text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </Link>
            )}

            {authenticated ? <WalletDisplay /> : <LoginButton />}
          </div>
        </div>
      </div>
    </header>
  );
}
