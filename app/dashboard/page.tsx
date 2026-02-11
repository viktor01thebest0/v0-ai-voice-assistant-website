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
  Phone, Clock, TrendingUp, ArrowLeft, CheckCircle, XCircle,
  Users, BarChart3, PhoneCall, Timer, RefreshCw, Calendar,
  Scissors, UserCheck, CalendarCheck
} from "lucide-react"

interface Analytics {
  totalCalls: number
  callsThisMonth: number
  totalMinutes: number
  totalHours: number
  minutesThisMonth: number
  avgDurationSeconds: number
  successfulCalls: number
  failedCalls: number
  successRate: number
  uniqueCustomers: number
  totalAppointments: number
  appointmentsThisMonth: number
  confirmedAppointments: number
  cancelledAppointments: number
  upcomingAppointments: number
  trend: number
  recentCalls: {
    id: string
    customerPhone: string
    duration: number
    status: string
    summary: string | null
    endedReason: string | null
    startedAt: string
  }[]
  recentAppointments: {
    id: number
    customerName: string
    customerPhone: string
    date: string
    time: string
    service: string
    stylist: string
    status: string
    createdAt: string
  }[]
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  const router = useRouter()
  const { t } = useLanguage()

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    setAnalyticsError(null)
    try {
      const response = await fetch("/api/vapi/analytics")
      if (!response.ok) throw new Error("Failed to fetch analytics")
      const data = await response.json()
      if (data.error) setAnalyticsError(data.error)
      setAnalytics(data)
    } catch (error) {
      setAnalyticsError("Failed to load analytics")
    } finally {
      setAnalyticsLoading(false)
    }
  }

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) { router.push("/"); return }
    setUser(currentUser)
    setIsLoading(false)
    fetchAnalytics()
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const val = (v: number | undefined) => analyticsLoading ? "..." : (v ?? 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
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
          <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={analyticsLoading} className="gap-2 bg-transparent">
            <RefreshCw className={`h-4 w-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
            {isBg ? "Обнови" : "Refresh"}
          </Button>
        </div>

        {analyticsError && (
          <Card className="bg-destructive/10 border-destructive/50 mb-6">
            <CardContent className="py-4">
              <p className="text-destructive text-sm">{analyticsError}</p>
            </CardContent>
          </Card>
        )}

        {/* Call Metrics */}
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          {isBg ? "Обаждания" : "Calls"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Общо обаждания" : "Total Calls"}
              </CardTitle>
              <Phone className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{val(analytics?.totalCalls)}</div>
              {analytics && analytics.trend !== 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={analytics.trend > 0 ? "text-green-500" : "text-red-500"}>
                    {analytics.trend > 0 ? "+" : ""}{analytics.trend}%
                  </span> {isBg ? "спрямо миналия месец" : "vs last month"}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Този месец" : "This Month"}
              </CardTitle>
              <PhoneCall className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{val(analytics?.callsThisMonth)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {val(analytics?.minutesThisMonth)} {isBg ? "минути" : "minutes"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Общо време" : "Total Duration"}
              </CardTitle>
              <Clock className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analyticsLoading ? "..." : `${analytics?.totalHours || 0}h`}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {val(analytics?.totalMinutes)} {isBg ? "минути общо" : "minutes total"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Средна продължителност" : "Avg Duration"}
              </CardTitle>
              <Timer className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analyticsLoading ? "..." : formatDuration(analytics?.avgDurationSeconds || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{isBg ? "на обаждане" : "per call"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Call Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Успешност" : "Success Rate"}
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{val(analytics?.successRate)}%</div>
              <Progress value={analytics?.successRate || 0} className="mt-2 h-2" />
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-green-500">{val(analytics?.successfulCalls)} {isBg ? "успешни" : "success"}</span>
                <span className="text-xs text-red-500">{val(analytics?.failedCalls)} {isBg ? "неуспешни" : "failed"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Уникални клиенти" : "Unique Customers"}
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{val(analytics?.uniqueCustomers)}</div>
              <p className="text-xs text-muted-foreground mt-1">{isBg ? "различни номера" : "different numbers"}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Предстоящи часове" : "Upcoming Appointments"}
              </CardTitle>
              <CalendarCheck className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{val(analytics?.upcomingAppointments)}</div>
              <p className="text-xs text-muted-foreground mt-1">{isBg ? "потвърдени" : "confirmed"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Section */}
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {isBg ? "Записани часове" : "Appointments"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Общо записвания" : "Total Bookings"}
              </CardTitle>
              <Scissors className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{val(analytics?.totalAppointments)}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Този месец" : "This Month"}
              </CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{val(analytics?.appointmentsThisMonth)}</div>
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
              <div className="text-3xl font-bold text-green-500">{val(analytics?.confirmedAppointments)}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Отменени" : "Cancelled"}
              </CardTitle>
              <XCircle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{val(analytics?.cancelledAppointments)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Calls */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                {isBg ? "Последни обаждания" : "Recent Calls"}
              </CardTitle>
              <CardDescription>{isBg ? "Данни от Vapi webhook" : "Data from Vapi webhook"}</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="text-center py-8 text-muted-foreground">{isBg ? "Зареждане..." : "Loading..."}</div>
              ) : analytics?.recentCalls && analytics.recentCalls.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recentCalls.map((call) => (
                    <div key={call.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3">
                        {call.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{call.customerPhone}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(call.startedAt).toLocaleString(isBg ? 'bg-BG' : 'en-US', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatDuration(call.duration)}</p>
                        <p className="text-xs text-muted-foreground">{call.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">{isBg ? "Няма обаждания все още" : "No calls yet"}</div>
              )}
            </CardContent>
          </Card>

          {/* Recent Appointments */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {isBg ? "Последни записвания" : "Recent Appointments"}
              </CardTitle>
              <CardDescription>{isBg ? "Записани чрез AI асистента" : "Booked via AI assistant"}</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="text-center py-8 text-muted-foreground">{isBg ? "Зареждане..." : "Loading..."}</div>
              ) : analytics?.recentAppointments && analytics.recentAppointments.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recentAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3">
                        {apt.status === "confirmed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : apt.status === "cancelled" ? (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{apt.customerName}</p>
                          <p className="text-xs text-muted-foreground">{apt.service} - {apt.stylist}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{apt.date}</p>
                        <p className="text-xs text-muted-foreground">{apt.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">{isBg ? "Няма записвания все още" : "No appointments yet"}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
