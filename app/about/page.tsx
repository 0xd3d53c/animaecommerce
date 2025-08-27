import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, Users, Leaf, Award } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

// Function to fetch dynamic stats for the impact section
async function getImpactStats() {
  const supabase = await createClient();

  // Fetch the total count of active artisans
  const { count: artisanCount, error: artisanError } = await supabase
    .from("artisans")
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (artisanError) {
    console.error("Error fetching artisan count:", artisanError);
  }
  
  // Note: For "Villages Reached" and "Above Market Pay", these would ideally
  // come from your database. For now, we'll use realistic static values
  // until your schema supports them.
  const villagesReached = 5; // Placeholder, can be made dynamic later
  const aboveMarketPay = 60; // Placeholder

  return {
    artisanCount: artisanCount || 0,
    villagesReached,
    aboveMarketPay,
  };
}


export default async function AboutPage() {
  const { artisanCount, villagesReached, aboveMarketPay } = await getImpactStats();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Our Story</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Weaving a future for Assamese textile heritage through ethical trade and artisan empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Our Mission: The Ethic Store</h2>
              <p className="text-muted-foreground mb-6">
                Anima – The Ethic Store was born from a deep love for Assamese culture and a commitment to preserving its timeless textile arts. We believe that every handwoven piece tells a story of heritage, skill, and cultural identity that deserves to be celebrated and sustained for generations to come.
              </p>
              <p className="text-muted-foreground mb-8">
                Our mission is to create a transparent and sustainable ecosystem where traditional artisans receive fair compensation for their extraordinary skills, while customers worldwide can access authentic, ethically-sourced Assamese textiles.
              </p>
              <Button asChild>
                <Link href="/heritage">
                  Explore Assamese Heritage <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/assamese-weaver.png"
                alt="Traditional Assamese weaving"
                width={600}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every decision we make is guided by these core principles that define who we are and what we stand for.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-primary/10">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">Cultural Preservation</h3>
                <p className="text-sm text-muted-foreground">
                  Safeguarding traditional weaving techniques and cultural knowledge for future generations.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-primary/10">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">Artisan Empowerment</h3>
                <p className="text-sm text-muted-foreground">
                  Providing fair wages, a global platform, and sustainable livelihoods to our skilled craftspeople.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-primary/10">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">Sustainability</h3>
                <p className="text-sm text-muted-foreground">
                  Championing the use of natural materials like Muga, Eri, and Pat silk, and eco-friendly processes.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-primary/10">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">Authenticity</h3>
                <p className="text-sm text-muted-foreground">
                  Ensuring every piece is genuinely handcrafted using traditional handloom methods.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Together with our customers, we're making a meaningful difference in artisan communities across Assam.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{artisanCount}+</div>
              <div className="text-muted-foreground">Artisans Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{villagesReached}+</div>
              <div className="text-muted-foreground">Villages Reached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{aboveMarketPay}%</div>
              <div className="text-muted-foreground">Above Market Pay</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Every purchase you make helps preserve traditional crafts and supports artisan families. Discover authentic
            Assamese textiles with a story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/products">Shop Collection</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="/heritage">Meet Our Artisans</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}