"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getCurrentUser, type User } from "@/lib/auth"
import { useLanguage } from "@/lib/language"
import { 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  ArrowLeft,
  Bot,
  Users,
  Calendar,
  BarChart3
} from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t } = useLanguage()

  // Simulated metrics data - in production, fetch from database
  const [metrics] = useState({
    totalConversations: 1247,
    hoursSaved: 156,
    efficiencyIncrease: 78,
    activeAssistants: 3,
    totalCustomers: 89,
    appointmentsThisMonth: 234
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("nav.about") === "За нас" ? "Назад към началото" : "Back to home"}
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

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Conversations */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.conversations")}
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{metrics.totalConversations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">+12%</span> {t("nav.about") === "За нас" ? "спрямо миналия месец" : "from last month"}
              </p>
            </CardContent>
          </Card>

          {/* Hours Saved */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.hours")}
              </CardTitle>
              <Clock className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{metrics.hoursSaved}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">+8%</span> {t("nav.about") === "За нас" ? "спрямо миналия месец" : "from last month"}
              </p>
            </CardContent>
          </Card>

          {/* Efficiency Increase */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.efficiency")}
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{metrics.efficiencyIncrease}%</div>
              <Progress value={metrics.efficiencyIncrease} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Assistants */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("nav.about") === "За нас" ? "Активни асистенти" : "Active Assistants"}
              </CardTitle>
              <Bot className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{metrics.activeAssistants}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("nav.about") === "За нас" ? "Работят 24/7" : "Working 24/7"}
              </p>
            </CardContent>
          </Card>

          {/* Total Customers */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("nav.about") === "За нас" ? "Обслужени клиенти" : "Customers Served"}
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{metrics.totalCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">+23</span> {t("nav.about") === "За нас" ? "нови този месец" : "new this month"}
              </p>
            </CardContent>
          </Card>

          {/* Appointments This Month */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("nav.about") === "За нас" ? "Записани часове" : "Appointments Booked"}
              </CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{metrics.appointmentsThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("nav.about") === "За нас" ? "този месец" : "this month"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {t("nav.about") === "За нас" ? "Преглед на ефективността" : "Performance Overview"}
                </CardTitle>
                <CardDescription>
                  {t("nav.about") === "За нас" 
                    ? "Как AI асистентите подобряват вашия бизнес" 
                    : "How AI assistants are improving your business"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("nav.about") === "За нас" ? "Удовлетвореност на клиентите" : "Customer Satisfaction"}
                  </span>
                  <span className="text-sm font-medium text-primary">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("nav.about") === "За нас" ? "Успешно резервирани часове" : "Successful Bookings"}
                  </span>
                  <span className="text-sm font-medium text-primary">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("nav.about") === "За нас" ? "Разрешени запитвания" : "Resolved Inquiries"}
                  </span>
                  <span className="text-sm font-medium text-primary">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("nav.about") === "За нас" ? "Намалено време за отговор" : "Reduced Response Time"}
                  </span>
                  <span className="text-sm font-medium text-primary">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
