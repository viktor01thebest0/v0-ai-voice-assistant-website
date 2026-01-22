import { type NextRequest, NextResponse } from "next/server"
import { sql, verifyPassword } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Имейл и парола са задължителни" }, { status: 400 })
    }

    const result = await sql`
      SELECT id, email, name, password_hash, role FROM users WHERE email = ${email}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Невалиден имейл или парола" }, { status: 401 })
    }

    const user = result[0]

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: "Невалиден имейл или парола" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // Include role in login response
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Грешка при вход" }, { status: 500 })
  }
}
