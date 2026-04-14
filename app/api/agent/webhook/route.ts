import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    console.log("[VAPI Webhook] Received payload:", JSON.stringify(body, null, 2))

    // Handle VAPI end-of-call-report format
    if (body.message?.type === "end-of-call-report") {
      const data = body.message.analysis?.structuredData
      const callId = body.message.call?.id

      console.log("[VAPI Webhook] End of call report - structured data:", data)

      if (data) {
        await sql`
          INSERT INTO bookings (call_id, customer_name, phone_number, service_type, appointment_date, appointment_time, stylist)
          VALUES (
            ${callId || null},
            ${data.customer_name || null},
            ${data.phone_number || body.message.call?.customer?.number || null},
            ${data.service_type || null},
            ${data.appointment_date || null},
            ${data.appointment_time || null},
            ${data.stylist || null}
          )
        `
        console.log("[VAPI Webhook] Booking saved successfully")
        return NextResponse.json({ ok: true, message: "Booking saved" })
      }
      
      return NextResponse.json({ ok: true, message: "No structured data to save" })
    }
    
    // Handle direct booking format (for testing via Postman)
    // Accepts: { customer_name, phone_number, service_type, appointment_date, appointment_time, stylist }
    if (body.customer_name || body.service_type || body.appointment_date) {
      console.log("[VAPI Webhook] Direct booking format detected")
      
      await sql`
        INSERT INTO bookings (call_id, customer_name, phone_number, service_type, appointment_date, appointment_time, stylist)
        VALUES (
          ${body.call_id || `test-${Date.now()}`},
          ${body.customer_name || null},
          ${body.phone_number || null},
          ${body.service_type || null},
          ${body.appointment_date || null},
          ${body.appointment_time || null},
          ${body.stylist || null}
        )
      `
      console.log("[VAPI Webhook] Direct booking saved successfully")
      return NextResponse.json({ ok: true, message: "Direct booking saved" })
    }

    // Log unhandled message types
    console.log("[VAPI Webhook] Unhandled message type:", body.message?.type || "unknown")
    return NextResponse.json({ ok: true, message: "Webhook received but no action taken" })
    
  } catch (error) {
    console.error("[VAPI Webhook] Error:", error)
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 })
  }
}

// Add GET handler for health checks
export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    message: "VAPI webhook endpoint is active",
    timestamp: new Date().toISOString()
  })
}
