"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useAuth } from "@/context/AppContext";
import { useState, useCallback } from "react";
import { truncateAddress } from "@/lib/api/solana";

export default function WalletDisplay() {
  const { user, logout } = usePrivy();
  const { solBalance, walletAddress } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const displayAddress =
    walletAddress ||
    user?.wallet?.address ||
    null;

  const handleCopy = useCallback(async () => {
    if (!displayAddress) return;
    try {
      await navigator.clipboard.writeText(displayAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy address");
    }
  }, [displayAddress]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setShowMenu(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logout]);

  if (!displayAddress) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-chad-bg-card border border-chad-border hover:border-neon-cyan/40 transition-all duration-300 group"
      >
        {/* SOL Balance */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">◎</span>
          </div>
          <span className="text-sm font-semibold text-white">
            {solBalance.toFixed(4)} SOL
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-chad-border" />

        {/* Address */}
        <span className="text-sm text-neon-cyan font-mono">
          {truncateAddress(displayAddress)}
        </span>

        {/* Dropdown arrow */}
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
            showMenu ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-chad-bg-card border border-chad-border shadow-card z-50 overflow-hidden animate-fade-in">
            {/* Wallet Info */}
            <div className="p-4 border-b border-chad-border">
              <p className="text-xs text-gray-400 mb-1">Wallet Address</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono text-neon-cyan flex-1 truncate">
                  {displayAddress}
                </p>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg hover:bg-chad-surface transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <svg className="w-4 h-4 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Balance */}
            <div className="p-4 border-b border-chad-border">
              <p className="text-xs text-gray-400 mb-1">SOL Balance</p>
              <p className="text-lg font-bold text-white">
                {solBalance.toFixed(4)}{" "}
                <span className="text-sm text-gray-400">SOL</span>
              </p>
            </div>

            {/* Network */}
            <div className="p-4 border-b border-chad-border">
              <p className="text-xs text-gray-400 mb-1">Network</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-sm text-white capitalize">
                  {process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full p-4 text-left text-sm text-neon-red hover:bg-neon-red/5 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Disconnect Wallet
            </button>
          </div>
        </>
      )}

      {/* Copied Toast */}
      {copied && (
        <div className="toast">
          ✓ Address copied to clipboard
        </div>
      )}
    </div>
  );
}
