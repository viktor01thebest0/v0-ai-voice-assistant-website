import { neon } from "@neondatabase/serverless"

// Create a reusable database client
export const sql = neon(process.env.NEON_DATABASE_URL!)

// Helper function to hash passwords (simple implementation)
export async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt or argon2. For now, we'll use a simple hash
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Helper function to verify passwords
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}
