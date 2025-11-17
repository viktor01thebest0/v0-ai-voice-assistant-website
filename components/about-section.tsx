import { Card } from "@/components/ui/card"
import { Target, Users, Zap } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            За <span className="neon-text">нас</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Създаваме решения с изкуствен интелект за реални компании
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Нашата мисия</h3>
            <p className="text-muted-foreground leading-relaxed">
              Да направим комуникацията между хора и технологии естествена и достъпна за всеки бизнес.
            </p>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Нашият екип</h3>
            <p className="text-muted-foreground leading-relaxed">
              Специалисти в AI технологии, гласови интерфейси и автоматизация на бизнес процеси.
            </p>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Нашата визия</h3>
            <p className="text-muted-foreground leading-relaxed">
              Всяка компания да има достъп до персонализиран AI асистент, който работи 24/7.
            </p>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12 border border-primary/20">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold mb-4">Нашата история</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Започнахме с идеята да направим гласовите AI асистенти достъпни за малките и средни бизнеси. Днес работим
              с водещи компании в различни индустрии и помагаме да автоматизират клиентското си обслужване.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Нашите решения са помогнали на стотици компании да намалят разходите си с до 40% и да обслужват повече
              клиенти с по-високо качество.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
