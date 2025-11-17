import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "299",
      period: "месец",
      description: "Идеален за малки бизнеси и стартъпи",
      features: [
        "До 1000 разговора месечно",
        "Основни интеграции",
        "Email поддръжка",
        "Базов AI модел",
        "1 гласов асистент",
      ],
      cta: "Започни сега",
      popular: false,
    },
    {
      name: "Pro",
      price: "599",
      period: "месец",
      description: "За растящи компании с високи изисквания",
      features: [
        "До 5000 разговора месечно",
        "Всички интеграции",
        "Приоритетна поддръжка",
        "Персонализиран AI модел",
        "До 3 гласови асистента",
        "Advanced анализ",
        "Custom гласове",
      ],
      cta: "Избери Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "За големи корпорации и специални нужди",
      features: [
        "Неограничени разговори",
        "Dedicated инфраструктура",
        "24/7 техническа поддръжка",
        "Custom AI обучение",
        "Неограничени асистенти",
        "White label решение",
        "SLA гаранция",
        "On-premise опция",
      ],
      cta: "Свържи се с нас",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Планове и <span className="neon-text">цени</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Изберете плана, който отговаря на вашите нужди
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Без начална такса</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>30-дневна гаранция</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Без обвързващ договор</span>
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
                    Най-популярен
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

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse-glow"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
