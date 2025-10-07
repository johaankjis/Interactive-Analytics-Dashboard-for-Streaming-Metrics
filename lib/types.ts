export interface StreamingMetrics {
  timestamp: number
  bitrate: number // kbps
  latency: number // ms
  errorRate: number // percentage
  activeStreams: number
  bandwidth: {
    outgoing: number // MB
    incoming: number // MB
  }
}

export type TimeRange = "5m" | "1h" | "12h" | "24h"

export type MetricType = "bitrate" | "latency" | "errorRate" | "bandwidth"
