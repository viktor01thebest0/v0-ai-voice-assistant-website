"use client"

import { Card } from "@/components/ui/card"
import { UtensilsCrossed, Scissors, ShoppingBag, Hotel, Briefcase } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/language"

export function IndustriesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { t } = useLanguage()

  const industries = [
    {
      icon: UtensilsCrossed,
      title: t("industries.restaurant.title"),
      description: t("industries.restaurant.description"),
      demo: t("industries.restaurant.demo"),
    },
    {
      icon: Scissors,
      title: t("industries.salon.title"),
      description: t("industries.salon.description"),
      demo: t("industries.salon.demo"),
    },
    {
      icon: ShoppingBag,
      title: t("industries.shop.title"),
      description: t("industries.shop.description"),
      demo: t("industries.shop.demo"),
    },
    {
      icon: Hotel,
      title: t("industries.hotel.title"),
      description: t("industries.hotel.description"),
      demo: t("industries.hotel.demo"),
    },
    {
      icon: Briefcase,
      title: t("industries.corporate.title"),
      description: t("industries.corporate.description"),
      demo: t("industries.corporate.demo"),
    },
  ]

  return (
    <section id="industries" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("industries.title")} <span className="neon-text">{t("industries.titleHighlight")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("industries.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {industries.map((industry, index) => (
            <Card
              key={index}
              className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`relative z-10 transition-opacity duration-300 ${hoveredIndex === index ? "opacity-0" : "opacity-100"}`}
              >
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-all mx-auto">
                  <industry.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-center">{industry.title}</h3>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">{industry.description}</p>
              </div>

              {hoveredIndex === index && (
                <div className="absolute inset-0 bg-primary/95 p-6 flex items-center justify-center text-center animate-in fade-in duration-300">
                  <p className="text-primary-foreground text-sm italic leading-relaxed">"{industry.demo}"</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
