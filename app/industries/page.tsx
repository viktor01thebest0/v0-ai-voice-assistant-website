import { Navigation } from "@/components/navigation"
import { IndustriesSection } from "@/components/industries-section"
import { Footer } from "@/components/footer"

export default function IndustriesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <IndustriesSection />
      <Footer />
    </main>
  )
}
