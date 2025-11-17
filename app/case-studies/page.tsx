import { Navigation } from "@/components/navigation"
import { CaseStudiesSection } from "@/components/case-studies-section"
import { Footer } from "@/components/footer"

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <CaseStudiesSection />
      <Footer />
    </main>
  )
}
