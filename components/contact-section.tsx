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

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

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
          title: "Успех!",
          description: result.message,
        })
        // Reset form
        e.currentTarget.reset()
      } else {
        toast({
          title: "Грешка",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна грешка при изпращането на заявката",
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
            Попитай ни <span className="neon-text">нещо</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Разкажи ни за бизнеса си и ще ти създадем уникален AI глас
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur border-border">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Име и фамилия</Label>
                <Input id="name" name="name" placeholder="Иван Иванов" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="ivan@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+359 888 123 456" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Компания</Label>
                <Input id="company" name="company" placeholder="Моята компания" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Разкажете за вашия бизнес</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Опишете вашите нужди и как можем да ви помогнем..."
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
                  {isSubmitting ? "Изпраща се..." : "Изпрати заявка"}
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
                  <h3 className="text-lg font-bold mb-2">Email</h3>
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
                  <h3 className="text-lg font-bold mb-2">Телефон</h3>
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
                  <h3 className="text-lg font-bold mb-2">Офис</h3>
                  <p className="text-muted-foreground">бул. Витоша 1</p>
                  <p className="text-muted-foreground">София 1000, България</p>
                </div>
              </div>
            </Card>

            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
              <h3 className="font-bold mb-2">Работно време</h3>
              <p className="text-sm text-muted-foreground">Понеделник - Петък: 9:00 - 18:00</p>
              <p className="text-sm text-muted-foreground">AI асистентите работят 24/7 😉</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
