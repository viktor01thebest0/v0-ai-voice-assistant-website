import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.message?.type === "end-of-call-report") {
      const data = body.message.analysis?.structuredData
      const callId = body.message.call?.id

      if (data) {
       await sql`
        INSERT INTO bookings (call_id, customer_name, phone_number, service_type, appointment_date, appointment_time, stylist)
        VALUES (
          ${callId || null},
          ${data.customer_name || null},
          ${data.phone_number || null},
          ${data.service_type || null},
          ${data.appointment_date || null},
          ${data.appointment_time || null},
          ${data.stylist || null}
        )
      `
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 })
  }
}
