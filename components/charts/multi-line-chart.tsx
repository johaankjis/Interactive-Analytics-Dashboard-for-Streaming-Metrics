"use client"

import { useEffect, useRef, useMemo, memo } from "react"
import * as d3 from "d3"
import type { StreamingMetrics } from "@/lib/types"

interface MultiLineChartProps {
  data: StreamingMetrics[]
  title: string
  height?: number
}

export const MultiLineChart = memo(function MultiLineChart({ data, title, height = 200 }: MultiLineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const chartData = useMemo(() => {
    return data.map((d) => ({
      timestamp: d.timestamp,
      outgoing: d.bandwidth.outgoing,
      incoming: d.bandwidth.incoming,
    }))
  }, [data])

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
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(chartData, (d) => d.timestamp) as [number, number])
      .range([0, innerWidth])

    const maxValue = Math.max(
      d3.max(chartData, (d) => d.outgoing) as number,
      d3.max(chartData, (d) => d.incoming) as number,
    )

    const yScale = d3.scaleLinear().domain([0, maxValue]).nice().range([innerHeight, 0])

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

    // Outgoing line
    const outgoingLine = d3
      .line<{ timestamp: number; outgoing: number }>()
      .x((d) => xScale(d.timestamp))
      .y((d) => yScale(d.outgoing))
      .curve(d3.curveMonotoneX)

    svg
      .append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "rgb(59, 130, 246)")
      .attr("stroke-width", 2)
      .attr("d", outgoingLine)

    // Incoming area
    const incomingArea = d3
      .area<{ timestamp: number; incoming: number }>()
      .x((d) => xScale(d.timestamp))
      .y0(innerHeight)
      .y1((d) => yScale(d.incoming))
      .curve(d3.curveMonotoneX)

    svg
      .append("path")
      .datum(chartData)
      .attr("fill", "rgb(234, 179, 8)")
      .attr("fill-opacity", 0.3)
      .attr("d", incomingArea)

    // Incoming line
    const incomingLine = d3
      .line<{ timestamp: number; incoming: number }>()
      .x((d) => xScale(d.timestamp))
      .y((d) => yScale(d.incoming))
      .curve(d3.curveMonotoneX)

    svg
      .append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "rgb(234, 179, 8)")
      .attr("stroke-width", 2)
      .attr("d", incomingLine)

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
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => `${d}MB`),
      )
      .attr("color", "rgb(115, 115, 115)")
      .selectAll("text")
      .attr("font-size", "11px")
  }, [chartData, height])

  const latestData = chartData[chartData.length - 1]

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[rgb(59,130,246)]" />
            <span className="text-xs text-muted-foreground">Outgoing {latestData?.outgoing.toFixed(0)}MB</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[rgb(234,179,8)]" />
            <span className="text-xs text-muted-foreground">Incoming {latestData?.incoming.toFixed(0)}MB</span>
          </div>
        </div>
      </div>
      <div ref={containerRef} className="w-full">
        <svg ref={svgRef} className="w-full" />
      </div>
    </div>
  )
})
