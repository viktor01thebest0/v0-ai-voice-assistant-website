"use client"

import { Card } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Users, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language"

export function CaseStudiesSection() {
  const { t } = useLanguage()

  const cases = [
    {
      company: t("cases.case1.company"),
      industry: t("cases.case1.industry"),
      results: [
        { icon: TrendingDown, label: t("cases.costs"), value: "-45%", positive: true },
        { icon: Users, label: t("cases.reservations"), value: "+80%", positive: true },
        { icon: Clock, label: t("cases.responseTime"), value: "< 30 sec", positive: true },
      ],
      description: t("cases.case1.description"),
    },
    {
      company: t("cases.case2.company"),
      industry: t("cases.case2.industry"),
      results: [
        { icon: Users, label: t("cases.clients"), value: "+65%", positive: true },
        { icon: TrendingDown, label: t("cases.missedCalls"), value: "-90%", positive: true },
        { icon: TrendingUp, label: t("cases.satisfaction"), value: "95%", positive: true },
      ],
      description: t("cases.case2.description"),
    },
    {
      company: t("cases.case3.company"),
      industry: t("cases.case3.industry"),
      results: [
        { icon: TrendingUp, label: t("cases.sales"), value: "+55%", positive: true },
        { icon: Users, label: t("cases.servedClients"), value: "+120%", positive: true },
        { icon: TrendingDown, label: t("cases.responseTime"), value: "-85%", positive: true },
      ],
      description: t("cases.case3.description"),
    },
  ]

  return (
    <section id="case-studies" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("cases.title")} <span className="neon-text">{t("cases.titleHighlight")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("cases.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {cases.map((caseStudy, index) => (
            <Card
              key={index}
              className="p-8 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{caseStudy.company}</h3>
                <p className="text-sm text-primary">{caseStudy.industry}</p>
              </div>

              <p className="text-muted-foreground mb-8 leading-relaxed">{caseStudy.description}</p>

              <div className="space-y-4">
                {caseStudy.results.map((result, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <result.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">{result.label}</span>
                    </div>
                    <span className={`text-lg font-bold ${result.positive ? "text-primary" : "text-muted-foreground"}`}>
                      {result.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
