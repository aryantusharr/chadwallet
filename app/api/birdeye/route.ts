import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import {
  getTrendingTokens,
  getTokenPrice,
  getTokenHolders,
  getTokenTrades,
  getTokenOHLCV,
} from "@/lib/api/birdeye";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get("endpoint");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint parameter is required" },
        { status: 400 }
      );
    }

    switch (endpoint) {
      case "trending": {
        const limit = Number(searchParams.get("limit")) || 10;
        const data = await getTrendingTokens(limit);
        return NextResponse.json(data);
      }
      case "price": {
        const mint = searchParams.get("mint");
        if (!mint) {
          return NextResponse.json({ error: "Mint parameter is required" }, { status: 400 });
        }
        const data = await getTokenPrice(mint);
        return NextResponse.json(data);
      }
      case "holders": {
        const mint = searchParams.get("mint");
        const limit = Number(searchParams.get("limit")) || 5;
        if (!mint) {
          return NextResponse.json({ error: "Mint parameter is required" }, { status: 400 });
        }
        const data = await getTokenHolders(mint, limit);
        return NextResponse.json(data);
      }
      case "trades": {
        const mint = searchParams.get("mint");
        const limit = Number(searchParams.get("limit")) || 10;
        if (!mint) {
          return NextResponse.json({ error: "Mint parameter is required" }, { status: 400 });
        }
        const data = await getTokenTrades(mint, limit);
        return NextResponse.json(data);
      }
      case "ohlcv": {
        const mint = searchParams.get("mint");
        const timeframe = searchParams.get("timeframe") || "1H";
        if (!mint) {
          return NextResponse.json({ error: "Mint parameter is required" }, { status: 400 });
        }
        const data = await getTokenOHLCV(mint, timeframe);
        return NextResponse.json(data);
      }
      default:
        return NextResponse.json(
          { error: `Invalid endpoint: ${endpoint}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("[Birdeye Proxy Route] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
