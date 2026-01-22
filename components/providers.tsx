"use client"

import React from "react"

import { ThemeProvider } from "@/lib/theme"
import { LanguageProvider } from "@/lib/language"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  )
}
