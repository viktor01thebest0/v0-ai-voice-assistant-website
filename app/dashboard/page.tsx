"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser, type User } from "@/lib/auth"
import { useLanguage } from "@/lib/language"
import { ArrowLeft, Users, Calendar, UserCheck, Clock } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) { router.push("/"); return }
    setUser(currentUser)
    setIsLoading(false)
  }, [router])

  const isBg = t("nav.about") === "За нас"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    )
  }
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4 bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {isBg ? "Назад към началото" : "Back to home"}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold neon-text">{t("dashboard.title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("dashboard.welcome")}, <span className="text-primary font-semibold">{user.name}</span>
              <span className="ml-2 px-2 py-0.5 bg-primary/20 rounded-full text-xs text-primary">
                {user.role === "admin" ? t("dashboard.role.admin") : t("dashboard.role.client")}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Общо клиенти" : "Total Clients"}
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">{isBg ? "Свържете AI агента" : "Connect AI agent"}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Записани часове" : "Appointments"}
              </CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">{isBg ? "Свържете AI агента" : "Connect AI agent"}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Потвърдени" : "Confirmed"}
              </CardTitle>
              <UserCheck className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">{isBg ? "Свържете AI агента" : "Connect AI agent"}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Предстоящи" : "Upcoming"}
              </CardTitle>
              <Clock className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">{isBg ? "Свържете AI агента" : "Connect AI agent"}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {isBg ? "Очаква се свързване на AI агент" : "Waiting for AI agent connection"}
            </h3>
            <p className="text-sm text-muted-foreground/70 text-center max-w-md">
              {isBg 
                ? "След като свържете вашия AI агент, тук ще се показват данни за обаждания и записани часове в реално време."
                : "Once you connect your AI agent, real-time call data and appointment bookings will appear here."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
