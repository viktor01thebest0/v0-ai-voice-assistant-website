import { Card } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Users, Clock } from "lucide-react"

export function CaseStudiesSection() {
  const cases = [
    {
      company: 'Ресторант "Традиция"',
      industry: "Ресторантьорство",
      results: [
        { icon: TrendingDown, label: "Разходи", value: "-45%", positive: true },
        { icon: Users, label: "Резервации", value: "+80%", positive: true },
        { icon: Clock, label: "Време за отговор", value: "< 30 сек", positive: true },
      ],
      description: "Автоматизирано приемане на резервации и отговаряне на въпроси 24/7",
    },
    {
      company: 'Фризьорски салон "Luxury Hair"',
      industry: "Лични услуги",
      results: [
        { icon: Users, label: "Записани клиенти", value: "+65%", positive: true },
        { icon: TrendingDown, label: "Пропуснати обаждания", value: "-90%", positive: true },
        { icon: TrendingUp, label: "Удовлетвореност", value: "95%", positive: true },
      ],
      description: "AI асистент за записване на часове и напомняния на клиенти",
    },
    {
      company: 'E-shop "TechZone"',
      industry: "E-commerce",
      results: [
        { icon: TrendingUp, label: "Продажби", value: "+55%", positive: true },
        { icon: Users, label: "Обслужени клиенти", value: "+120%", positive: true },
        { icon: TrendingDown, label: "Време за отговор", value: "-85%", positive: true },
      ],
      description: "24/7 клиентска поддръжка и асистент за продажби",
    },
  ]

  return (
    <section id="case-studies" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Истории на <span className="neon-text">успеха</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Реални резултати от реални компании</p>
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
