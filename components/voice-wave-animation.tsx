"use client"

import { useEffect, useState } from "react"

export function VoiceWaveAnimation() {
  const [bars, setBars] = useState<number[]>([])

  useEffect(() => {
    // Generate random heights for bars
    const generateBars = () => {
      const newBars = Array.from({ length: 30 }, () => Math.random() * 100 + 20)
      setBars(newBars)
    }

    generateBars()
    const interval = setInterval(generateBars, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central orb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-primary/20 animate-pulse-glow blur-xl" />
        <div className="absolute w-32 h-32 rounded-full bg-primary/40 animate-pulse" />
        <div className="absolute w-24 h-24 rounded-full bg-primary animate-float" />
      </div>

      {/* Voice wave bars */}
      <div className="absolute inset-0 flex items-center justify-center gap-1">
        {bars.map((height, i) => (
          <div
            key={i}
            className="w-1.5 bg-primary rounded-full animate-wave"
            style={{
              height: `${height}px`,
              animationDelay: `${i * 0.05}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* Decorative rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-64 h-64 rounded-full border-2 border-primary/20 animate-ping"
          style={{ animationDuration: "3s" }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-80 h-80 rounded-full border border-primary/10 animate-ping"
          style={{ animationDuration: "4s" }}
        />
      </div>
    </div>
  )
}
