"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAuthSuccess: (user: User) => void
}

export function AuthDialog({ open, onOpenChange, onAuthSuccess }: AuthDialogProps) {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Невалиден имейл или парола")
        setLoading(false)
        return
      }

      // Save user to localStorage
      localStorage.setItem("voxal_user", JSON.stringify(data.user))

      onAuthSuccess(data.user)
      onOpenChange(false)
      setLoginEmail("")
      setLoginPassword("")
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("Възникна грешка. Моля, опитайте отново.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!signupName || !signupEmail || !signupPassword) {
        setError("Моля, попълнете всички полета")
        setLoading(false)
        return
      }

      if (signupPassword.length < 6) {
        setError("Паролата трябва да е поне 6 символа")
        setLoading(false)
        return
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, password: signupPassword, name: signupName }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Възникна грешка при регистрация")
        setLoading(false)
        return
      }

      // Save user to localStorage
      localStorage.setItem("voxal_user", JSON.stringify(data.user))

      onAuthSuccess(data.user)
      onOpenChange(false)
      setSignupName("")
      setSignupEmail("")
      setSignupPassword("")
    } catch (err) {
      console.error("[v0] Signup error:", err)
      setError("Възникна грешка. Моля, опитайте отново.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Влезте в VOXAL</DialogTitle>
          <DialogDescription>Влезте или създайте акаунт, за да достъпите всичките наши услуги</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="signup">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Имейл</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="вашият@имейл.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Парола</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Зареждане..." : "Влез"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Име</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Вашето име"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Имейл</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="вашият@имейл.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Парола</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Зареждане..." : "Създай акаунт"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
