import { Navigation } from "@/components/navigation"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ContactSection />
      <Footer />
    </main>
  )
}
