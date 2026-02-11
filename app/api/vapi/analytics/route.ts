import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Total calls
    const totalCallsResult = await sql`SELECT COUNT(*) as count FROM call_logs`
    const totalCalls = Number(totalCallsResult[0]?.count || 0)

    // Calls this month
    const callsThisMonthResult = await sql`
      SELECT COUNT(*) as count FROM call_logs 
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
    `
    const callsThisMonth = Number(callsThisMonthResult[0]?.count || 0)

    // Total duration
    const durationResult = await sql`
      SELECT 
        COALESCE(SUM(duration_seconds), 0) as total_seconds,
        COALESCE(AVG(duration_seconds), 0) as avg_seconds
      FROM call_logs
    `
    const totalSeconds = Number(durationResult[0]?.total_seconds || 0)
    const totalMinutes = Math.round(totalSeconds / 60)
    const totalHours = Math.round(totalMinutes / 60)
    const avgDurationSeconds = Math.round(Number(durationResult[0]?.avg_seconds || 0))

    // Duration this month
    const durationThisMonthResult = await sql`
      SELECT COALESCE(SUM(duration_seconds), 0) as total_seconds 
      FROM call_logs 
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
    `
    const minutesThisMonth = Math.round(Number(durationThisMonthResult[0]?.total_seconds || 0) / 60)

    // Success/failure counts
    const statusResult = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'completed') as successful,
        COUNT(*) FILTER (WHERE status = 'failed') as failed
      FROM call_logs
    `
    const successfulCalls = Number(statusResult[0]?.successful || 0)
    const failedCalls = Number(statusResult[0]?.failed || 0)
    const successRate = totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 0

    // Unique customers
    const uniqueResult = await sql`
      SELECT COUNT(DISTINCT customer_phone) as count 
      FROM call_logs 
      WHERE customer_phone != 'unknown'
    `
    const uniqueCustomers = Number(uniqueResult[0]?.count || 0)

    // Total appointments
    const appointmentsResult = await sql`SELECT COUNT(*) as count FROM appointments`
    const totalAppointments = Number(appointmentsResult[0]?.count || 0)

    // Appointments this month
    const appointmentsThisMonthResult = await sql`
      SELECT COUNT(*) as count FROM appointments 
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
    `
    const appointmentsThisMonth = Number(appointmentsThisMonthResult[0]?.count || 0)

    // Confirmed appointments
    const confirmedResult = await sql`
      SELECT COUNT(*) as count FROM appointments WHERE status = 'confirmed'
    `
    const confirmedAppointments = Number(confirmedResult[0]?.count || 0)

    // Cancelled appointments
    const cancelledResult = await sql`
      SELECT COUNT(*) as count FROM appointments WHERE status = 'cancelled'
    `
    const cancelledAppointments = Number(cancelledResult[0]?.count || 0)

    // Upcoming appointments
    const upcomingResult = await sql`
      SELECT COUNT(*) as count FROM appointments 
      WHERE appointment_date >= CURRENT_DATE AND status = 'confirmed'
    `
    const upcomingAppointments = Number(upcomingResult[0]?.count || 0)

    // Recent calls (last 10)
    const recentCalls = await sql`
      SELECT 
        vapi_call_id as id,
        customer_phone,
        duration_seconds,
        status,
        summary,
        ended_reason,
        created_at
      FROM call_logs 
      ORDER BY created_at DESC 
      LIMIT 10
    `

    // Recent appointments (last 10)
    const recentAppointments = await sql`
      SELECT 
        id,
        customer_name,
        customer_phone,
        appointment_date,
        appointment_time,
        service,
        stylist,
        status,
        created_at
      FROM appointments 
      ORDER BY created_at DESC 
      LIMIT 10
    `

    // Trend: compare this month vs last month calls
    const lastMonthResult = await sql`
      SELECT COUNT(*) as count FROM call_logs 
      WHERE created_at >= date_trunc('month', CURRENT_DATE - interval '1 month')
      AND created_at < date_trunc('month', CURRENT_DATE)
    `
    const lastMonthCalls = Number(lastMonthResult[0]?.count || 0)
    const trend = lastMonthCalls > 0 
      ? Math.round(((callsThisMonth - lastMonthCalls) / lastMonthCalls) * 100) 
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
      uniqueCustomers,
      totalAppointments,
      appointmentsThisMonth,
      confirmedAppointments,
      cancelledAppointments,
      upcomingAppointments,
      recentCalls: recentCalls.map((call: any) => ({
        id: call.id,
        customerPhone: call.customer_phone?.length > 8
          ? `${call.customer_phone.slice(0, 4)}****${call.customer_phone.slice(-4)}`
          : call.customer_phone,
        duration: call.duration_seconds,
        status: call.status,
        summary: call.summary,
        endedReason: call.ended_reason,
        startedAt: call.created_at,
      })),
      recentAppointments: recentAppointments.map((apt: any) => ({
        id: apt.id,
        customerName: apt.customer_name,
        customerPhone: apt.customer_phone?.length > 8
          ? `${apt.customer_phone.slice(0, 4)}****${apt.customer_phone.slice(-4)}`
          : apt.customer_phone,
        date: apt.appointment_date,
        time: apt.appointment_time,
        service: apt.service,
        stylist: apt.stylist,
        status: apt.status,
        createdAt: apt.created_at,
      })),
      trend,
    })
  } catch (error) {
    console.error("[Analytics] Database error:", error)
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
      totalAppointments: 0,
      appointmentsThisMonth: 0,
      confirmedAppointments: 0,
      cancelledAppointments: 0,
      upcomingAppointments: 0,
      recentCalls: [],
      recentAppointments: [],
      trend: 0,
      error: "Failed to fetch analytics from database",
    })
  }
}
