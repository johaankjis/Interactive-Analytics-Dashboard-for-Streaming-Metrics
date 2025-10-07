"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MetricSelectorProps {
  selectedMetric: string
  onMetricChange: (metric: string) => void
  metrics: Array<{ id: string; label: string }>
}

export function MetricSelector({ selectedMetric, onMetricChange, metrics }: MetricSelectorProps) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg border border-border bg-card p-1"
      role="tablist"
      aria-label="Metric view selector"
    >
      {metrics.map((metric) => (
        <Button
          key={metric.id}
          variant={selectedMetric === metric.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onMetricChange(metric.id)}
          className={cn("text-xs", selectedMetric === metric.id && "bg-primary text-primary-foreground")}
          role="tab"
          aria-selected={selectedMetric === metric.id}
          aria-controls={`${metric.id}-panel`}
        >
          {metric.label}
        </Button>
      ))}
    </div>
  )
}
