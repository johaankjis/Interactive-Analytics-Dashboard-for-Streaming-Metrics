import { NextResponse } from "next/server"

// Generate historical data for initial chart population
export async function GET() {
  const now = Date.now()
  const dataPoints = 720 // 12 hours of data (1 point per minute)
  const historical = []

  for (let i = dataPoints; i >= 0; i--) {
    const timestamp = now - i * 60 * 1000 // Go back in time by minutes

    historical.push({
      timestamp,
      bitrate: Math.floor(2500 + Math.random() * 1500),
      latency: Math.floor(50 + Math.random() * 150),
      errorRate: Math.random() * 5,
      activeStreams: Math.floor(100 + Math.random() * 50),
      bandwidth: {
        outgoing: Math.floor(800 + Math.random() * 400),
        incoming: Math.floor(200 + Math.random() * 150),
      },
    })
  }

  return NextResponse.json(historical)
}
