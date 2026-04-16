"use client"

import { useState, useEffect, useCallback } from "react"
import Vapi from "@vapi-ai/web"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Phone, PhoneOff, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language"

type CallStatus = "idle" | "connecting" | "active" | "ending"

interface VapiMessage {
  type: string
  transcriptType?: string
  transcript?: string
  role?: string
  call?: {
    id?: string
  }
  analysis?: {
    structuredData?: {
      customer_name?: string
      phone_number?: string
      service_type?: string
      appointment_date?: string
      appointment_time?: string
      stylist?: string
    }
  }
}

export function VapiVoiceAssistant() {
  const { t } = useLanguage()
  const [vapi, setVapi] = useState<Vapi | null>(null)
  const [callStatus, setCallStatus] = useState<CallStatus>("idle")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [transcript, setTranscript] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
    if (!publicKey) {
      console.error("VAPI public key not configured")
      return
    }

    const vapiInstance = new Vapi(publicKey)
    setVapi(vapiInstance)

    // Event listeners
    vapiInstance.on("call-start", () => {
      setCallStatus("active")
      setError(null)
    })

    vapiInstance.on("call-end", () => {
      console.log("[v0] Call ended")
      setCallStatus("idle")
      // Note: Booking is saved via end-of-call-report message handler
      // which contains the structured data from VAPI's analysis
    })

    vapiInstance.on("error", (err: Error) => {
      console.error("VAPI error:", err)
      setError(err.message || "An error occurred")
      setCallStatus("idle")
    })

    vapiInstance.on("message", async (message: VapiMessage) => {
      // Debug: Log all messages
      console.log("[v0] VAPI message received:", JSON.stringify(message, null, 2))

      // Handle transcript updates
      if (message.type === "transcript" && message.transcriptType === "final" && message.transcript) {
        const role = message.role === "assistant" ? "AI" : "You"
        setTranscript((prev) => [...prev, `${role}: ${message.transcript}`])
      }

      // Handle end of call report with structured data
      if (message.type === "end-of-call-report") {
        console.log("[v0] End of call report received - full message:", JSON.stringify(message, null, 2))
        const structuredData = message.analysis?.structuredData
        const callId = message.call?.id

        console.log("[v0] Structured data:", JSON.stringify(structuredData, null, 2))
        console.log("[v0] Call ID:", callId)

        // Always save the booking, even if structured data is incomplete
        console.log("[v0] Attempting to save booking...")
        try {
          const response = await fetch("/api/bookings/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              call_id: callId || `call-${Date.now()}`,
              customer_name: structuredData?.customer_name || null,
              phone_number: structuredData?.phone_number || null,
              service_type: structuredData?.service_type || null,
              appointment_date: structuredData?.appointment_date || null,
              appointment_time: structuredData?.appointment_time || null,
              stylist: structuredData?.stylist || null,
            }),
          })

          const result = await response.json()
          console.log("[v0] Booking API response:", result)

          if (!response.ok) {
            console.error("[v0] Failed to save booking:", result)
          } else {
            console.log("[v0] Booking saved successfully!")
          }
        } catch (err) {
          console.error("[v0] Error saving booking:", err)
        }
      }
    })

    return () => {
      vapiInstance.stop()
    }
  }, [])

  const startCall = useCallback(async () => {
    if (!vapi) return

    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID
    if (!assistantId) {
      setError("VAPI assistant not configured")
      return
    }

    setCallStatus("connecting")
    setTranscript([])
    setError(null)

    try {
      await vapi.start(assistantId)
    } catch (err) {
      console.error("Failed to start call:", err)
      setError(err instanceof Error ? err.message : "Failed to start call")
      setCallStatus("idle")
    }
  }, [vapi])

  const endCall = useCallback(() => {
    if (!vapi) return
    setCallStatus("ending")
    vapi.stop()
  }, [vapi])

  const handleOpenChange = (open: boolean) => {
    if (!open && callStatus === "active") {
      endCall()
    }
    setIsDialogOpen(open)
    if (!open) {
      setTranscript([])
      setError(null)
    }
  }

  const getStatusText = () => {
    switch (callStatus) {
      case "connecting":
        return t("vapiConnecting")
      case "active":
        return t("vapiActive")
      case "ending":
        return t("vapiEnding")
      default:
        return t("vapiIdle")
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <Mic className="h-4 w-4" />
        <span className="hidden sm:inline">{t("testAi")}</span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("vapiTitle")}</DialogTitle>
            <DialogDescription>{t("vapiDescription")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-6">
            {/* Status indicator */}
            <div className="text-sm text-muted-foreground">{getStatusText()}</div>

            {/* Main call button */}
            <button
              onClick={callStatus === "idle" ? startCall : endCall}
              disabled={callStatus === "connecting" || callStatus === "ending"}
              className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 ${callStatus === "active"
                  ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                  : callStatus === "connecting" || callStatus === "ending"
                    ? "bg-muted cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                }`}
            >
              {callStatus === "connecting" || callStatus === "ending" ? (
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              ) : callStatus === "active" ? (
                <PhoneOff className="h-10 w-10 text-white" />
              ) : (
                <Phone className="h-10 w-10 text-white" />
              )}
            </button>

            {/* Error message */}
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Live transcript */}
            {transcript.length > 0 && (
              <div className="w-full max-h-48 overflow-y-auto rounded-md border bg-muted/50 p-3">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {t("vapiTranscript")}
                </div>
                <div className="space-y-1 text-sm">
                  {transcript.map((line, index) => (
                    <p key={index} className={line.startsWith("AI:") ? "text-primary" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <p className="text-xs text-center text-muted-foreground max-w-xs">
              {t("vapiInstructions")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
