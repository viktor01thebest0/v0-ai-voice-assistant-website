"use client"

import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useLanguage } from "@/lib/language"

export function PricingSection() {
  const { t } = useLanguage()

  const plans = [
    {
      name: t("pricing.starter.name"),
      price: "299",
      period: t("pricing.month"),
      description: t("pricing.starter.description"),
      features: [
        t("pricing.starter.f1"),
        t("pricing.starter.f2"),
        t("pricing.starter.f3"),
        t("pricing.starter.f4"),
        t("pricing.starter.f5"),
      ],
      cta: t("pricing.starter.cta"),
      popular: false,
    },
    {
      name: t("pricing.pro.name"),
      price: "599",
      period: t("pricing.month"),
      description: t("pricing.pro.description"),
      features: [
        t("pricing.pro.f1"),
        t("pricing.pro.f2"),
        t("pricing.pro.f3"),
        t("pricing.pro.f4"),
        t("pricing.pro.f5"),
        t("pricing.pro.f6"),
        t("pricing.pro.f7"),
      ],
      cta: t("pricing.pro.cta"),
      popular: true,
    },
    {
      name: t("pricing.enterprise.name"),
      price: "Custom",
      period: "",
      description: t("pricing.enterprise.description"),
      features: [
        t("pricing.enterprise.f1"),
        t("pricing.enterprise.f2"),
        t("pricing.enterprise.f3"),
        t("pricing.enterprise.f4"),
        t("pricing.enterprise.f5"),
        t("pricing.enterprise.f6"),
        t("pricing.enterprise.f7"),
        t("pricing.enterprise.f8"),
      ],
      cta: t("pricing.enterprise.cta"),
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("pricing.title")} <span className="neon-text">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t("pricing.subtitle")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>{t("pricing.noFee")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>{t("pricing.guarantee")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>{t("pricing.noContract")}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 bg-card/50 backdrop-blur border-border transition-all relative ${
                plan.popular ? "border-primary shadow-lg shadow-primary/20 scale-105" : "hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full animate-pulse-glow">
                    {t("pricing.popular")}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold neon-text">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground ml-2">лв/{plan.period}</span>}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
