# Interactive Analytics Dashboard for Streaming Metrics

A modern, real-time analytics dashboard for monitoring streaming system performance. Built with Next.js 15, React 19, and TypeScript, this dashboard provides live monitoring of critical streaming metrics including bitrate, latency, error rates, and bandwidth usage.

![Streaming Analytics Dashboard](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Real-time Metrics Streaming** - Live updates via Server-Sent Events (SSE)
- **Interactive Visualizations** - Beautiful charts powered by Recharts
- **Responsive Design** - Fully responsive UI that works on all devices
- **Dark/Light Mode** - Theme toggle with persistent preferences
- **Time Range Selection** - View metrics for 5 minutes, 1 hour, 12 hours, or 24 hours
- **KPI Cards** - Real-time key performance indicators with trend indicators
- **Data Export** - Export metrics data as JSON for further analysis
- **Stream Details Dialog** - Detailed diagnostics for current streaming session
- **Connection Status** - Visual indicator for real-time connection status
- **Performance Optimized** - Throttled updates to prevent UI overload

## 📊 Key Metrics Tracked

- **Bitrate** - Current streaming bitrate (kbps)
- **Latency** - Average latency (ms)
- **Error Rate** - Percentage of errors in the stream
- **Active Streams** - Number of concurrent active streams
- **Bandwidth** - Incoming and outgoing bandwidth usage (MB)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **Charts**: Recharts 2.15.4, D3.js
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

### Key Libraries
- **next-themes** - Theme management
- **class-variance-authority** - Component variants
- **tailwind-merge** - Tailwind class merging
- **date-fns** - Date formatting
- **zod** - Schema validation
- **react-hook-form** - Form handling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17 or later
- **pnpm** 8.0 or later (recommended) or npm/yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johaankjis/Interactive-Analytics-Dashboard-for-Streaming-Metrics.git
   cd Interactive-Analytics-Dashboard-for-Streaming-Metrics
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

## 🏃 Running the Application

### Development Mode

Start the development server with hot reload:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

Build the application for production:

```bash
pnpm build
# or
npm run build
# or
yarn build
```

### Start Production Server

After building, start the production server:

```bash
pnpm start
# or
npm start
# or
yarn start
```

### Linting

Run the linter to check for code quality issues:

```bash
pnpm lint
# or
npm run lint
# or
yarn lint
```

## 📁 Project Structure

```
Interactive-Analytics-Dashboard-for-Streaming-Metrics/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── metrics/            # Real-time metrics SSE endpoint
│   │   │   └── route.ts
│   │   └── historical/         # Historical data endpoint
│   │       └── route.ts
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main dashboard page
├── components/                  # React components
│   ├── charts/                 # Chart components
│   │   ├── line-chart.tsx
│   │   └── multi-line-chart.tsx
│   ├── ui/                     # Reusable UI components (Radix-based)
│   ├── connection-status.tsx   # Connection status indicator
│   ├── kpi-card.tsx           # KPI display card
│   ├── metric-selector.tsx    # Metric selection component
│   ├── providers.tsx          # Context providers
│   ├── stream-details-dialog.tsx  # Stream details modal
│   ├── theme-provider.tsx     # Theme context provider
│   └── theme-toggle.tsx       # Theme toggle button
├── hooks/                      # Custom React hooks
│   ├── use-mobile.ts          # Mobile detection hook
│   ├── use-streaming-metrics.ts  # Main metrics hook
│   └── use-toast.ts           # Toast notifications hook
├── lib/                        # Utility functions and types
│   ├── types.ts               # TypeScript type definitions
│   └── utils.ts               # Utility functions
├── public/                     # Static assets
├── styles/                     # Additional styles
├── components.json             # shadcn/ui configuration
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🔌 API Endpoints

### GET `/api/metrics`

Server-Sent Events (SSE) endpoint for real-time streaming metrics.

**Response Format:**
```typescript
{
  timestamp: number,        // Unix timestamp in milliseconds
  bitrate: number,         // kbps (2500-4000)
  latency: number,         // ms (50-200)
  errorRate: number,       // percentage (0-5)
  activeStreams: number,   // count (100-150)
  bandwidth: {
    outgoing: number,      // MB (800-1200)
    incoming: number       // MB (200-350)
  }
}
```

**Connection:**
- Updates every 1 second
- Uses `text/event-stream` content type
- Auto-reconnects on connection loss

### GET `/api/historical`

Fetch historical metrics data for chart initialization.

**Response:** Array of StreamingMetrics objects (720 data points for 12 hours)

## ⚙️ Configuration

### Next.js Configuration (`next.config.mjs`)

```javascript
{
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  }
}
```

### Time Range Options

- **5m** - Last 5 minutes
- **1h** - Last 1 hour
- **12h** - Last 12 hours (default)
- **24h** - Last 24 hours

## 🧩 Key Components

### `useStreamingMetrics` Hook

Custom hook for managing real-time metrics data.

**Features:**
- Connects to SSE endpoint
- Loads historical data
- Throttles updates (500ms interval)
- Filters data by time range
- Manages connection state

**Usage:**
```typescript
const { metrics, isConnected } = useStreamingMetrics(timeRange)
```

### KPICard Component

Displays key performance indicators with trend information.

**Props:**
- `title` - Metric name
- `value` - Current value
- `unit` - Unit of measurement
- `trend` - "up" | "down" | "neutral"
- `trendValue` - Percentage change
- `icon` - React icon component
- `color` - Custom color for value

### Charts

- **LineChart** - Single metric visualization
- **MultiLineChart** - Multiple metrics on one chart

## 🎨 Theming

The application supports both light and dark themes using `next-themes`. The theme preference is persisted in localStorage.

**Theme Toggle:**
- Click the theme toggle button in the header
- System preference is detected by default
- Manual selection overrides system preference

## 🔧 Development

### Adding New Metrics

1. Update `StreamingMetrics` type in `lib/types.ts`
2. Modify data generator in `app/api/metrics/route.ts`
3. Update chart components to display new metrics
4. Add corresponding KPI cards if needed

### Customizing the Dashboard

- **Color Scheme**: Modify Tailwind configuration
- **Update Interval**: Change `THROTTLE_INTERVAL` in `use-streaming-metrics.ts`
- **Data Points**: Adjust `dataPoints` in `app/api/historical/route.ts`
- **Metric Ranges**: Update generator logic in `app/api/metrics/route.ts`

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop** - Full feature set with multi-column layouts
- **Tablet** - Adaptive grid layouts
- **Mobile** - Single-column layout with touch-optimized controls

## 🚀 Performance Optimizations

- **Throttled Updates**: UI updates limited to 500ms intervals
- **Memoized Components**: React.memo for expensive components
- **Lazy Loading**: Components loaded on demand
- **SWC Minification**: Fast builds with SWC compiler
- **Image Optimization**: AVIF and WebP format support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.dev) - AI-powered UI generation
- UI components based on [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ using Next.js and React**
