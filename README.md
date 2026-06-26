# ChadWallet — Solana Trading Terminal

A premium Solana trading terminal built with Next.js 14+, featuring real-time token data, TradingView charts, and Privy authentication.

## Live Demo

👉 **[chadwallet-rouge.vercel.app](chadwallet-rouge.vercel.app)**

## Features

- 🔐 **Privy Authentication** — Sign in with Google or Apple
- 📊 **TradingView Charts** — Candlestick charts with multiple timeframes
- 🔥 **Trending Tokens** — Auto-rotating token banners with live prices
- 💰 **Wallet Integration** — SOL balance display with Alchemy RPC
- 📈 **Token Analytics** — Top holders, live trades, OHLCV data
- 🎨 **Premium Dark Theme** — Neon green/cyan accents on dark backgrounds

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (dark theme, neon accents)
- **Auth**: Privy (Apple/Google login)
- **Wallet**: Solana Web3.js
- **Data**: Birdeye API
- **Charts**: TradingView Lightweight Charts
- **State**: React Context + hooks
- **Language**: TypeScript (strict mode)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/aryantusharr/chadwallet.git
cd chadwallet

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

Open [http://localhost:3000] in your browser.

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_API_SECRET=your_privy_api_secret
NEXT_PUBLIC_ALCHEMY_DEVNET_RPC=https://solana-devnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_ALCHEMY_MAINNET_RPC=https://solana-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_BIRDEYE_API_KEY=your_birdeye_api_key
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

## Project Structure

```
chadwallet/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles & design system
│   └── trading/
│       └── page.tsx        # Trading terminal page
├── components/
│   ├── auth/               # Authentication components
│   ├── banners/            # Token banner carousel
│   ├── trading/            # Trading page components
│   └── shared/             # Shared UI components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── api/                # API clients (Birdeye, Solana, Jupiter)
│   └── types.ts            # TypeScript interfaces
├── context/                # React Context providers
└── public/                 # Static assets
```

## Design System

| Element      | Color Code |
|-------------|-----------|
| Background  | `#0A0E27` |
| Card BG     | `#141937` |
| Border      | `#2d3a5c` |
| Neon Cyan   | `#00D9FF` |
| Neon Green  | `#00FF41` |
| Neon Red    | `#FF006E` |
| Text        | `#FFFFFF` |

## API Integrations

- **Privy**: Authentication + wallet generation
- **Alchemy**: Solana RPC (balance, network)
- **Birdeye**: Token data (trending, prices, holders, trades, OHLCV)
- **Jupiter**: Swap quotes (read-only, prepared for future execution)
- **TradingView**: Candlestick chart rendering

## How It Works

1. **Sign In**: Connect wallet via Privy (Apple/Google)
2. **Browse**: View trending tokens in auto-rotating banners
3. **Select Token**: Click banner → opens `/trading/[mint]`
4. **View Data**: Real-time chart, holders, recent trades
5. **Trade**: Fill form, review fees, confirm (UI mockup, no actual swaps)

## Rate Limits & Caching

- **Birdeye API**: 60 requests/minute (free tier)
- **Caching**: 30s per endpoint to minimize hits
- **Retry**: Exponential backoff on 429 errors

## Known Limitations

- **Trading UI**: Forms are mockup only (no real swaps executed)
- **Devnet**: App uses Solana devnet by default (testnet tokens, no real money)
- **Chart Data**: Limited to 1H, 4H, 1D, 1W timeframes
- **Mobile**: Responsive but optimized for desktop

## Future Enhancements

- Real Jupiter swap execution (mainnet)
- User portfolio tracking
- Trade history & P&L
- Watchlist management
- Push notifications for price alerts

## Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

Deployed on **Vercel** with auto-CI/CD from GitHub main branch.


## License

MIT

## Contact

Built by Tushar for ChadWallet founding engineer role.
