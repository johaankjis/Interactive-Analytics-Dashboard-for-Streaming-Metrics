"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { StreamingMetrics } from "@/lib/types"

interface StreamDetailsDialogProps {
  metrics: StreamingMetrics | null
}

export function StreamDetailsDialog({ metrics }: StreamDetailsDialogProps) {
  if (!metrics) return null

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getStatusColor = (errorRate: number) => {
    if (errorRate < 1) return "bg-green-500"
    if (errorRate < 3) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Stream Session Details</DialogTitle>
          <DialogDescription>Detailed diagnostics for current streaming session</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Overview */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">Status Overview</h3>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${getStatusColor(metrics.errorRate)}`} />
              <span className="text-sm text-muted-foreground">
                {metrics.errorRate < 1 ? "Healthy" : metrics.errorRate < 3 ? "Warning" : "Critical"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Metrics Grid */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">Current Metrics</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Bitrate</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {metrics.bitrate.toFixed(0)}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">kbps</span>
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Latency</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {metrics.latency.toFixed(0)}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">ms</span>
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Error Rate</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {metrics.errorRate.toFixed(2)}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">%</span>
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Active Streams</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{metrics.activeStreams}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Bandwidth Details */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">Bandwidth Usage</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Outgoing</span>
                <Badge variant="outline">{metrics.bandwidth.outgoing} MB</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Incoming</span>
                <Badge variant="outline">{metrics.bandwidth.incoming} MB</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <Badge>{metrics.bandwidth.outgoing + metrics.bandwidth.incoming} MB</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamp */}
          <div className="text-xs text-muted-foreground">Last updated: {formatTimestamp(metrics.timestamp)}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
