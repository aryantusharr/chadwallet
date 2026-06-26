"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import type { Token } from "@/lib/types";
import { getBalance } from "@/lib/api/solana";

interface AuthContextType {
  isLoggedIn: boolean;
  walletAddress: string | null;
  solBalance: number;
  simulatedSolBalance: number;
  simulatedTokenBalances: Record<string, number>;
  setLoggedIn: (loggedIn: boolean) => void;
  setWalletAddress: (address: string | null) => void;
  refreshBalance: () => Promise<void>;
  executeSimulatedTrade: (type: "buy" | "sell", token: Token, amount: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  walletAddress: null,
  solBalance: 0,
  simulatedSolBalance: 10.0,
  simulatedTokenBalances: {},
  setLoggedIn: () => {},
  setWalletAddress: () => {},
  refreshBalance: async () => {},
  executeSimulatedTrade: async () => false,
});

interface TokenContextType {
  selectedToken: Token | null;
  trendingTokens: Token[];
  setSelectedToken: (token: Token | null) => void;
  setTrendingTokens: (tokens: Token[]) => void;
}

const TokenContext = createContext<TokenContextType>({
  selectedToken: null,
  trendingTokens: [],
  setSelectedToken: () => {},
  setTrendingTokens: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState(0);

  const [simulatedSolBalance, setSimulatedSolBalance] = useState<number>(10.0);
  const [simulatedTokenBalances, setSimulatedTokenBalances] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSol = localStorage.getItem("sim_sol_balance");
      if (storedSol !== null) {
        setSimulatedSolBalance(Number(storedSol));
      } else {
        localStorage.setItem("sim_sol_balance", "10.0");
      }

      const storedTokens = localStorage.getItem("sim_token_balances");
      if (storedTokens !== null) {
        try {
          setSimulatedTokenBalances(JSON.parse(storedTokens));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const executeSimulatedTrade = useCallback(async (type: "buy" | "sell", token: Token, amount: number) => {
    if (amount <= 0 || !token) return false;

    if (type === "buy") {
      if (simulatedSolBalance < amount) return false;
      const tokenReceived = amount / token.price;
      const newSol = simulatedSolBalance - amount;
      const currentTokenBal = simulatedTokenBalances[token.mint] || 0;
      const newTokenBal = currentTokenBal + tokenReceived;

      const newBalances = { ...simulatedTokenBalances, [token.mint]: newTokenBal };
      setSimulatedSolBalance(newSol);
      setSimulatedTokenBalances(newBalances);
      localStorage.setItem("sim_sol_balance", String(newSol));
      localStorage.setItem("sim_token_balances", JSON.stringify(newBalances));
      return true;
    } else {
      const currentTokenBal = simulatedTokenBalances[token.mint] || 0;
      if (currentTokenBal < amount) return false;
      const solReceived = amount * token.price;
      const newSol = simulatedSolBalance + solReceived;
      const newTokenBal = currentTokenBal - amount;

      const newBalances = { ...simulatedTokenBalances, [token.mint]: newTokenBal };
      setSimulatedSolBalance(newSol);
      setSimulatedTokenBalances(newBalances);
      localStorage.setItem("sim_sol_balance", String(newSol));
      localStorage.setItem("sim_token_balances", JSON.stringify(newBalances));
      return true;
    }
  }, [simulatedSolBalance, simulatedTokenBalances]);

  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [trendingTokens, setTrendingTokens] = useState<Token[]>([]);

  const refreshBalance = useCallback(async () => {
    if (walletAddress) {
      try {
        const balance = await getBalance(walletAddress);
        setSolBalance(balance);
      } catch (error) {
        console.error("Failed to refresh balance:", error);
      }
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      refreshBalance();
    } else {
      setSolBalance(0);
    }
  }, [walletAddress, refreshBalance]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        walletAddress,
        solBalance,
        simulatedSolBalance,
        simulatedTokenBalances,
        setLoggedIn,
        setWalletAddress,
        refreshBalance,
        executeSimulatedTrade,
      }}
    >
      <TokenContext.Provider
        value={{
          selectedToken,
          trendingTokens,
          setSelectedToken,
          setTrendingTokens,
        }}
      >
        {children}
      </TokenContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AppProvider");
  }
  return context;
}

export function useTokens() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokens must be used within AppProvider");
  }
  return context;
}
