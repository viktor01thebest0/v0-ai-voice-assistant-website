import Link from "next/link"
import { Facebook, Linkedin, Twitter, Instagram } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.jpg" alt="Voxal Logo" width={40} height={40} className="w-10 h-10" />
              <div>
                <span className="text-xl font-bold neon-text block">VOXAL</span>
                <span className="text-xs text-muted-foreground italic">Give your business a voice.</span>
              </div>
            </div>
            {/* </CHANGE> */}
            <p className="text-sm text-muted-foreground">
              Създаваме гласови AI асистенти, които работят 24/7 и говорят като хора.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Продукти</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#services" className="hover:text-foreground transition-colors">
                  Гласови асистенти
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-foreground transition-colors">
                  Чатботи
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-foreground transition-colors">
                  Интеграции
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-foreground transition-colors">
                  Анализ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Компания</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#about" className="hover:text-foreground transition-colors">
                  За нас
                </Link>
              </li>
              <li>
                <Link href="/#case-studies" className="hover:text-foreground transition-colors">
                  Клиенти
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-foreground transition-colors">
                  Цени
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-foreground transition-colors">
                  Контакти
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Правна информация</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Поверителност
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Условия за ползване
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="hover:text-foreground transition-colors">
                  GDPR
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition-colors">
                  Бисквитки
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Voxal. Всички права запазени.</p>
          {/* </CHANGE> */}

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-all"
            >
              <Facebook className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-all"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-all"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-all"
            >
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
