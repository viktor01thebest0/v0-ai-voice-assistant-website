"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User, LogOut, Sun, Moon, Globe, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from "react"
import { getCurrentUser, logout, type User as UserType } from "@/lib/auth"
import { useTheme } from "@/lib/theme"
import { useLanguage } from "@/lib/language"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setUser(null)
    window.location.href = "/"
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
              {t("nav.about")}
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {t("nav.services")}
            </button>
            <button
              onClick={() => scrollToSection("industries")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {t("nav.industries")}
            </button>
            <button
              onClick={() => scrollToSection("case-studies")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {t("nav.clients")}
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {t("nav.pricing")}
            </button>
            
            {user && (
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                {t("nav.dashboard")}
              </Link>
            )}

            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse-glow rounded-full"
            >
              {t("nav.contact")}
            </Button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full border-primary/50 hover:border-primary bg-transparent">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs leading-none text-primary mt-1">
                        {user.role === "admin" ? t("dashboard.role.admin") : t("dashboard.role.client")}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        {t("nav.theme.light")}
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        {t("nav.theme.dark")}
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => setLanguage(language === "bg" ? "en" : "bg")}>
                    <Globe className="mr-2 h-4 w-4" />
                    {language === "bg" ? "English" : "Български"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full border-primary/50 hover:border-primary bg-transparent">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs leading-none text-primary mt-1">
                        {user.role === "admin" ? t("dashboard.role.admin") : t("dashboard.role.client")}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        {t("nav.theme.light")}
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        {t("nav.theme.dark")}
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => setLanguage(language === "bg" ? "en" : "bg")}>
                    <Globe className="mr-2 h-4 w-4" />
                    {language === "bg" ? "English" : "Български"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("about")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              {t("nav.about")}
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              {t("nav.services")}
            </button>
            <button
              onClick={() => scrollToSection("industries")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              {t("nav.industries")}
            </button>
            <button
              onClick={() => scrollToSection("case-studies")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              {t("nav.clients")}
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              {t("nav.pricing")}
            </button>
            {user && (
              <Link 
                href="/dashboard" 
                className="text-muted-foreground hover:text-foreground transition-colors text-left flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                {t("nav.dashboard")}
              </Link>
            )}
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-full"
            >
              {t("nav.contact")}
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
