import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    console.log("[v0] VAPI Webhook received:", JSON.stringify(body, null, 2))

    // Handle VAPI end-of-call-report format
    if (body.message?.type === "end-of-call-report") {
      const structuredData = body.message.analysis?.structuredData
      const callId = body.message.call?.id

      console.log("[v0] End of call report - structured data:", JSON.stringify(structuredData, null, 2))

      if (structuredData) {
        const result = await sql`
          INSERT INTO bookings (call_id, customer_name, phone_number, service_type, appointment_date, appointment_time, stylist)
          VALUES (
            ${callId || `vapi-${Date.now()}`},
            ${structuredData.customer_name || null},
            ${structuredData.phone_number || body.message.call?.customer?.number || null},
            ${structuredData.service_type || null},
            ${structuredData.appointment_date || null},
            ${structuredData.appointment_time || null},
            ${structuredData.stylist || null}
          )
          RETURNING id
        `
        console.log("[v0] Booking saved with id:", result[0]?.id)
        return NextResponse.json({ ok: true, message: "Booking saved", id: result[0]?.id })
      }
      
      return NextResponse.json({ ok: true, message: "No structured data to save" })
    }

    // Handle tool-call format (VAPI calling a function/tool)
    if (body.message?.type === "tool-calls" || body.message?.toolCalls) {
      const toolCalls = body.message?.toolCalls || body.message?.tool_calls || []
      
      for (const toolCall of toolCalls) {
        if (toolCall.function?.name === "saveBooking" || toolCall.function?.name === "save_booking") {
          const args = typeof toolCall.function.arguments === "string" 
            ? JSON.parse(toolCall.function.arguments) 
            : toolCall.function.arguments

          console.log("[v0] Tool call saveBooking with args:", JSON.stringify(args, null, 2))

          const result = await sql`
            INSERT INTO bookings (call_id, customer_name, phone_number, service_type, appointment_date, appointment_time, stylist)
            VALUES (
              ${body.message?.call?.id || `tool-${Date.now()}`},
              ${args.customer_name || null},
              ${args.phone_number || null},
              ${args.service_type || null},
              ${args.appointment_date || null},
              ${args.appointment_time || null},
              ${args.stylist || null}
            )
            RETURNING id
          `
          console.log("[v0] Booking saved via tool call with id:", result[0]?.id)
          
          return NextResponse.json({
            results: [{
              toolCallId: toolCall.id,
              result: { success: true, bookingId: result[0]?.id }
            }]
          })
        }
      }
    }

    // Handle direct booking format (for testing or alternative formats)
    if (body.customer_name || body.result?.customer_name) {
      const data = body.result || body
      console.log("[v0] Direct booking format detected:", JSON.stringify(data, null, 2))
      
      const result = await sql`
        INSERT INTO bookings (call_id, customer_name, phone_number, service_type, appointment_date, appointment_time, stylist)
        VALUES (
          ${body.call_id || `direct-${Date.now()}`},
          ${data.customer_name || null},
          ${data.phone_number || null},
          ${data.service_type || null},
          ${data.appointment_date || null},
          ${data.appointment_time || null},
          ${data.stylist || null}
        )
        RETURNING id
      `
      console.log("[v0] Direct booking saved with id:", result[0]?.id)
      return NextResponse.json({ ok: true, message: "Booking saved", id: result[0]?.id })
    }

    // Log unhandled message types for debugging
    console.log("[v0] Unhandled message type:", body.message?.type || "unknown")
    return NextResponse.json({ ok: true, message: "Webhook received" })
    
  } catch (error) {
    console.error("[v0] VAPI Webhook error:", error)
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 })
  }
}

// GET handler for health checks
export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    message: "VAPI webhook endpoint is active",
    timestamp: new Date().toISOString()
  })
}
