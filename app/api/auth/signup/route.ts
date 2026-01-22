import { type NextRequest, NextResponse } from "next/server"
import { sql, hashPassword } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Всички полета са задължителни" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Потребител с този имейл вече съществува" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    const result = await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email}, ${passwordHash}, ${name}, 'client')
      RETURNING id, email, name, role, created_at
    `

    const user = result[0]

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // Return role in response
      },
    })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Грешка при регистрация" }, { status: 500 })
  }
}
