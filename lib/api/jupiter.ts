import axios from "axios";

const JUPITER_BASE_URL = "https://quote-api.jup.ag/v6";

interface JupiterQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  priceImpactPct: number;
  routePlan: unknown[];
}

/**
 * Get a swap quote from Jupiter (read-only, no execution)
 */
export async function getSwapQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps = 50
): Promise<JupiterQuote | null> {
  try {
    const response = await axios.get(`${JUPITER_BASE_URL}/quote`, {
      params: {
        inputMint,
        outputMint,
        amount: Math.floor(amount),
        slippageBps,
        onlyDirectRoutes: false,
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to get Jupiter quote:", error);
    return null;
  }
}

/**
 * Format Jupiter quote output for display
 */
export function formatQuoteOutput(
  quote: JupiterQuote | null,
  decimals = 9
): string {
  if (!quote) return "0";
  const amount = Number(quote.outAmount) / Math.pow(10, decimals);
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

// Well-known Solana token mints
export const TOKEN_MINTS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  RAY: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
} as const;
