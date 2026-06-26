"use client";

import { useState, memo, useMemo, useEffect } from "react";
import { useTokens } from "@/context/AppContext";
import { useAuth } from "@/context/AppContext";
import { formatPrice, formatTokenAmount } from "@/lib/utils/format";

export default memo(function RightPanel() {
  const { selectedToken } = useTokens();
  const { simulatedSolBalance, simulatedTokenBalances, executeSimulatedTrade } = useAuth();
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const tokenSymbol = selectedToken?.symbol || "TOKEN";
  const tokenPrice = selectedToken?.price || 0;
  
  const solPrice = 178.00;

  useEffect(() => {
    setBuyAmount("");
    setSellAmount("");
    setErrorMsg(null);
  }, [selectedToken]);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  const estimatedTokens = useMemo(() => {
    if (!buyAmount || isNaN(parseFloat(buyAmount)) || tokenPrice === 0) return 0;
    return (parseFloat(buyAmount) * solPrice) / tokenPrice;
  }, [buyAmount, tokenPrice]);

  const estimatedSol = useMemo(() => {
    if (!sellAmount || isNaN(parseFloat(sellAmount)) || tokenPrice === 0) return 0;
    return (parseFloat(sellAmount) * tokenPrice) / solPrice;
  }, [sellAmount, tokenPrice]);

  const currentTokenBalance = useMemo(() => {
    if (!selectedToken) return 0;
    return simulatedTokenBalances[selectedToken.mint] || 0;
  }, [simulatedTokenBalances, selectedToken]);

  const currentTokenEstValue = useMemo(() => {
    return currentTokenBalance * tokenPrice;
  }, [currentTokenBalance, tokenPrice]);

  const handleBuy = async () => {
    setErrorMsg(null);
    if (!selectedToken) return;
    const amount = parseFloat(buyAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg("Please enter a valid amount");
      return;
    }
    if (simulatedSolBalance < amount) {
      setErrorMsg("Insufficient SOL balance");
      return;
    }

    const success = await executeSimulatedTrade("buy", selectedToken, amount);
    if (success) {
      setToastMessage(`Successfully bought ${formatTokenAmount(estimatedTokens)} ${tokenSymbol}!`);
      setBuyAmount("");
    } else {
      setErrorMsg("Failed to execute buy transaction");
    }
  };

  const handleSell = async () => {
    setErrorMsg(null);
    if (!selectedToken) return;
    const amount = parseFloat(sellAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg("Please enter a valid amount");
      return;
    }
    if (currentTokenBalance < amount) {
      setErrorMsg(`Insufficient ${tokenSymbol} balance`);
      return;
    }

    const success = await executeSimulatedTrade("sell", selectedToken, amount);
    if (success) {
      setToastMessage(`Successfully sold ${formatTokenAmount(amount)} ${tokenSymbol}!`);
      setSellAmount("");
    } else {
      setErrorMsg("Failed to execute sell transaction");
    }
  };

  const fillSellPercent = (pct: number) => {
    if (currentTokenBalance > 0) {
      setSellAmount((currentTokenBalance * pct).toString());
    }
  };

  return (
    <div className="space-y-4">
      {toastMessage && (
        <div className="toast">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-chad-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Buy {tokenSymbol}
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green font-bold uppercase tracking-wider">
              Simulated
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">
              Amount (SOL)
            </label>
            <div className="relative">
              <input
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                placeholder="0.00"
                className="chad-input pr-14"
                min="0"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 font-mono">
                SOL
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {["0.1", "0.5", "1.0", "5.0"].map((amt) => (
              <button
                key={amt}
                onClick={() => setBuyAmount(amt)}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-gray-400 bg-chad-surface hover:bg-chad-bg-card-hover hover:text-white transition-all border border-chad-border/30 hover:border-neon-cyan/30"
              >
                {amt}
              </button>
            ))}
          </div>

          {buyAmount && !isNaN(parseFloat(buyAmount)) && (
            <div className="p-3 rounded-xl bg-[#080b1e] border border-chad-border/30">
              <p className="text-[10px] text-gray-400">Estimated Receive</p>
              <p className="text-base font-bold text-neon-green mt-0.5 truncate">
                ~{formatTokenAmount(estimatedTokens)}{" "}
                <span className="text-xs text-gray-400 font-semibold">{tokenSymbol}</span>
              </p>
            </div>
          )}

          <button
            onClick={handleBuy}
            className="btn-primary w-full py-3.5 mt-2"
          >
            Buy
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-chad-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-red" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Sell {tokenSymbol}
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-red/10 border border-neon-red/20 text-neon-red font-bold uppercase tracking-wider">
              Simulated
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">
              Amount ({tokenSymbol})
            </label>
            <div className="relative">
              <input
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="0.00"
                className="chad-input pr-16"
                min="0"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 font-mono">
                {tokenSymbol}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {[0.25, 0.5, 0.75, 1.0].map((pct) => (
              <button
                key={pct}
                onClick={() => fillSellPercent(pct)}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-gray-400 bg-chad-surface hover:bg-chad-bg-card-hover hover:text-white transition-all border border-chad-border/30 hover:border-neon-red/30"
              >
                {pct * 100}%
              </button>
            ))}
          </div>

          {sellAmount && !isNaN(parseFloat(sellAmount)) && (
            <div className="p-3 rounded-xl bg-[#080b1e] border border-chad-border/30">
              <p className="text-[10px] text-gray-400">You Receive</p>
              <p className="text-base font-bold text-neon-red mt-0.5 truncate">
                ~{formatTokenAmount(estimatedSol, 4)}{" "}
                <span className="text-xs text-gray-400 font-semibold">SOL</span>
              </p>
            </div>
          )}

          <button
            onClick={handleSell}
            className="btn-sell w-full py-3.5 mt-2"
          >
            Sell
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-chad-border/50">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Your Position
          </h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Token Balance</span>
            <span className="text-sm font-semibold text-white font-mono">
              {formatTokenAmount(currentTokenBalance)} {tokenSymbol}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Est. Value</span>
            <span className="text-sm font-semibold text-white font-mono">
              {formatPrice(currentTokenEstValue)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">SOL Balance</span>
            <span className="text-sm font-semibold text-neon-cyan font-mono">
              {formatTokenAmount(simulatedSolBalance, 4)} SOL
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-neon-red/10 border border-neon-red/20 text-xs text-neon-red text-center font-semibold">
          {errorMsg}
        </div>
      )}
    </div>
  );
});
