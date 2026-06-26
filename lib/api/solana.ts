import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const DEVNET_RPC =
  process.env.NEXT_PUBLIC_ALCHEMY_DEVNET_RPC ||
  "https://api.devnet.solana.com";
const MAINNET_RPC =
  process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_RPC ||
  "https://api.mainnet-beta.solana.com";

const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";

/**
 * Get Solana connection for the configured network
 */
export function getConnection(): Connection {
  const rpcUrl = NETWORK === "mainnet" ? MAINNET_RPC : DEVNET_RPC;
  return new Connection(rpcUrl, "confirmed");
}

/**
 * Connect to a specific cluster
 */
export function connectToCluster(
  network: "devnet" | "mainnet"
): Connection {
  const rpcUrl = network === "mainnet" ? MAINNET_RPC : DEVNET_RPC;
  return new Connection(rpcUrl, "confirmed");
}

/**
 * Get SOL balance for a wallet address
 */
export async function getBalance(walletAddress: string): Promise<number> {
  try {
    const connection = getConnection();
    const pubkey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(pubkey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    return 0;
  }
}

/**
 * Get current network name
 */
export function getNetworkName(): string {
  return NETWORK === "mainnet" ? "Mainnet Beta" : "Devnet";
}

/**
 * Validate a Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Truncate wallet address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

// Export configured connection
export const solanaConnection = getConnection();
export const currentNetwork = NETWORK;
