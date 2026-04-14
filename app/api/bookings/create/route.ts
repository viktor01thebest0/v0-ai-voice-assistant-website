import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      call_id,
      customer_name,
      phone_number,
      service_type,
      appointment_date,
      appointment_time,
      stylist,
    } = body

    // Validate that we have at least some booking data
    if (!customer_name && !service_type && !appointment_date) {
      return NextResponse.json(
        { ok: false, error: "Missing required booking data" },
        { status: 400 }
      )
    }

    await sql`
      INSERT INTO bookings (call_id, customer_name, phone_number, service_type, appointment_date, appointment_time, stylist)
      VALUES (
        ${call_id || `web-${Date.now()}`},
        ${customer_name || null},
        ${phone_number || null},
        ${service_type || null},
        ${appointment_date || null},
        ${appointment_time || null},
        ${stylist || null}
      )
    `

    return NextResponse.json({ ok: true, message: "Booking created successfully" })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
