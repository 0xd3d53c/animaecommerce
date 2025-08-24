import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Droplets, Wind, AlertTriangle, Heart } from "lucide-react"

export default function CareGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Care Guide</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Preserve the beauty and longevity of your authentic Assamese textiles with proper care
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* General Care Principles */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">General Care Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center border-primary/10">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Handle with Love</h3>
                  <p className="text-sm text-muted-foreground">
                    Each piece is handcrafted with care. Treat it gently to preserve its beauty for generations.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-primary/10">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Droplets className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Natural Materials</h3>
                  <p className="text-sm text-muted-foreground">
                    Our textiles use natural fibers and dyes that require special care to maintain their vibrancy.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-primary/10">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wind className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Proper Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    Store in a cool, dry place away from direct sunlight to prevent fading and damage.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Fabric-Specific Care */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">Fabric-Specific Care Instructions</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Silk Care */}
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-accent/20 text-accent">
                      Silk
                    </Badge>
                    Muga, Eri & Pat Silk
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">✓ Do</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Dry clean for best results</li>
                      <li>• Hand wash in cold water with mild detergent if needed</li>
                      <li>• Air dry in shade, never in direct sunlight</li>
                      <li>• Iron on low heat with a cloth barrier</li>
                      <li>• Store in breathable cotton bags</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">✗ Don't</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use bleach or harsh chemicals</li>
                      <li>• Wring or twist the fabric</li>
                      <li>• Expose to direct sunlight for long periods</li>
                      <li>• Store in plastic bags</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Cotton Care */}
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Cotton
                    </Badge>
                    Handloom Cotton
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">✓ Do</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Machine wash in cold water on gentle cycle</li>
                      <li>• Use mild, natural detergents</li>
                      <li>• Air dry or tumble dry on low heat</li>
                      <li>• Iron while slightly damp for best results</li>
                      <li>• Separate colors for first few washes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">✗ Don't</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use hot water (may cause shrinkage)</li>
                      <li>• Over-dry in high heat</li>
                      <li>• Use fabric softeners (affects natural texture)</li>
                      <li>• Iron directly on embroidered areas</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product-Specific Care */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-primary text-center">Product-Specific Care</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Mekhela Chador</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Always dry clean for silk varieties</li>
                      <li>• Store flat or carefully folded with tissue paper</li>
                      <li>• Avoid hanging for extended periods</li>
                      <li>• Keep zari work protected with soft cloth</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Gamusa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Hand wash in cold water to preserve borders</li>
                      <li>• Gentle squeeze, never wring</li>
                      <li>• Air dry flat to maintain shape</li>
                      <li>• Iron borders carefully to avoid damage</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Ethnic Wear</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Follow fabric-specific instructions above</li>
                      <li>• Pay special attention to embellishments</li>
                      <li>• Store on padded hangers when possible</li>
                      <li>• Protect from moths with natural repellents</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Buwa Magur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Dry clean recommended for intricate work</li>
                      <li>• Handle delicate motifs with extra care</li>
                      <li>• Store with acid-free tissue paper</li>
                      <li>• Avoid direct contact with jewelry</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator className="my-12" />

            {/* Storage Tips */}
            <Card className="border-primary/10 bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                  Long-term Storage Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Environment</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Cool, dry place (60-70°F, 45-55% humidity)</li>
                      <li>• Away from direct sunlight</li>
                      <li>• Good air circulation</li>
                      <li>• Avoid basements and attics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Protection</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use breathable cotton or muslin covers</li>
                      <li>• Add natural moth repellents (cedar, lavender)</li>
                      <li>• Check periodically for any issues</li>
                      <li>• Refold occasionally to prevent permanent creases</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Care */}
            <Card className="border-red-200 bg-red-50/50 mt-8">
              <CardHeader>
                <CardTitle className="text-red-700">Emergency Care & Stain Removal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-red-600 font-medium">
                    For valuable pieces, always consult a professional cleaner experienced with handloom textiles.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Immediate Actions</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Blot, don't rub stains</li>
                        <li>• Act quickly before stains set</li>
                        <li>• Test any treatment on hidden area first</li>
                        <li>• Use cold water for most stains</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">When to Seek Help</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Oil-based stains</li>
                        <li>• Set-in stains</li>
                        <li>• Damage to embellishments</li>
                        <li>• Any uncertainty about treatment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
