"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import type { StreamingMetrics, TimeRange } from "@/lib/types"

const THROTTLE_INTERVAL = 500 // Update UI every 500ms instead of every data point

export function useStreamingMetrics(timeRange: TimeRange = "12h") {
  const [metrics, setMetrics] = useState<StreamingMetrics[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const bufferRef = useRef<StreamingMetrics[]>([])
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Load historical data
  const loadHistoricalData = useCallback(async () => {
    try {
      const response = await fetch("/api/historical")
      const data = await response.json()

      // Filter based on time range
      const now = Date.now()
      const ranges = {
        "5m": 5 * 60 * 1000,
        "1h": 60 * 60 * 1000,
        "12h": 12 * 60 * 60 * 1000,
        "24h": 24 * 60 * 60 * 1000,
      }

      const filtered = data.filter((m: StreamingMetrics) => now - m.timestamp <= ranges[timeRange])

      setMetrics(filtered)
    } catch (error) {
      console.error("[v0] Failed to load historical data:", error)
    }
  }, [timeRange])

  const flushBuffer = useCallback(() => {
    if (bufferRef.current.length === 0) return

    setMetrics((prev) => {
      const updated = [...prev, ...bufferRef.current]
      bufferRef.current = []

      // Keep only data within time range
      const now = Date.now()
      const ranges = {
        "5m": 5 * 60 * 1000,
        "1h": 60 * 60 * 1000,
        "12h": 12 * 60 * 60 * 1000,
        "24h": 24 * 60 * 60 * 1000,
      }

      return updated.filter((m) => now - m.timestamp <= ranges[timeRange])
    })
  }, [timeRange])

  // Connect to real-time metrics stream
  useEffect(() => {
    loadHistoricalData()

    const eventSource = new EventSource("/api/metrics")
    eventSourceRef.current = eventSource

    throttleTimerRef.current = setInterval(flushBuffer, THROTTLE_INTERVAL)

    eventSource.onopen = () => {
      console.log("[v0] Connected to metrics stream")
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const newMetric: StreamingMetrics = JSON.parse(event.data)
        bufferRef.current.push(newMetric)
      } catch (error) {
        console.error("[v0] Failed to parse metric:", error)
      }
    }

    eventSource.onerror = () => {
      console.error("[v0] Metrics stream error")
      setIsConnected(false)
    }

    return () => {
      eventSource.close()
      eventSourceRef.current = null
      setIsConnected(false)
      if (throttleTimerRef.current) {
        clearInterval(throttleTimerRef.current)
        throttleTimerRef.current = null
      }
      // Flush any remaining buffered data
      flushBuffer()
    }
  }, [timeRange, loadHistoricalData, flushBuffer])

  return { metrics, isConnected }
}
