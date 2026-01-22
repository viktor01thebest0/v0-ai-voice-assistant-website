"use client"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "client" // Role can be either admin or client
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

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin"
}

export function isClient(user: User | null): boolean {
  return user?.role === "client"
}

export function getRoleDisplayName(role: "admin" | "client"): string {
  return role === "admin" ? "Администратор" : "Клиент"
}
