"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { VoiceWaveAnimation } from "./voice-wave-animation"
import { useState } from "react"
import { AuthDialog } from "./auth-dialog"

export function HeroSection() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  const handleDemoClick = () => {
    setAuthDialogOpen(true)
  }

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false)
    alert("Успешно се регистрирахте! Благодарим ви за интереса към Voxal.")
  }

  return (
    <>
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary animate-pulse-glow">
                  AI Гласови Асистенти
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                Дай глас на своя <span className="neon-text">бизнес</span> с изкуствен интелект
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Създаваме персонализирани гласови AI асистенти, които работят 24/7, говорят като хора и повишават
                ефективността на твоя бизнес.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 animate-pulse-glow"
                  onClick={handleDemoClick}
                >
                  Изпробвай демо
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold neon-text">24/7</div>
                  <div className="text-sm text-muted-foreground">Денонощна работа</div>
                </div>
                <div>
                  <div className="text-3xl font-bold neon-text">-40%</div>
                  <div className="text-sm text-muted-foreground">По-ниски разходи</div>
                </div>
                <div>
                  <div className="text-3xl font-bold neon-text">+60%</div>
                  <div className="text-sm text-muted-foreground">Повече клиенти</div>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[600px] flex items-center justify-center">
              <VoiceWaveAnimation />
            </div>
          </div>
        </div>
      </section>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} onAuthSuccess={handleAuthSuccess} />
    </>
  )
}
