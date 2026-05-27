import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { Resend } from "resend"
import crypto from "crypto"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Find user by email
    const users = await sql`
      SELECT id, name, email FROM users WHERE email = ${email.toLowerCase()}
    `

    if (users.length === 0) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({ 
        ok: true, 
        message: "If this email exists, a password reset link has been sent." 
      })
    }

    const user = users[0]

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex")
    
    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // Delete any existing tokens for this user
    await sql`
      DELETE FROM password_reset_tokens WHERE user_id = ${user.id}
    `

    // Create new reset token
    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt})
    `

    // Build reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000"
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    // Send email
    console.log("[v0] Sending password reset email to:", email)
    console.log("[v0] Reset URL:", resetUrl)
    console.log("[v0] RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY)
    
    const emailResult = await resend.emails.send({
      from: "VOXAL <onboarding@resend.dev>",
      to: email,
      subject: "Reset Your Password - VOXAL",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Reset Your Password</h1>
          <p>Hello ${user.name},</p>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    })

    console.log("[v0] Email send result:", JSON.stringify(emailResult, null, 2))

    if (emailResult.error) {
      console.error("[v0] Resend error:", emailResult.error)
      // Return detailed error for debugging
      return NextResponse.json(
        { 
          error: `Failed to send email: ${emailResult.error.message || 'Unknown error'}. Note: On Resend free tier, you can only send to your verified email address.`,
          resetUrl: resetUrl // Include reset URL for testing purposes
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      ok: true, 
      message: "If this email exists, a password reset link has been sent." 
    })

  } catch (error) {
    console.error("[v0] Forgot password error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}
