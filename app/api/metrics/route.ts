import type { NextRequest } from "next/server"

// Simulated streaming metrics data generator
function generateMetrics() {
  const now = Date.now()

  return {
    timestamp: now,
    bitrate: Math.floor(2500 + Math.random() * 1500), // 2500-4000 kbps
    latency: Math.floor(50 + Math.random() * 150), // 50-200 ms
    errorRate: Math.random() * 5, // 0-5%
    activeStreams: Math.floor(100 + Math.random() * 50),
    bandwidth: {
      outgoing: Math.floor(800 + Math.random() * 400), // MB
      incoming: Math.floor(200 + Math.random() * 150), // MB
    },
  }
}

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const metrics = generateMetrics()
        const data = `data: ${JSON.stringify(metrics)}\n\n`
        controller.enqueue(encoder.encode(data))
      }, 1000) // Send metrics every second

      // Cleanup on connection close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
