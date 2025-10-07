"use client"

interface ConnectionStatusProps {
  isConnected: boolean
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2" role="status" aria-live="polite">
      <div
        className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`}
        aria-hidden="true"
      />
      <span className="text-xs text-muted-foreground">{isConnected ? "Live" : "Disconnected"}</span>
      <span className="sr-only">
        Connection status: {isConnected ? "Connected to live data stream" : "Disconnected from data stream"}
      </span>
    </div>
  )
}
