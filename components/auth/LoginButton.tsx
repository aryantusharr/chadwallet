"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

export default function LoginButton() {
  const { login, ready } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      login();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  if (!ready) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-chad-bg-card border border-chad-border opacity-50 cursor-not-allowed"
      >
        <div className="w-4 h-4 border-2 border-chad-border border-t-neon-cyan rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Loading...</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-green/10 to-neon-cyan/10 border border-neon-green/30 hover:border-neon-green/60 transition-all duration-300 hover:shadow-neon-green disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-chad-border border-t-neon-green rounded-full animate-spin" />
      ) : (
        <svg className="w-4 h-4 text-neon-green" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      )}
      <span className="text-sm font-semibold text-neon-green group-hover:text-white transition-colors">
        {isLoading ? "Connecting..." : "Sign In"}
      </span>
      <div className="absolute inset-0 rounded-xl bg-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}
