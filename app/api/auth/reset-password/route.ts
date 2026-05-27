import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Find valid token
    const tokens = await sql`
      SELECT prt.id, prt.user_id, prt.expires_at, prt.used_at, u.email
      FROM password_reset_tokens prt
      JOIN users u ON u.id = prt.user_id
      WHERE prt.token = ${token}
    `

    if (tokens.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      )
    }

    const resetToken = tokens[0]

    // Check if token was already used
    if (resetToken.used_at) {
      return NextResponse.json(
        { error: "This reset link has already been used" },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (new Date(resetToken.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "This reset link has expired" },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user's password
    await sql`
      UPDATE users SET password_hash = ${hashedPassword} WHERE id = ${resetToken.user_id}
    `

    // Mark token as used
    await sql`
      UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ${resetToken.id}
    `

    return NextResponse.json({ 
      ok: true, 
      message: "Password has been reset successfully" 
    })

  } catch (error) {
    console.error("[v0] Reset password error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}
