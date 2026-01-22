"use client"

import { Card } from "@/components/ui/card"
import { Target, Users, Zap } from "lucide-react"
import { useLanguage } from "@/lib/language"

export function AboutSection() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("about.title")} <span className="neon-text">{t("about.titleHighlight")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t("about.mission.title")}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("about.mission.text")}
            </p>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t("about.team.title")}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("about.team.text")}
            </p>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t("about.vision.title")}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("about.vision.text")}
            </p>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12 border border-primary/20">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold mb-4">{t("about.story.title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t("about.story.text1")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("about.story.text2")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
