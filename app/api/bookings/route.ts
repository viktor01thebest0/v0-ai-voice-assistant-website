import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const totalBookings = await sql`SELECT COUNT(*) as count FROM bookings`
    
    const uniqueCustomers = await sql`SELECT COUNT(DISTINCT phone_number) as count FROM bookings WHERE phone_number IS NOT NULL`
    
    const todayBookings = await sql`
      SELECT COUNT(*) as count FROM bookings 
      WHERE appointment_date = TO_CHAR(NOW(), 'YYYY-MM-DD')
    `

    const thisMonthBookings = await sql`
      SELECT COUNT(*) as count FROM bookings 
      WHERE created_at >= DATE_TRUNC('month', NOW())
    `
    
    const recentBookings = await sql`
      SELECT id, call_id, customer_name, phone_number, service_type, appointment_date, appointment_time, created_at
      FROM bookings 
      ORDER BY created_at DESC 
      LIMIT 20
    `

    return NextResponse.json({
      totalBookings: Number(totalBookings[0]?.count || 0),
      uniqueCustomers: Number(uniqueCustomers[0]?.count || 0),
      todayBookings: Number(todayBookings[0]?.count || 0),
      thisMonthBookings: Number(thisMonthBookings[0]?.count || 0),
      recentBookings,
    })
  } catch (error) {
    console.error("Bookings API error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
