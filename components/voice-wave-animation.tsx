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
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Central orb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-primary/20 animate-pulse-glow blur-xl" />
        <div className="absolute w-20 h-20 md:w-32 md:h-32 rounded-full bg-primary/40 animate-pulse" />
        <div className="absolute w-14 h-14 md:w-24 md:h-24 rounded-full bg-primary animate-float" />
      </div>

      {/* Voice wave bars */}
      <div className="absolute inset-0 flex items-center justify-center gap-0.5 md:gap-1 px-4">
        {bars.slice(0, 20).map((height, i) => (
          <div
            key={i}
            className="w-1 md:w-1.5 bg-primary rounded-full animate-wave"
            style={{
              height: `${Math.min(height, 60)}px`,
              animationDelay: `${i * 0.05}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* Decorative rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-40 h-40 md:w-64 md:h-64 rounded-full border-2 border-primary/20 animate-ping"
          style={{ animationDuration: "3s" }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-52 h-52 md:w-80 md:h-80 rounded-full border border-primary/10 animate-ping"
          style={{ animationDuration: "4s" }}
        />
      </div>
    </div>
  )
}
