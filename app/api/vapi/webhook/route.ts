import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Vapi webhook endpoint for receiving call data and appointment bookings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the webhook payload for debugging
    console.log("[Vapi Webhook] Received:", JSON.stringify(body, null, 2))
    
    // Handle different Vapi webhook event types
    const { message } = body
    
    if (!message) {
      return NextResponse.json({ error: "No message in payload" }, { status: 400 })
    }
    
    const messageType = message.type
    
    switch (messageType) {
      case "end-of-call-report":
        // Call has ended - extract appointment data from the conversation
        await handleEndOfCall(message)
        break
        
      case "function-call":
        // Vapi is calling a function - handle appointment booking
        const result = await handleFunctionCall(message)
        return NextResponse.json(result)
        
      case "assistant-request":
        // Assistant configuration request
        return NextResponse.json({ 
          assistant: { 
            firstMessage: "Здравейте! Добре дошли във Voxal. Как мога да ви помогна днес?" 
          } 
        })
        
      case "status-update":
        // Call status update (ringing, in-progress, etc.)
        console.log("[Vapi Webhook] Status update:", message.status)
        break
        
      case "transcript":
        // Real-time transcript update
        console.log("[Vapi Webhook] Transcript:", message.transcript)
        break
        
      case "hang":
        // Call was hung up
        console.log("[Vapi Webhook] Call hung up")
        break
        
      default:
        console.log("[Vapi Webhook] Unknown message type:", messageType)
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error("[Vapi Webhook] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Handle function calls from Vapi (e.g., book_appointment, check_availability)
async function handleFunctionCall(message: any) {
  const functionCall = message.functionCall
  
  if (!functionCall) {
    return { error: "No function call data" }
  }
  
  const { name, parameters } = functionCall
  
  switch (name) {
    case "book_appointment":
      return await bookAppointment(parameters)
      
    case "check_availability":
      return await checkAvailability(parameters)
      
    case "cancel_appointment":
      return await cancelAppointment(parameters)
      
    case "get_services":
      return getServices()
      
    case "get_stylists":
      return getStylists()
      
    default:
      return { error: `Unknown function: ${name}` }
  }
}

// Book an appointment
async function bookAppointment(params: {
  customer_name: string
  customer_phone: string
  appointment_date: string
  appointment_time: string
  service: string
  stylist: string
}) {
  try {
    const { customer_name, customer_phone, appointment_date, appointment_time, service, stylist } = params
    
    // Check if slot is available
    const existing = await sql`
      SELECT id FROM appointments 
      WHERE appointment_date = ${appointment_date} 
      AND appointment_time = ${appointment_time}
      AND stylist = ${stylist}
      AND status != 'cancelled'
    `
    
    if (existing.length > 0) {
      return {
        success: false,
        message: `За съжаление, ${stylist} е зает/а в ${appointment_time} на ${appointment_date}. Моля, изберете друг час.`
      }
    }
    
    // Book the appointment
    const result = await sql`
      INSERT INTO appointments (
        customer_name,
        customer_phone,
        appointment_date,
        appointment_time,
        service,
        stylist,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${customer_name},
        ${customer_phone},
        ${appointment_date},
        ${appointment_time},
        ${service},
        ${stylist},
        'confirmed',
        NOW(),
        NOW()
      )
      RETURNING id
    `
    
    return {
      success: true,
      message: `Готово! Записахме ви час при ${stylist} на ${appointment_date} в ${appointment_time} за ${service}. Очакваме ви!`,
      appointment_id: result[0].id
    }
    
  } catch (error) {
    console.error("[Vapi Webhook] Book appointment error:", error)
    return {
      success: false,
      message: "Възникна грешка при записването. Моля, опитайте отново."
    }
  }
}

// Check availability for a specific date/time
async function checkAvailability(params: {
  appointment_date: string
  appointment_time?: string
  stylist?: string
}) {
  try {
    const { appointment_date, appointment_time, stylist } = params
    
    let query
    if (appointment_time && stylist) {
      query = await sql`
        SELECT id FROM appointments 
        WHERE appointment_date = ${appointment_date} 
        AND appointment_time = ${appointment_time}
        AND stylist = ${stylist}
        AND status != 'cancelled'
      `
    } else if (stylist) {
      query = await sql`
        SELECT appointment_time FROM appointments 
        WHERE appointment_date = ${appointment_date} 
        AND stylist = ${stylist}
        AND status != 'cancelled'
      `
    } else {
      query = await sql`
        SELECT appointment_time, stylist FROM appointments 
        WHERE appointment_date = ${appointment_date}
        AND status != 'cancelled'
      `
    }
    
    if (appointment_time && stylist) {
      const isAvailable = query.length === 0
      return {
        available: isAvailable,
        message: isAvailable 
          ? `Да, ${stylist} е свободен/на в ${appointment_time} на ${appointment_date}.`
          : `За съжаление, ${stylist} е зает/а в ${appointment_time}. Искате ли да проверя друг час?`
      }
    }
    
    const bookedSlots = query.map((row: any) => ({
      time: row.appointment_time,
      stylist: row.stylist
    }))
    
    return {
      booked_slots: bookedSlots,
      message: bookedSlots.length > 0 
        ? `На ${appointment_date} има ${bookedSlots.length} записани часа.`
        : `На ${appointment_date} все още няма записани часове.`
    }
    
  } catch (error) {
    console.error("[Vapi Webhook] Check availability error:", error)
    return {
      error: true,
      message: "Възникна грешка при проверката. Моля, опитайте отново."
    }
  }
}

// Cancel an appointment
async function cancelAppointment(params: {
  customer_phone: string
  appointment_date?: string
}) {
  try {
    const { customer_phone, appointment_date } = params
    
    let query
    if (appointment_date) {
      query = await sql`
        UPDATE appointments 
        SET status = 'cancelled', updated_at = NOW()
        WHERE customer_phone = ${customer_phone}
        AND appointment_date = ${appointment_date}
        AND status != 'cancelled'
        RETURNING id, appointment_date, appointment_time, stylist
      `
    } else {
      // Cancel the next upcoming appointment
      query = await sql`
        UPDATE appointments 
        SET status = 'cancelled', updated_at = NOW()
        WHERE customer_phone = ${customer_phone}
        AND appointment_date >= CURRENT_DATE
        AND status != 'cancelled'
        ORDER BY appointment_date, appointment_time
        LIMIT 1
        RETURNING id, appointment_date, appointment_time, stylist
      `
    }
    
    if (query.length === 0) {
      return {
        success: false,
        message: "Не намерих активен час за този телефонен номер."
      }
    }
    
    const cancelled = query[0]
    return {
      success: true,
      message: `Часът ви при ${cancelled.stylist} на ${cancelled.appointment_date} в ${cancelled.appointment_time} е отменен.`
    }
    
  } catch (error) {
    console.error("[Vapi Webhook] Cancel appointment error:", error)
    return {
      success: false,
      message: "Възникна грешка при отмяната. Моля, опитайте отново."
    }
  }
}

// Get available services
function getServices() {
  return {
    services: [
      { name: "Подстригване", duration: "30 мин", price: "25 лв" },
      { name: "Боядисване", duration: "90 мин", price: "60 лв" },
      { name: "Прическа", duration: "45 мин", price: "35 лв" },
      { name: "Терапия за коса", duration: "60 мин", price: "45 лв" },
      { name: "Мъжко подстригване", duration: "20 мин", price: "15 лв" },
      { name: "Детско подстригване", duration: "20 мин", price: "12 лв" }
    ],
    message: "Предлагаме следните услуги: подстригване, боядисване, прическа, терапия за коса, мъжко и детско подстригване."
  }
}

// Get available stylists
function getStylists() {
  return {
    stylists: [
      { name: "Мария", specialties: ["Боядисване", "Прически"] },
      { name: "Иван", specialties: ["Мъжко подстригване", "Подстригване"] },
      { name: "Елена", specialties: ["Терапии", "Боядисване"] },
      { name: "Георги", specialties: ["Подстригване", "Прически"] }
    ],
    message: "Нашите стилисти са: Мария, Иван, Елена и Георги."
  }
}

// Handle end of call report - extract and save any appointment data
async function handleEndOfCall(message: any) {
  try {
    const { call, transcript, summary, recordingUrl } = message
    
    console.log("[Vapi Webhook] Call ended:", {
      callId: call?.id,
      duration: call?.duration,
      summary,
      recordingUrl
    })
    
    // You can add additional logic here to:
    // - Save call logs to the database
    // - Send follow-up SMS/email
    // - Analyze sentiment from the transcript
    
  } catch (error) {
    console.error("[Vapi Webhook] End of call error:", error)
  }
}

// GET endpoint for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: "Vapi webhook is active",
    endpoints: {
      book_appointment: "Book a new appointment",
      check_availability: "Check if a time slot is available",
      cancel_appointment: "Cancel an existing appointment",
      get_services: "Get list of available services",
      get_stylists: "Get list of available stylists"
    }
  })
}
