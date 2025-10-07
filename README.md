# Interactive Analytics Dashboard for Streaming Metrics

A real-time streaming analytics dashboard built with Next.js that provides comprehensive monitoring and performance metrics for streaming systems. The dashboard features live data visualization, interactive charts, and real-time metrics tracking.

![Dashboard Preview](public/placeholder.svg)

## 🚀 Features

### Real-Time Monitoring
- **Live Metrics Stream**: Real-time data updates using Server-Sent Events (SSE)
- **Connection Status**: Visual indicator showing live connection status to the metrics stream
- **Auto-Refresh**: Metrics automatically update every second with throttled UI updates for optimal performance

### Key Performance Indicators (KPIs)
- **Current Bitrate**: Monitor streaming bitrate (kbps) with trend indicators
- **Average Latency**: Track latency metrics (ms) with percentage change visualization
- **Error Rate**: Real-time error rate monitoring with alerts
- **Active Streams**: Track the number of concurrent active streams

### Data Visualization
- **Interactive Line Charts**: Smooth, animated charts built with Recharts
- **Multi-Line Charts**: Compare multiple metrics simultaneously
- **Time Range Selection**: View metrics over different time periods (5m, 1h, 12h, 24h)
- **Responsive Design**: Fully responsive charts that adapt to screen size

### User Experience
- **Dark/Light Mode**: Toggle between dark and light themes with system preference detection
- **Data Export**: Export metrics data as JSON for further analysis
- **Metric Selector**: Choose which metrics to display in detailed views
- **Stream Details**: View detailed information about streaming sessions

### Performance Optimization
- **Throttled Updates**: UI updates every 500ms to prevent performance degradation
- **Data Buffering**: Efficient data handling with buffered updates
- **Historical Data**: Pre-load historical data for immediate visualization
- **Time-Based Filtering**: Automatically filter data based on selected time range

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.2.4**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4.1.9**: Utility-first CSS framework
- **Geist Font**: Modern, clean typography

### UI Components
- **Radix UI**: Accessible, unstyled component primitives
- **Lucide React**: Beautiful, consistent icons
- **Recharts 2.15.4**: Composable charting library
- **Sonner**: Elegant toast notifications
- **next-themes**: Theme management with system preference support

### Data Handling
- **D3.js**: Advanced data manipulation and visualization
- **date-fns**: Modern date utility library
- **React Hook Form + Zod**: Form validation and management

### Development Tools
- **TypeScript 5**: Static type checking
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS transformation and optimization

## 📁 Project Structure

```
Interactive-Analytics-Dashboard-for-Streaming-Metrics/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── historical/           # Historical data endpoint
│   │   │   └── route.ts         # Generates 12h of historical metrics
│   │   └── metrics/              # Real-time metrics endpoint
│   │       └── route.ts         # SSE stream for live metrics
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main dashboard page
│
├── components/                   # React components
│   ├── charts/                   # Chart components
│   │   ├── line-chart.tsx       # Single metric line chart
│   │   └── multi-line-chart.tsx # Multi-metric comparison chart
│   ├── ui/                       # Shadcn/Radix UI components
│   │   └── ...                  # 70+ reusable UI components
│   ├── connection-status.tsx     # Live connection indicator
│   ├── kpi-card.tsx              # KPI display card
│   ├── metric-selector.tsx       # Metric selection dropdown
│   ├── providers.tsx             # Context providers wrapper
│   ├── stream-details-dialog.tsx # Stream detail modal
│   ├── theme-provider.tsx        # Theme context provider
│   └── theme-toggle.tsx          # Dark/light mode toggle
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts             # Mobile detection hook
│   ├── use-streaming-metrics.ts  # Real-time metrics management
│   └── use-toast.ts              # Toast notification hook
│
├── lib/                          # Utility libraries
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Utility functions (cn, etc.)
│
├── public/                       # Static assets
├── styles/                       # Additional styles
├── components.json               # Shadcn UI configuration
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── tsconfig.json                 # TypeScript configuration
└── pnpm-lock.yaml                # Dependency lock file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher (or pnpm/yarn)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johaankjis/Interactive-Analytics-Dashboard-for-Streaming-Metrics.git
   cd Interactive-Analytics-Dashboard-for-Streaming-Metrics
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the dashboard.

### Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📊 API Documentation

### Endpoints

#### GET `/api/metrics`
Real-time metrics stream using Server-Sent Events (SSE).

**Response Format:**
```typescript
{
  timestamp: number,        // Unix timestamp
  bitrate: number,          // Current bitrate in kbps (2500-4000)
  latency: number,          // Latency in milliseconds (50-200)
  errorRate: number,        // Error rate percentage (0-5)
  activeStreams: number,    // Number of active streams (100-150)
  bandwidth: {
    outgoing: number,       // Outgoing bandwidth in MB (800-1200)
    incoming: number        // Incoming bandwidth in MB (200-350)
  }
}
```

**Stream Configuration:**
- Update interval: 1 second
- Content-Type: `text/event-stream`
- Connection: `keep-alive`

#### GET `/api/historical`
Historical metrics data for initial chart population.

**Response:**
- Returns 720 data points (12 hours of data)
- 1 data point per minute
- Same format as `/api/metrics` endpoint

## 🎨 Customization

### Theme Configuration

The dashboard supports dark and light themes. Themes are managed using `next-themes` and can be customized in:
- `components/theme-provider.tsx`: Theme context setup
- `components/theme-toggle.tsx`: Theme switcher component
- `app/globals.css`: CSS custom properties for theming

### Metrics Configuration

To modify the metrics data source or add new metrics:

1. **Update Type Definitions** (`lib/types.ts`)
   ```typescript
   export interface StreamingMetrics {
     timestamp: number
     // Add your custom metrics here
     customMetric: number
   }
   ```

2. **Modify API Endpoints**
   - `app/api/metrics/route.ts`: Real-time data generation
   - `app/api/historical/route.ts`: Historical data generation

3. **Update Dashboard Components**
   - `app/page.tsx`: Add new KPI cards or charts
   - `components/kpi-card.tsx`: Customize KPI display

### Time Ranges

Modify available time ranges in `lib/types.ts`:
```typescript
export type TimeRange = "5m" | "1h" | "12h" | "24h" | "7d" | "30d"
```

Update the time range logic in `hooks/use-streaming-metrics.ts` to handle new ranges.

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js recommended rules
- **Build Errors**: TypeScript and ESLint errors ignored during builds (configured in `next.config.mjs`)

### Performance Optimization

The dashboard implements several performance optimizations:

1. **Throttled Updates**: UI updates every 500ms instead of on every data point
2. **Data Buffering**: Metrics are buffered and flushed periodically
3. **Time-Based Filtering**: Old data is automatically pruned based on selected time range
4. **Memoization**: React.useMemo used for expensive calculations
5. **Code Splitting**: Next.js automatic code splitting for optimal loading

## 🔧 Configuration Files

### `next.config.mjs`
```javascript
{
  reactStrictMode: true,    // Enable React strict mode
  swcMinify: true,          // Use SWC for minification
  eslint: {
    ignoreDuringBuilds: true // Skip ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true  // Skip TypeScript errors during builds
  },
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: true
  }
}
```

### `tsconfig.json`
- TypeScript 5 with strict mode
- Path aliases: `@/*` maps to project root
- Target: ES2017 with ESNext module resolution

### `components.json`
- Shadcn UI configuration
- Component aliases and styling preferences
- Tailwind CSS integration

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Key responsive features:
- Adaptive grid layouts
- Collapsible navigation
- Touch-friendly interactions
- Optimized chart rendering

## 🌐 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Android

## 📝 License

This project is private. All rights reserved.

## 🤝 Contributing

This is a private repository. If you have access and want to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- TypeScript and ESLint errors are ignored during builds (intentional configuration)
- Image optimization is disabled (`unoptimized: true`)

## 📧 Contact

For questions or support, please contact the repository owner.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)
- Fonts from [Geist](https://vercel.com/font)

---

**Generated with v0.app** | Built with ❤️ using Next.js
