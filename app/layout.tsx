"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import "./globals.css";

const getPrivyAppId = (): string => {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!appId) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_PRIVY_APP_ID must be defined in your .env.local file."
    );
  }
  return appId;
};

const privyAppId = getPrivyAppId();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="dark">
      <head>
        <title>ChadWallet — Solana Trading Terminal</title>
        <meta
          name="description"
          content="ChadWallet is a premium Solana trading terminal. Track trending tokens, analyze charts, and trade on Solana — all in one place."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0A0E27" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-chad-bg text-white min-h-screen antialiased bg-pattern">
        <PrivyProvider
          appId={privyAppId}
          config={{
            loginMethods: ["google", "apple", "email"],
            appearance: {
              theme: "dark",
              accentColor: "#00FF41",
              logo: "/logo-green.png",
              showWalletLoginFirst: false,
              walletChainType: "solana-only",
            },
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
          }}
        >
          <AppProvider>
            <ErrorBoundary>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ErrorBoundary>
          </AppProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}
