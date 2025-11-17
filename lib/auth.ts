"use client"

export interface User {
  id: string
  email: string
  name: string
}

const AUTH_STORAGE_KEY = "voxal_user"

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userJson = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!userJson) return null

  try {
    return JSON.parse(userJson)
  } catch {
    return null
  }
}
