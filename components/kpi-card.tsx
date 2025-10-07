"use client"

import type React from "react"

import { memo } from "react"
import { Card } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: React.ReactNode
  color?: string
}

export const KPICard = memo(function KPICard({ title, value, unit, trend, trendValue, icon, color }: KPICardProps) {
  const ariaLabel = `${title}: ${value}${unit ? ` ${unit}` : ""}${trend && trendValue ? `, trend ${trend} by ${trendValue}` : ""}`

  return (
    <Card className="border-border bg-card p-4" role="article" aria-label={ariaLabel}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-foreground" style={{ color }}>
              {value}
            </span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {trend && trendValue && (
            <div className="mt-2 flex items-center gap-1">
              {trend === "up" && <ArrowUpIcon className="h-3 w-3 text-green-500" aria-hidden="true" />}
              {trend === "down" && <ArrowDownIcon className="h-3 w-3 text-red-500" aria-hidden="true" />}
              <span
                className={`text-xs ${
                  trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </Card>
  )
})
