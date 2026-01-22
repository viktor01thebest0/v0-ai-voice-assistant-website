"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { VoiceWaveAnimation } from "./voice-wave-animation"
import { useState } from "react"
import { AuthDialog } from "./auth-dialog"
import { useLanguage } from "@/lib/language"

export function HeroSection() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const { t } = useLanguage()

  const handleDemoClick = () => {
    setAuthDialogOpen(true)
  }

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false)
    window.location.reload()
  }

  return (
    <>
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary animate-pulse-glow">
                  {t("hero.badge")}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                {t("hero.title")} <span className="neon-text">{t("hero.titleHighlight")}</span> {t("hero.titleEnd")}
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                {t("hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 animate-pulse-glow"
                  onClick={handleDemoClick}
                >
                  {t("hero.cta")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold neon-text">{t("hero.stat1")}</div>
                  <div className="text-sm text-muted-foreground">{t("hero.stat1Label")}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold neon-text">{t("hero.stat2")}</div>
                  <div className="text-sm text-muted-foreground">{t("hero.stat2Label")}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold neon-text">{t("hero.stat3")}</div>
                  <div className="text-sm text-muted-foreground">{t("hero.stat3Label")}</div>
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
