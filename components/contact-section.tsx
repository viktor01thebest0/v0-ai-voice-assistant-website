"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language"

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: t("contact.success"),
          description: result.message,
        })
        e.currentTarget.reset()
      } else {
        toast({
          title: t("contact.error"),
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("contact.error"),
        description: t("contact.errorMessage"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("contact.title")} <span className="neon-text">{t("contact.titleHighlight")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur border-border">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">{t("contact.name")}</Label>
                <Input id="name" name="name" placeholder={t("contact.namePlaceholder")} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("contact.email")}</Label>
                <Input id="email" name="email" type="email" placeholder={t("contact.emailPlaceholder")} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("contact.phone")}</Label>
                <Input id="phone" name="phone" type="tel" placeholder={t("contact.phonePlaceholder")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">{t("contact.company")}</Label>
                <Input id="company" name="company" placeholder={t("contact.companyPlaceholder")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t("contact.message")}</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder={t("contact.messagePlaceholder")}
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 animate-pulse-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("contact.submitting") : t("contact.submit")}
                </Button>
              </div>
            </form>
          </Card>

          <div className="space-y-8">
            <Card className="p-8 bg-card/50 backdrop-blur border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{t("contact.emailLabel")}</h3>
                  <p className="text-muted-foreground">contact@voiceai.bg</p>
                  <p className="text-muted-foreground">sales@voiceai.bg</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{t("contact.phoneLabel")}</h3>
                  <p className="text-muted-foreground">+359 2 123 4567</p>
                  <p className="text-muted-foreground">+359 888 123 456</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{t("contact.officeLabel")}</h3>
                  <p className="text-muted-foreground">бул. Витоша 1</p>
                  <p className="text-muted-foreground">София 1000, България</p>
                </div>
              </div>
            </Card>

            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
              <h3 className="font-bold mb-2">{t("contact.workingHours")}</h3>
              <p className="text-sm text-muted-foreground">{t("contact.workingHoursText")}</p>
              <p className="text-sm text-muted-foreground">{t("contact.aiWorkingHours")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
