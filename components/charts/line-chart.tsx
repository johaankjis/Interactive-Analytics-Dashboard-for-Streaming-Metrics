"use client"

import { useEffect, useRef, useMemo, memo } from "react"
import * as d3 from "d3"
import type { StreamingMetrics } from "@/lib/types"

interface LineChartProps {
  data: StreamingMetrics[]
  dataKey: "bitrate" | "latency" | "errorRate"
  title: string
  color?: string
  height?: number
  showLegend?: boolean
  legendItems?: Array<{ label: string; color: string }>
}

export const LineChart = memo(function LineChart({
  data,
  dataKey,
  title,
  color = "rgb(59, 130, 246)",
  height = 200,
  showLegend = false,
  legendItems,
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const chartData = useMemo(() => {
    return data.map((d) => ({
      timestamp: d.timestamp,
      value: d[dataKey],
    }))
  }, [data, dataKey])

  const chartSummary = useMemo(() => {
    if (chartData.length === 0) return ""

    const values = chartData.map((d) => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const avg = values.reduce((a, b) => a + b, 0) / values.length

    return `Chart showing ${title} over time. Minimum: ${min.toFixed(2)}, Maximum: ${max.toFixed(2)}, Average: ${avg.toFixed(2)}`
  }, [chartData, title])

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || chartData.length === 0) return

    const container = containerRef.current
    const width = container.clientWidth
    const margin = { top: 20, right: 20, bottom: 30, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("role", "img")
      .attr("aria-label", chartSummary)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(chartData, (d) => d.timestamp) as [number, number])
      .range([0, innerWidth])

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.value) as number])
      .nice()
      .range([innerHeight, 0])

    // Grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => ""),
      )

    // Area
    const area = d3
      .area<{ timestamp: number; value: number }>()
      .x((d) => xScale(d.timestamp))
      .y0(innerHeight)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX)

    svg.append("path").datum(chartData).attr("fill", color).attr("fill-opacity", 0.2).attr("d", area)

    // Line
    const line = d3
      .line<{ timestamp: number; value: number }>()
      .x((d) => xScale(d.timestamp))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX)

    svg
      .append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line)

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(5)
          .tickFormat((d) => {
            const date = d as Date
            const now = new Date()
            const diff = now.getTime() - date.getTime()
            const hours = Math.floor(diff / (1000 * 60 * 60))
            if (hours === 0) return "Now"
            return `${hours}h ago`
          }),
      )
      .attr("color", "rgb(115, 115, 115)")
      .selectAll("text")
      .attr("font-size", "11px")

    // Y Axis
    svg
      .append("g")
      .call(d3.axisLeft(yScale).ticks(5))
      .attr("color", "rgb(115, 115, 115)")
      .selectAll("text")
      .attr("font-size", "11px")
  }, [chartData, color, height, chartSummary])

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {showLegend && legendItems && (
          <div className="flex items-center gap-4">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div ref={containerRef} className="w-full">
        <svg ref={svgRef} className="w-full" />
      </div>
    </div>
  )
})
