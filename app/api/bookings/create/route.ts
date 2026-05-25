import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    console.log("[v0] Booking create API received:", JSON.stringify(body, null, 2))


//     "name": "Customer Booking Info",
//     "result": {
//         "phone_number": "0877305864",
//         "service_type": "Подстригване",
//         "customer_name": "Виктор",
//         "appointment_date": "22 март",
//         "appointment_time": "10:00"
//     }
// }

    const {
      result: {
        phone_number,
        service_type,
        customer_name,
        appointment_date,
        appointment_time,
      },
      call_id,
      stylist,
      notes,
      created_via,
    } = body

    // Create the booking - allow any data to be saved
    const result = await sql`
      INSERT INTO bookings (call_id, customer_name, phone_number, service_type, appointment_date, appointment_time, stylist)
      VALUES (
        ${call_id || `web-${Date.now()}`},
        ${customer_name || notes || 'Voice Call'},
        ${phone_number || null},
        ${service_type || created_via || null},
        ${appointment_date || null},
        ${appointment_time || null},
        ${stylist || null}
      )
      RETURNING id
    `
    
    console.log("[v0] Booking created with id:", result[0]?.id)

    return NextResponse.json({ ok: true, message: "Booking created successfully", id: result[0]?.id })
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
