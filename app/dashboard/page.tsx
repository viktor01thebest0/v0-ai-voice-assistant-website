"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser, type User } from "@/lib/auth"
import { useLanguage } from "@/lib/language"
import { ArrowLeft, Users, Calendar, Clock, RefreshCw, Phone, Scissors } from "lucide-react"

interface Booking {
  id: number
  call_id: string | null
  customer_name: string | null
  phone_number: string | null
  service_type: string | null
  appointment_date: string | null
  appointment_time: string | null
  created_at: string
}

interface BookingsData {
  totalBookings: number
  uniqueCustomers: number
  todayBookings: number
  thisMonthBookings: number
  recentBookings: Booking[]
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<BookingsData | null>(null)
  const [dataLoading, setDataLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const isBg = t("nav.about") === "За нас"

  const fetchBookings = useCallback(async () => {
    setDataLoading(true)
    try {
      const res = await fetch("/api/bookings")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err)
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) { router.push("/"); return }
    setUser(currentUser)
    setIsLoading(false)
    fetchBookings()
  }, [router, fetchBookings])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    )
  }
  if (!user) return null

  const hasData = data && data.totalBookings > 0

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
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBookings}
            disabled={dataLoading}
            className="bg-transparent"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${dataLoading ? "animate-spin" : ""}`} />
            {isBg ? "Обнови" : "Refresh"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Общо резервации" : "Total Bookings"}
              </CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data?.totalBookings ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {isBg ? "Всички записани часове" : "All time appointments"}
              </p>
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
              <div className="text-3xl font-bold">{data?.uniqueCustomers ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {isBg ? "По телефонен номер" : "By phone number"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Този месец" : "This Month"}
              </CardTitle>
              <Clock className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data?.thisMonthBookings ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {isBg ? "Резервации през месеца" : "Bookings this month"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isBg ? "Днешни часове" : "Today's Bookings"}
              </CardTitle>
              <Calendar className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data?.todayBookings ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {isBg ? "Записани за днес" : "Scheduled for today"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              {isBg ? "Последни резервации" : "Recent Bookings"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!hasData ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  {isBg ? "Все още няма резервации" : "No bookings yet"}
                </h3>
                <p className="text-sm text-muted-foreground/70 text-center max-w-md">
                  {isBg
                    ? "Когато клиенти се обадят и запишат час чрез AI агента, резервациите ще се показват тук."
                    : "When customers call and book appointments through the AI agent, bookings will appear here."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Scissors className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.customer_name || (isBg ? "Неизвестен" : "Unknown")}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {booking.phone_number && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {booking.phone_number}
                            </span>
                          )}
                          {booking.service_type && (
                            <span className="px-2 py-0.5 bg-primary/10 rounded text-xs text-primary">
                              {booking.service_type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {booking.appointment_date && (
                        <p className="text-sm font-medium">{booking.appointment_date}</p>
                      )}
                      {booking.appointment_time && (
                        <p className="text-xs text-muted-foreground">{booking.appointment_time}</p>
                      )}
                      {!booking.appointment_date && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
