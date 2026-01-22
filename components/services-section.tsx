"use client"

import { Card } from "@/components/ui/card"
import { MessageSquare, Phone, Link2, BarChart3 } from "lucide-react"
import { useLanguage } from "@/lib/language"

export function ServicesSection() {
  const { t } = useLanguage()

  const services = [
    {
      icon: Phone,
      title: t("services.voice.title"),
      description: t("services.voice.description"),
      features: [t("services.voice.f1"), t("services.voice.f2"), t("services.voice.f3"), t("services.voice.f4")],
    },
    {
      icon: MessageSquare,
      title: t("services.chat.title"),
      description: t("services.chat.description"),
      features: [t("services.chat.f1"), t("services.chat.f2"), t("services.chat.f3"), t("services.chat.f4")],
    },
    {
      icon: Link2,
      title: t("services.integration.title"),
      description: t("services.integration.description"),
      features: [t("services.integration.f1"), t("services.integration.f2"), t("services.integration.f3"), t("services.integration.f4")],
    },
    {
      icon: BarChart3,
      title: t("services.analytics.title"),
      description: t("services.analytics.description"),
      features: [t("services.analytics.f1"), t("services.analytics.f2"), t("services.analytics.f3"), t("services.analytics.f4")],
    },
  ]

  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("services.title")} <span className="neon-text">{t("services.titleHighlight")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-8 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all group"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:animate-pulse-glow transition-all">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
