"use client";

import { useEffect, Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTokens } from "@/context/AppContext";
import TradeLayout from "@/components/trading/TradeLayout";
import LeftPanel from "@/components/trading/LeftPanel";
import MiddlePanel from "@/components/trading/MiddlePanel";
import RightPanel from "@/components/trading/RightPanel";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getTokenPrice } from "@/lib/api/birdeye";

const SOL_MINT = "So11111111111111111111111111111111111111112";

function TradingContent() {
  const searchParams = useSearchParams();
  const { selectedToken, setSelectedToken } = useTokens();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Safely extract token mint with fallback
  const tokenMint = useMemo(() => {
    try {
      const token = searchParams.get("token");
      // Basic validation: Solana addresses are base58 and usually 32-44 characters
      if (token && token.length >= 32 && token.length <= 44) {
        return token;
      }
    } catch (e) {
      console.error("[TradingContent] Failed to parse token param:", e);
    }
    return SOL_MINT;
  }, [searchParams]);

  // Load token from URL params
  useEffect(() => {
    let active = true;

    const loadToken = async () => {
      try {
        if (!selectedToken || selectedToken.mint !== tokenMint) {
          const tokenData = await getTokenPrice(tokenMint);
          if (!active) return;

          if (tokenData) {
            setSelectedToken(tokenData);
            setErrorMsg(null);
          } else {
            console.warn(`[TradingContent] Token not found for mint: ${tokenMint}, falling back to SOL`);
            setSelectedToken({
              mint: SOL_MINT,
              name: "Solana",
              symbol: "SOL",
              price: 178.42,
              change24h: 3.25,
            });
          }
        }
      } catch (err: any) {
        console.error("[TradingContent] Error loading token data:", err);
        if (active) {
          setErrorMsg(err instanceof Error ? err.message : "Error loading token data");
          // Safe fallback to SOL
          setSelectedToken({
            mint: SOL_MINT,
            name: "Solana",
            symbol: "SOL",
            price: 178.42,
            change24h: 3.25,
          });
        }
      }
    };

    loadToken();

    return () => {
      active = false;
    };
  }, [tokenMint, selectedToken, setSelectedToken]);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {errorMsg && (
        <div className="bg-neon-red/10 border-b border-neon-red/20 py-2 px-4 text-center text-xs text-neon-red">
          System notice: {errorMsg}. Restored SOL terminal fallback.
        </div>
      )}
      <TradeLayout
        leftPanel={<LeftPanel />}
        middlePanel={<MiddlePanel />}
        rightPanel={<RightPanel />}
      />
    </div>
  );
}

export default function TradingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-chad-bg">
          <LoadingSpinner size="lg" text="Loading trading terminal..." />
        </div>
      }
    >
      <TradingContent />
    </Suspense>
  );
}
