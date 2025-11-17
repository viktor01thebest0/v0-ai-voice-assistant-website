"use client"

import { Card } from "@/components/ui/card"
import { UtensilsCrossed, Scissors, ShoppingBag, Hotel, Briefcase } from "lucide-react"
import { useState } from "react"

export function IndustriesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const industries = [
    {
      icon: UtensilsCrossed,
      title: "Ресторанти",
      description: "Автоматични резервации, поръчки и клиентско обслужване",
      demo: "Здравейте! Бих искал да резервирам маса за 4-ма души...",
    },
    {
      icon: Scissors,
      title: "Фризьорски салон",
      description: "Записвания за пострижка, напомняния и информация",
      demo: "Добър ден, искам да запиша час при Данката...",
    },
    {
      icon: ShoppingBag,
      title: "Онлайн магазини",
      description: "Поддръжка на клиенти, проследяване на поръчки",
      demo: "Здравейте, имам въпрос относно моята поръчка...",
    },
    {
      icon: Hotel,
      title: "Хотели",
      description: "Резервации, рецепция и консиерж услуги",
      demo: "Искам да резервирам стая за периода 15-20 юни...",
    },
    {
      icon: Briefcase,
      title: "Корпоративна поддръжка",
      description: "Вътрешна комуникация и HR асистенти",
      demo: "Искам да подам заявка за отпуск...",
    },
  ]

  return (
    <section id="industries" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Сфери на <span className="neon-text">приложение</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Нашите AI асистенти работят успешно в различни индустрии
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

              {/* Demo text on hover */}
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
