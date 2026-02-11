import { NextResponse } from "next/server"
import { VapiClient } from "@vapi-ai/server-sdk"

// Vapi Server SDK requires the Private API Key
const VAPI_API_KEY = process.env.VAPI_API_KEY

export async function GET() {
  if (!VAPI_API_KEY) {
    return NextResponse.json({
      totalCalls: 0,
      callsThisMonth: 0,
      totalMinutes: 0,
      totalHours: 0,
      minutesThisMonth: 0,
      avgDurationSeconds: 0,
      successfulCalls: 0,
      failedCalls: 0,
      successRate: 0,
      uniqueCustomers: 0,
      recentCalls: [],
      callsByDate: {},
      trend: 0,
      error: "VAPI_API_KEY not configured"
    })
  }

  try {
    const client = new VapiClient({ token: VAPI_API_KEY })
    
    // Fetch calls using the SDK
    const calls = await client.calls.list({ limit: 100 })
    
    // Calculate analytics from calls data
    const totalCalls = calls.length || 0
    
    let totalDurationMs = 0
    let successfulCalls = 0
    let failedCalls = 0
    const uniqueCustomers = new Set<string>()
    const callsByDate: Record<string, number> = {}
    
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    let callsThisMonth = 0
    let durationThisMonth = 0

    for (const call of calls) {
      if (call.startedAt && call.endedAt) {
        const duration = new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()
        totalDurationMs += duration
        
        const callDate = new Date(call.startedAt)
        if (callDate.getMonth() === currentMonth && callDate.getFullYear() === currentYear) {
          callsThisMonth++
          durationThisMonth += duration
        }
        
        const dateKey = callDate.toISOString().split('T')[0]
        callsByDate[dateKey] = (callsByDate[dateKey] || 0) + 1
      }

      if (call.status === "ended" && call.endedReason === "assistant-ended-call") {
        successfulCalls++
      } else if (call.status === "ended") {
        // Count other ended calls as successful unless they have error reasons
        if (call.endedReason?.includes("error")) {
          failedCalls++
        } else {
          successfulCalls++
        }
      }

      if (call.customer?.number) {
        uniqueCustomers.add(call.customer.number)
      }
    }

    const totalMinutes = Math.round(totalDurationMs / 60000)
    const totalHours = Math.round(totalMinutes / 60)
    const minutesThisMonth = Math.round(durationThisMonth / 60000)
    const avgDurationSeconds = totalCalls > 0 
      ? Math.round(totalDurationMs / totalCalls / 1000) 
      : 0
    const successRate = totalCalls > 0 
      ? Math.round((successfulCalls / totalCalls) * 100) 
      : 0

    const recentCalls = calls.slice(0, 10).map((call) => ({
      id: call.id,
      status: call.status,
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      duration: call.startedAt && call.endedAt 
        ? Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
        : 0,
      customerPhone: call.customer?.number 
        ? `${call.customer.number.slice(0, 4)}****${call.customer.number.slice(-2)}`
        : "Unknown",
      endedReason: call.endedReason,
    }))

    // Calculate trend
    const sortedDates = Object.keys(callsByDate).sort()
    const halfwayIndex = Math.floor(sortedDates.length / 2)
    const firstHalfCalls = sortedDates.slice(0, halfwayIndex).reduce((sum, date) => sum + callsByDate[date], 0)
    const secondHalfCalls = sortedDates.slice(halfwayIndex).reduce((sum, date) => sum + callsByDate[date], 0)
    const trend = firstHalfCalls > 0 
      ? Math.round(((secondHalfCalls - firstHalfCalls) / firstHalfCalls) * 100)
      : 0

    return NextResponse.json({
      totalCalls,
      callsThisMonth,
      totalMinutes,
      totalHours,
      minutesThisMonth,
      avgDurationSeconds,
      successfulCalls,
      failedCalls,
      successRate,
      uniqueCustomers: uniqueCustomers.size,
      recentCalls,
      callsByDate,
      trend,
    })
  } catch (error) {
    console.error("[v0] Vapi SDK error:", error)
    
    // Return empty data structure so dashboard still works
    return NextResponse.json({
      totalCalls: 0,
      callsThisMonth: 0,
      totalMinutes: 0,
      totalHours: 0,
      minutesThisMonth: 0,
      avgDurationSeconds: 0,
      successfulCalls: 0,
      failedCalls: 0,
      successRate: 0,
      uniqueCustomers: 0,
      recentCalls: [],
      callsByDate: {},
      trend: 0,
      error: error instanceof Error ? error.message : "Failed to fetch analytics"
    })
  }
}
