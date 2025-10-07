"use client"

import { useState, useMemo } from "react"
import { useStreamingMetrics } from "@/hooks/use-streaming-metrics"
import { LineChart } from "@/components/charts/line-chart"
import { MultiLineChart } from "@/components/charts/multi-line-chart"
import { KPICard } from "@/components/kpi-card"
import { ConnectionStatus } from "@/components/connection-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { StreamDetailsDialog } from "@/components/stream-details-dialog"
import { MetricSelector } from "@/components/metric-selector"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActivityIcon, ZapIcon, AlertTriangleIcon, RadioIcon, DownloadIcon } from "lucide-react"
import type { TimeRange } from "@/lib/types"

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("12h")
  const [selectedView, setSelectedView] = useState<"overview" | "detailed">("overview")
  const { metrics, isConnected } = useStreamingMetrics(timeRange)

  // Calculate current KPIs
  const currentMetrics = useMemo(() => {
    if (metrics.length === 0) return null

    const latest = metrics[metrics.length - 1]
    const previous = metrics[metrics.length - 2]

    const bitrateChange = previous ? (((latest.bitrate - previous.bitrate) / previous.bitrate) * 100).toFixed(1) : "0"

    const latencyChange = previous ? (((latest.latency - previous.latency) / previous.latency) * 100).toFixed(1) : "0"

    return {
      bitrate: latest.bitrate,
      latency: latest.latency,
      errorRate: latest.errorRate,
      activeStreams: latest.activeStreams,
      bitrateChange,
      latencyChange,
      latest,
    }
  }, [metrics])

  const handleExportData = () => {
    const dataStr = JSON.stringify(metrics, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `streaming-metrics-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card" role="banner">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-balance text-2xl font-semibold text-foreground">Streaming Analytics</h1>
              <p className="mt-1 text-pretty text-sm text-muted-foreground leading-relaxed">
                Real-time monitoring and performance metrics
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-3" aria-label="Dashboard controls">
              <ConnectionStatus isConnected={isConnected} />
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleExportData} aria-label="Export metrics data">
                <DownloadIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                Export
              </Button>
              <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
                <SelectTrigger className="w-[140px]" aria-label="Select time range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">Last 5 minutes</SelectItem>
                  <SelectItem value="1h">Last 1 hour</SelectItem>
                  <SelectItem value="12h">Last 12 hours</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                </SelectContent>
              </Select>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8" role="main">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <MetricSelector
            selectedMetric={selectedView}
            onMetricChange={(view) => setSelectedView(view as "overview" | "detailed")}
            metrics={[
              { id: "overview", label: "Overview" },
              { id: "detailed", label: "Detailed" },
            ]}
          />
          {currentMetrics && <StreamDetailsDialog metrics={currentMetrics.latest} />}
        </div>

        {currentMetrics && (
          <section aria-label="Key performance indicators" className="mb-6 sm:mb-8">
            <h2 className="sr-only">Current Metrics Overview</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Current Bitrate"
                value={currentMetrics.bitrate.toFixed(0)}
                unit="kbps"
                trend={Number.parseFloat(currentMetrics.bitrateChange) > 0 ? "up" : "down"}
                trendValue={`${currentMetrics.bitrateChange}%`}
                icon={<ZapIcon className="h-5 w-5" aria-hidden="true" />}
                color="rgb(59, 130, 246)"
              />
              <KPICard
                title="Average Latency"
                value={currentMetrics.latency.toFixed(0)}
                unit="ms"
                trend={Number.parseFloat(currentMetrics.latencyChange) < 0 ? "up" : "down"}
                trendValue={`${Math.abs(Number.parseFloat(currentMetrics.latencyChange))}%`}
                icon={<ActivityIcon className="h-5 w-5" aria-hidden="true" />}
                color="rgb(234, 179, 8)"
              />
              <KPICard
                title="Error Rate"
                value={currentMetrics.errorRate.toFixed(2)}
                unit="%"
                icon={<AlertTriangleIcon className="h-5 w-5" aria-hidden="true" />}
                color={currentMetrics.errorRate > 2 ? "rgb(239, 68, 68)" : "rgb(34, 197, 94)"}
              />
              <KPICard
                title="Active Streams"
                value={currentMetrics.activeStreams}
                icon={<RadioIcon className="h-5 w-5" aria-hidden="true" />}
              />
            </div>
          </section>
        )}

        <section aria-label="Performance charts" className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <h2 className="sr-only">Detailed Performance Charts</h2>

          <div className="rounded-lg border border-border bg-card p-4 sm:p-6" role="region" aria-label="Bitrate chart">
            <LineChart data={metrics} dataKey="bitrate" title="Bitrate" color="rgb(59, 130, 246)" height={240} />
          </div>

          <div
            className="rounded-lg border border-border bg-card p-4 sm:p-6"
            role="region"
            aria-label="Bandwidth chart"
          >
            <MultiLineChart data={metrics} title="Fast Data Transfer" height={240} />
          </div>

          <div className="rounded-lg border border-border bg-card p-4 sm:p-6" role="region" aria-label="Latency chart">
            <LineChart data={metrics} dataKey="latency" title="Latency" color="rgb(234, 179, 8)" height={240} />
          </div>

          <div
            className="rounded-lg border border-border bg-card p-4 sm:p-6"
            role="region"
            aria-label="Error rate chart"
          >
            <LineChart data={metrics} dataKey="errorRate" title="Error Rate" color="rgb(239, 68, 68)" height={240} />
          </div>
        </section>
      </main>
    </div>
  )
}
