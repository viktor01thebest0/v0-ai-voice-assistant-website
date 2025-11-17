import { Navigation } from "@/components/navigation"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <PricingSection />
      <Footer />
    </main>
  )
}
