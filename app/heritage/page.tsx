import { HeritageHero } from "@/components/cultural/heritage-hero"
import { TextileTraditions } from "@/components/cultural/textile-traditions"
import { CulturalGlossary } from "@/components/cultural/cultural-glossary"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export default function HeritagePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <HeritageHero />
      <TextileTraditions />
      <CulturalGlossary />
      <SiteFooter />
    </div>
  )
}
