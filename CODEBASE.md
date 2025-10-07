# Codebase Documentation

## Overview

The **Interactive Analytics Dashboard for Streaming Metrics** is a sophisticated, real-time monitoring application built with Next.js 15 that provides comprehensive performance analytics for streaming systems. The application leverages Server-Sent Events (SSE) for live data streaming and presents metrics through interactive, responsive visualizations.

## Table of Contents

1. [Architecture](#architecture)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Components](#core-components)
5. [Custom Hooks](#custom-hooks)
6. [API Routes](#api-routes)
7. [Type System](#type-system)
8. [Data Flow](#data-flow)
9. [Performance Optimizations](#performance-optimizations)
10. [UI/UX Features](#uiux-features)
11. [Configuration](#configuration)

---

## Architecture

### Application Architecture

The application follows a modern React architecture pattern using Next.js App Router:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Page.tsx  │→ │ Custom Hooks │→ │  UI Components   │   │
│  │  (Dashboard)│  │              │  │  (Charts, Cards) │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│         ↓                ↓                     ↓             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│  ┌──────────────────┐         ┌──────────────────────┐     │
│  │  /api/metrics    │         │  /api/historical     │     │
│  │  (SSE Stream)    │         │  (Initial Data)      │     │
│  └──────────────────┘         └──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Patterns

1. **Client-Side Rendering**: All dashboard components are client-side rendered (`"use client"`)
2. **Server-Sent Events (SSE)**: Real-time data streaming from server to client
3. **Component Composition**: Modular, reusable component architecture
4. **Custom Hooks Pattern**: Encapsulated business logic in custom React hooks
5. **Type Safety**: Full TypeScript implementation with strict typing
6. **Theme Provider Pattern**: Dark/light mode using React Context

---

## Technology Stack

### Core Framework
- **Next.js 15.2.4**: React framework with App Router, Server Components, and API routes
- **React 19**: Latest React with concurrent features and improved performance
- **TypeScript 5**: Strict type checking for enhanced code quality

### Styling & UI
- **Tailwind CSS 4.1.9**: Utility-first CSS framework
- **Radix UI**: Accessible, unstyled component primitives (70+ components)
- **Geist Font**: Modern typography from Vercel
- **CSS Variables**: Dynamic theming support

### Data Visualization
- **D3.js (latest)**: Advanced data manipulation and SVG rendering
- **Recharts 2.15.4**: React-based charting library (used as fallback)
- **Custom D3 Charts**: Hand-crafted line charts with animations

### State Management & Data Handling
- **React Hooks**: useState, useEffect, useCallback, useMemo, useRef
- **EventSource API**: Native browser SSE implementation
- **date-fns 4.1.0**: Modern date utility library

### UI Enhancement Libraries
- **Lucide React 0.454.0**: Icon library (500+ icons)
- **Sonner 1.7.4**: Toast notification system
- **next-themes**: System-aware theme management
- **class-variance-authority**: Component variant management
- **clsx + tailwind-merge**: Conditional className utilities

### Forms & Validation
- **React Hook Form 7.60.0**: Performant form handling
- **Zod 3.25.67**: TypeScript-first schema validation

### Development Tools
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS transformation
- **SWC**: Fast TypeScript/JavaScript compilation

---

## Project Structure

```
Interactive-Analytics-Dashboard-for-Streaming-Metrics/
│
├── app/                              # Next.js App Router directory
│   ├── api/                          # Backend API routes
│   │   ├── historical/
│   │   │   └── route.ts             # GET: Returns 12h historical data (720 points)
│   │   └── metrics/
│   │       └── route.ts             # GET: SSE stream, updates every 1s
│   ├── globals.css                   # Global styles & CSS variables
│   ├── layout.tsx                    # Root layout with metadata & providers
│   └── page.tsx                      # Main dashboard page (170 lines)
│
├── components/                       # React components
│   ├── charts/                       # Data visualization components
│   │   ├── line-chart.tsx           # D3-based single metric chart
│   │   └── multi-line-chart.tsx     # D3-based multi-metric chart
│   │
│   ├── ui/                           # Shadcn/Radix UI components (70+ files)
│   │   ├── button.tsx               # Button component with variants
│   │   ├── card.tsx                 # Card container component
│   │   ├── select.tsx               # Dropdown select component
│   │   ├── dialog.tsx               # Modal dialog component
│   │   ├── toast.tsx                # Toast notification component
│   │   ├── use-toast.ts             # Toast hook
│   │   └── ...                      # 60+ more UI components
│   │
│   ├── connection-status.tsx         # Live connection indicator
│   ├── kpi-card.tsx                  # Key Performance Indicator card
│   ├── metric-selector.tsx           # Metric selection dropdown
│   ├── providers.tsx                 # App-wide context providers
│   ├── stream-details-dialog.tsx     # Detailed metric modal
│   ├── theme-provider.tsx            # Theme context provider
│   └── theme-toggle.tsx              # Dark/light mode toggle button
│
├── hooks/                            # Custom React hooks
│   ├── use-mobile.ts                 # Mobile device detection
│   ├── use-streaming-metrics.ts      # Real-time metrics management (100 lines)
│   └── use-toast.ts                  # Toast notification hook
│
├── lib/                              # Utility libraries
│   ├── types.ts                      # TypeScript type definitions
│   └── utils.ts                      # Utility functions (cn helper)
│
├── public/                           # Static assets
│   ├── placeholder.svg               # Dashboard preview image
│   ├── placeholder-logo.png          # Logo placeholder
│   └── ...                           # Other placeholder assets
│
├── styles/                           # Additional styles
│   └── globals.css                   # Global CSS styles
│
├── components.json                   # Shadcn UI configuration
├── next.config.mjs                   # Next.js configuration
├── package.json                      # Dependencies and scripts
├── postcss.config.mjs                # PostCSS configuration
├── tsconfig.json                     # TypeScript configuration
└── pnpm-lock.yaml                    # Dependency lock file (pnpm)
```

### File Count
- **Total TypeScript/TSX files**: 75 files
- **UI Components**: 70+ reusable components
- **Custom Components**: 8 domain-specific components
- **API Routes**: 2 endpoints
- **Custom Hooks**: 3 hooks

---

## Core Components

### 1. Dashboard Page (`app/page.tsx`)

**Purpose**: Main application entry point displaying all metrics and charts.

**Key Features**:
- Manages time range selection (5m, 1h, 12h, 24h)
- Calculates current KPIs from latest metrics
- Handles data export functionality
- Responsive grid layout for KPI cards and charts

**State Management**:
```typescript
const [timeRange, setTimeRange] = useState<TimeRange>("12h")
const [selectedView, setSelectedView] = useState<"overview" | "detailed">("overview")
const { metrics, isConnected } = useStreamingMetrics(timeRange)
```

**Computed Values**:
```typescript
const currentMetrics = useMemo(() => {
  // Calculates: bitrate, latency, errorRate, activeStreams
  // Computes trend changes (bitrateChange, latencyChange)
}, [metrics])
```

### 2. Line Chart (`components/charts/line-chart.tsx`)

**Purpose**: D3-based chart for visualizing single metric over time.

**Features**:
- Smooth line rendering with `curveMonotoneX`
- Filled area under the curve
- Grid lines for easier reading
- Responsive SVG rendering
- Accessibility labels with chart summary
- Time-based X-axis with relative labels ("Now", "2h ago")

**D3 Implementation**:
- Uses `d3.scaleTime()` for X-axis
- Uses `d3.scaleLinear()` for Y-axis
- Implements `d3.line()` and `d3.area()` generators
- Custom time formatting for axis labels

### 3. Multi-Line Chart (`components/charts/multi-line-chart.tsx`)

**Purpose**: Displays multiple metrics (incoming/outgoing bandwidth) simultaneously.

**Key Differences**:
- Supports multiple data series
- Legend component for series identification
- Color-coded lines for different metrics

### 4. KPI Card (`components/kpi-card.tsx`)

**Purpose**: Displays key performance indicators with trend information.

**Props**:
```typescript
interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: React.ReactNode
  color?: string
}
```

**Visual Elements**:
- Large value display with custom color
- Trend arrows (up/down) with percentage
- Icon representation
- Semantic HTML with ARIA labels

### 5. Connection Status (`components/connection-status.tsx`)

**Purpose**: Visual indicator showing real-time connection status.

**Features**:
- Animated pulse dot (green: connected, red: disconnected)
- Status text ("Live" or "Disconnected")
- ARIA live region for accessibility
- Screen reader announcements

### 6. Theme Toggle (`components/theme-toggle.tsx`)

**Purpose**: Switch between dark and light themes.

**Implementation**:
- Uses `next-themes` for theme management
- Hydration-safe rendering (prevents flash)
- System preference detection
- Sun/Moon icon toggle

### 7. Stream Details Dialog (`components/stream-details-dialog.tsx`)

**Purpose**: Modal displaying detailed streaming metrics.

**Features**:
- Full metric breakdown
- Timestamp information
- Bandwidth details
- Modal overlay with close button

### 8. Metric Selector (`components/metric-selector.tsx`)

**Purpose**: Dropdown for selecting different metric views.

**Implementation**:
- Uses Radix UI Select component
- Controlled component pattern
- Customizable metric list

---

## Custom Hooks

### 1. `useStreamingMetrics` (`hooks/use-streaming-metrics.ts`)

**Purpose**: Manages real-time metric streaming and historical data loading.

**Features**:
- Establishes SSE connection to `/api/metrics`
- Loads historical data on mount
- Implements data buffering for performance
- Throttled UI updates (500ms interval)
- Time-based data filtering
- Automatic cleanup on unmount

**Implementation Details**:

```typescript
export function useStreamingMetrics(timeRange: TimeRange = "12h") {
  const [metrics, setMetrics] = useState<StreamingMetrics[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const bufferRef = useRef<StreamingMetrics[]>([])
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Load historical data
  // Connect to SSE stream
  // Buffer incoming data
  // Flush buffer periodically (500ms)
  // Filter data by time range
  
  return { metrics, isConnected }
}
```

**Performance Optimizations**:
1. **Buffering**: Accumulates data points in `bufferRef`
2. **Throttling**: UI updates only every 500ms (not on every data point)
3. **Filtering**: Removes old data outside time range window
4. **Cleanup**: Properly closes EventSource and clears timers

### 2. `use-mobile` (`hooks/use-mobile.ts`)

**Purpose**: Detects mobile devices for responsive behavior.

**Implementation**:
- Uses `window.matchMedia` for viewport detection
- Returns boolean indicating mobile state
- Updates on viewport resize

### 3. `use-toast` (`hooks/use-toast.ts`)

**Purpose**: Toast notification management.

**Features**:
- Add/remove toast notifications
- Queue management
- Auto-dismiss functionality
- Customizable appearance

---

## API Routes

### 1. `/api/metrics` (GET)

**Purpose**: Server-Sent Events stream providing real-time metrics.

**Response Format**:
```typescript
{
  timestamp: number,        // Unix timestamp
  bitrate: number,          // 2500-4000 kbps
  latency: number,          // 50-200 ms
  errorRate: number,        // 0-5%
  activeStreams: number,    // 100-150
  bandwidth: {
    outgoing: number,       // 800-1200 MB
    incoming: number        // 200-350 MB
  }
}
```

**Implementation**:
```typescript
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const metrics = generateMetrics()
        const data = `data: ${JSON.stringify(metrics)}\n\n`
        controller.enqueue(encoder.encode(data))
      }, 1000) // Send every second
      
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })
  
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  })
}
```

**Key Features**:
- Updates every 1 second
- Automatic cleanup on disconnect
- Simulated random data generation
- Proper SSE formatting (`data: ...\n\n`)

### 2. `/api/historical` (GET)

**Purpose**: Returns historical metrics for initial chart population.

**Response**:
- 720 data points (12 hours of data)
- 1 data point per minute
- Same format as `/api/metrics`

**Implementation**:
```typescript
export async function GET() {
  const now = Date.now()
  const dataPoints = 720
  const historical = []
  
  for (let i = dataPoints; i >= 0; i--) {
    const timestamp = now - i * 60 * 1000
    historical.push({
      timestamp,
      bitrate: Math.floor(2500 + Math.random() * 1500),
      latency: Math.floor(50 + Math.random() * 150),
      errorRate: Math.random() * 5,
      activeStreams: Math.floor(100 + Math.random() * 50),
      bandwidth: {
        outgoing: Math.floor(800 + Math.random() * 400),
        incoming: Math.floor(200 + Math.random() * 150)
      }
    })
  }
  
  return NextResponse.json(historical)
}
```

---

## Type System

### Core Types (`lib/types.ts`)

```typescript
export interface StreamingMetrics {
  timestamp: number          // Unix timestamp in milliseconds
  bitrate: number           // Streaming bitrate in kbps
  latency: number           // Network latency in milliseconds
  errorRate: number         // Error rate as percentage (0-100)
  activeStreams: number     // Number of active concurrent streams
  bandwidth: {
    outgoing: number        // Outgoing bandwidth in MB
    incoming: number        // Incoming bandwidth in MB
  }
}

export type TimeRange = "5m" | "1h" | "12h" | "24h"

export type MetricType = "bitrate" | "latency" | "errorRate" | "bandwidth"
```

### Type Usage Patterns

1. **Component Props**: All components use TypeScript interfaces
2. **API Responses**: Next.js typed route handlers
3. **Hook Returns**: Explicit return type definitions
4. **Generic Components**: Type-safe generic implementations

---

## Data Flow

### 1. Initial Load

```
User loads page
     ↓
Dashboard mounts
     ↓
useStreamingMetrics hook initializes
     ↓
Fetches /api/historical ──→ Returns 720 data points
     ↓
Sets initial metrics state
     ↓
Charts render with historical data
```

### 2. Real-Time Updates

```
useStreamingMetrics establishes SSE connection
     ↓
/api/metrics sends data every 1s
     ↓
Data buffered in bufferRef
     ↓
Every 500ms: flushBuffer() called
     ↓
Buffer contents added to metrics state
     ↓
Old data filtered by timeRange
     ↓
Charts re-render with new data
```

### 3. Time Range Change

```
User selects new time range
     ↓
timeRange state updates
     ↓
useStreamingMetrics re-runs
     ↓
Fetches new historical data
     ↓
Closes old SSE connection
     ↓
Opens new SSE connection
     ↓
Charts update with filtered data
```

### 4. Data Export

```
User clicks Export button
     ↓
handleExportData() called
     ↓
metrics serialized to JSON
     ↓
Blob created with JSON data
     ↓
Download triggered via anchor element
     ↓
File: streaming-metrics-{timestamp}.json
```

---

## Performance Optimizations

### 1. Throttled UI Updates

**Problem**: SSE sends data every second, causing excessive re-renders.

**Solution**:
```typescript
const THROTTLE_INTERVAL = 500 // 500ms

// Buffer incoming data
eventSource.onmessage = (event) => {
  bufferRef.current.push(JSON.parse(event.data))
}

// Flush buffer every 500ms
throttleTimerRef.current = setInterval(flushBuffer, THROTTLE_INTERVAL)
```

**Impact**: Reduces re-renders by 50%, smoother animations.

### 2. React Memoization

**useMemo** for expensive calculations:
```typescript
const currentMetrics = useMemo(() => {
  // Calculate KPIs from latest metrics
}, [metrics])

const chartData = useMemo(() => {
  // Transform data for charts
}, [data, dataKey])
```

**memo** for component optimization:
```typescript
export const KPICard = memo(function KPICard({ ... }) { ... })
export const LineChart = memo(function LineChart({ ... }) { ... })
```

### 3. Data Filtering

Automatic pruning of old data:
```typescript
const ranges = {
  "5m": 5 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
}

return updated.filter((m) => now - m.timestamp <= ranges[timeRange])
```

### 4. SVG Optimization

- Clear previous SVG elements before re-render
- Use D3 transitions for smooth animations
- Responsive sizing without frequent recalculations

### 5. Code Splitting

- Next.js automatic code splitting
- Dynamic imports for heavy components
- Lazy loading of non-critical UI

---

## UI/UX Features

### 1. Responsive Design

**Breakpoints**:
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md, lg)
- Desktop: > 1024px (xl, 2xl)

**Responsive Elements**:
```typescript
// Grid layouts
className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"

// Flexible navigation
className="flex flex-col gap-4 sm:flex-row sm:items-center"

// Responsive padding
className="px-4 py-4 sm:px-6 lg:px-8"
```

### 2. Accessibility

**ARIA Labels**:
```tsx
<div role="banner" aria-label="Dashboard controls">
<div role="status" aria-live="polite">
<section aria-label="Key performance indicators">
<h2 className="sr-only">Current Metrics Overview</h2>
```

**Screen Reader Support**:
- Semantic HTML elements
- Hidden text for context
- Live regions for dynamic updates
- Keyboard navigation support

### 3. Dark Mode

**Implementation**:
- CSS variables for colors
- `next-themes` for state management
- System preference detection
- Smooth transitions

**Theme Variables** (`app/globals.css`):
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  /* ... */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --card: 0 0% 3.9%;
  --card-foreground: 0 0% 98%;
  /* ... */
}
```

### 4. Interactive Features

- Hover effects on cards and buttons
- Animated connection indicator (pulse)
- Smooth chart transitions
- Toast notifications
- Modal dialogs
- Dropdown selects

---

## Configuration

### 1. Next.js Configuration (`next.config.mjs`)

```javascript
const nextConfig = {
  reactStrictMode: true,        // Enable strict mode checks
  swcMinify: true,              // Use SWC for minification
  eslint: {
    ignoreDuringBuilds: true    // Skip ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true     // Skip TypeScript errors during builds
  },
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: true           // Disable image optimization
  }
}
```

**Rationale**:
- ESLint/TypeScript errors ignored to allow rapid development
- Image optimization disabled for simpler deployment
- SWC provides faster builds than Babel

### 2. TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "paths": {
      "@/*": ["./*"]              // Path alias for imports
    }
  }
}
```

**Key Settings**:
- Strict mode enabled for type safety
- Path aliases for cleaner imports
- ES6 target for modern JavaScript

### 3. Shadcn UI Configuration (`components.json`)

```json
{
  "style": "new-york",            // Component style variant
  "rsc": true,                    // React Server Components
  "tsx": true,                    // TypeScript support
  "tailwind": {
    "baseColor": "neutral",       // Base color palette
    "cssVariables": true          // Use CSS variables
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

### 4. PostCSS Configuration (`postcss.config.mjs`)

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

### 5. Package Scripts (`package.json`)

```json
{
  "scripts": {
    "dev": "next dev",           // Development server (port 3000)
    "build": "next build",       // Production build
    "start": "next start",       // Production server
    "lint": "next lint"          // Run ESLint
  }
}
```

---

## Development Workflow

### Running the Application

1. **Install Dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   - Runs on `http://localhost:3000`
   - Hot Module Replacement (HMR) enabled
   - Fast Refresh for instant updates

3. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

### Adding New Components

1. Create component file in `components/`
2. Use TypeScript for props interface
3. Export as default or named export
4. Import in parent component using `@/` alias

### Adding New Metrics

1. Update `StreamingMetrics` interface in `lib/types.ts`
2. Modify `generateMetrics()` in `app/api/metrics/route.ts`
3. Update historical data generation in `app/api/historical/route.ts`
4. Add new KPI card in `app/page.tsx`
5. Create new chart component if needed

### Styling Guidelines

- Use Tailwind utility classes
- Follow existing breakpoint patterns
- Maintain dark mode compatibility
- Use CSS variables for colors
- Keep responsive design in mind

---

## Browser Support

- **Chrome/Edge**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Mobile**: iOS Safari, Chrome Android

**Requirements**:
- EventSource API support
- CSS Grid and Flexbox
- ES6+ JavaScript features
- SVG rendering

---

## Known Limitations

1. **Build Configuration**: TypeScript and ESLint errors are intentionally ignored during builds
2. **Image Optimization**: Disabled for simpler deployment
3. **Data Simulation**: All metrics are randomly generated (no real backend)
4. **Data Persistence**: No database - data exists only in memory
5. **Authentication**: No user authentication or authorization
6. **Single Instance**: No multi-tenancy support

---

## Future Enhancements

### Potential Features

1. **Real Data Integration**:
   - Connect to actual streaming services
   - Database integration for persistence
   - Historical data analysis

2. **Advanced Analytics**:
   - Anomaly detection
   - Predictive analytics
   - Custom alert thresholds

3. **User Management**:
   - Authentication system
   - User preferences
   - Role-based access control

4. **Extended Visualization**:
   - More chart types (bar, pie, scatter)
   - Heatmaps for patterns
   - Comparative analysis views

5. **Export Features**:
   - CSV export
   - PDF reports
   - Scheduled reports

6. **Real-Time Alerts**:
   - Configurable thresholds
   - Email/SMS notifications
   - Alert history

---

## Dependencies Summary

### Production Dependencies (26 packages)

**Core Framework**:
- next (15.2.4)
- react (19)
- react-dom (19)
- typescript (5)

**UI Libraries**:
- @radix-ui/* (18 packages)
- lucide-react (0.454.0)
- next-themes (latest)

**Data & Visualization**:
- d3 (latest)
- recharts (2.15.4)
- date-fns (4.1.0)

**Forms & Validation**:
- react-hook-form (7.60.0)
- zod (3.25.67)
- @hookform/resolvers (3.10.0)

**Utilities**:
- clsx (2.1.1)
- tailwind-merge (2.5.5)
- class-variance-authority (0.7.1)

### Development Dependencies (7 packages)

- @tailwindcss/postcss (4.1.9)
- tailwindcss (4.1.9)
- @types/node (22)
- @types/react (19)
- @types/react-dom (19)
- postcss (8.5)

---

## Utility Functions

### `cn()` Helper (`lib/utils.ts`)

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Purpose**: Combines and merges Tailwind CSS classes efficiently.

**Usage**:
```typescript
<div className={cn("base-class", isActive && "active-class", className)} />
```

**Benefits**:
- Handles conditional classes
- Resolves Tailwind class conflicts
- Type-safe with TypeScript

---

## Testing Considerations

### Areas to Test

1. **Component Rendering**:
   - All components render without errors
   - Props are correctly passed and used
   - Conditional rendering works as expected

2. **Hook Behavior**:
   - useStreamingMetrics connects and receives data
   - Data buffering and throttling work correctly
   - Cleanup functions are called

3. **API Routes**:
   - SSE stream sends data correctly
   - Historical endpoint returns valid data
   - Error handling for connection issues

4. **Responsive Design**:
   - Components adapt to different screen sizes
   - Touch interactions work on mobile
   - No layout breaks at breakpoints

5. **Accessibility**:
   - Screen reader compatibility
   - Keyboard navigation
   - ARIA labels are present

### Testing Tools (Not Currently Implemented)

- Jest for unit testing
- React Testing Library for component tests
- Playwright or Cypress for E2E tests
- Accessibility testing with axe-core

---

## Performance Metrics

### Key Performance Indicators

1. **First Contentful Paint (FCP)**: < 1.5s
2. **Largest Contentful Paint (LCP)**: < 2.5s
3. **Time to Interactive (TTI)**: < 3.5s
4. **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Techniques Used

- Server-Side Rendering (SSR) for initial load
- Code splitting via Next.js
- React memoization for expensive components
- Throttled updates for real-time data
- Efficient D3 rendering with cleanup

---

## Security Considerations

### Current Implementation

1. **No Authentication**: Application is publicly accessible
2. **No Data Validation**: API endpoints don't validate input
3. **CORS**: Not configured (assumes same-origin)
4. **XSS Protection**: React's built-in escaping
5. **CSRF**: Not implemented (no state-changing operations)

### Recommendations for Production

1. Implement authentication (NextAuth.js, Auth0)
2. Add input validation (Zod schemas)
3. Configure CORS appropriately
4. Add rate limiting for API routes
5. Implement CSRF tokens for mutations
6. Use HTTPS in production
7. Add security headers (Helmet.js)

---

## Deployment

### Vercel Deployment (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure build settings (default works)
4. Deploy

### Self-Hosted Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Use a process manager (PM2):
   ```bash
   pm2 start npm --name "dashboard" -- start
   ```

4. Configure reverse proxy (Nginx):
   ```nginx
   location / {
     proxy_pass http://localhost:3000;
     proxy_http_version 1.1;
     proxy_set_header Upgrade $http_upgrade;
     proxy_set_header Connection 'upgrade';
   }
   ```

---

## Troubleshooting

### Common Issues

1. **SSE Connection Fails**:
   - Check `/api/metrics` endpoint is accessible
   - Verify CORS settings
   - Check browser console for errors

2. **Charts Not Rendering**:
   - Verify data is being received
   - Check D3 is properly imported
   - Inspect SVG elements in DevTools

3. **Theme Not Working**:
   - Ensure ThemeProvider wraps app
   - Check localStorage for theme preference
   - Verify CSS variables are defined

4. **Build Errors**:
   - Clear `.next` folder and rebuild
   - Delete `node_modules` and reinstall
   - Check for TypeScript errors (if not ignored)

---

## Contributing Guidelines

1. **Code Style**:
   - Use TypeScript for all new files
   - Follow existing patterns and conventions
   - Use functional components with hooks

2. **Component Guidelines**:
   - Create small, focused components
   - Use proper TypeScript interfaces
   - Add accessibility features
   - Memoize expensive components

3. **Commit Messages**:
   - Use descriptive commit messages
   - Reference issue numbers
   - Follow conventional commits format

4. **Pull Requests**:
   - Create feature branches
   - Include tests if applicable
   - Update documentation
   - Request review before merging

---

## License

This project is private. All rights reserved.

---

## Contact & Support

For questions, issues, or contributions, please contact the repository owner.

---

## Acknowledgments

- **Next.js**: Framework and tooling
- **Radix UI**: Accessible component primitives
- **Recharts**: Charting library
- **D3.js**: Data visualization
- **Lucide**: Icon library
- **Vercel**: Deployment platform (Geist fonts)
- **v0.app**: Initial project generation

---

**Last Updated**: 2025
**Version**: 0.1.0
**Maintained By**: Repository Owner
