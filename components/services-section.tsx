import { Card } from "@/components/ui/card"
import { MessageSquare, Phone, Link2, BarChart3 } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: Phone,
      title: "Гласови AI асистенти",
      description: "Автоматизирани обаждания, резервации и клиентско обслужване 24/7 с естествен човешки глас.",
      features: ["Автоматични обаждания", "Резервации и записвания", "Клиентска поддръжка", "Многоезична поддръжка"],
    },
    {
      icon: MessageSquare,
      title: "Чатботи с естествен език",
      description: "Интелигентни текстови асистенти за сайтове, социални мрежи и месинджъри.",
      features: ["Facebook Messenger", "WhatsApp интеграция", "Уеб чат", "Instagram DM"],
    },
    {
      icon: Link2,
      title: "Интеграции",
      description: "Свързване с вашите съществуващи системи за безпроблемна автоматизация.",
      features: ["CRM системи", "ERP софтуер", "Календари", "Телефонни централи"],
    },
    {
      icon: BarChart3,
      title: "AI анализ и отчетност",
      description: "Проследяване на ефективността и детайлни отчети за всяко взаимодействие.",
      features: ["Real-time статистики", "Анализ на разговори", "ROI отчети", "Sentiment анализ"],
    },
  ]

  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Нашите <span className="neon-text">услуги</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Пълен пакет от AI решения за автоматизация на вашия бизнес
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
