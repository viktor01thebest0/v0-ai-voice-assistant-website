"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'
import { useState } from "react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-background/80 backdrop-blur-xl border border-border rounded-3xl px-6 py-3 shadow-lg shadow-primary/5">
        <div className="flex items-center justify-between">
          <button onClick={() => scrollToSection("hero")} className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Voxal Logo" width={40} height={40} className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-xl font-bold neon-text text-left">VOXAL</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider hidden sm:block">
                Give your business a voice
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("about")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              За нас
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Услуги
            </button>
            <button
              onClick={() => scrollToSection("industries")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Сфери
            </button>
            <button
              onClick={() => scrollToSection("case-studies")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Клиенти
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Цени
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse-glow rounded-full"
            >
              Контакт
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("about")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              За нас
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              Услуги
            </button>
            <button
              onClick={() => scrollToSection("industries")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              Сфери
            </button>
            <button
              onClick={() => scrollToSection("case-studies")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              Клиенти
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              Цени
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-full"
            >
              Контакт
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
