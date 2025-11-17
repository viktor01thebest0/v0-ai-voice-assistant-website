import { Navigation } from "@/components/navigation"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ServicesSection />
      <Footer />
    </main>
  )
}
