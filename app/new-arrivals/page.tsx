import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Star } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

async function getNewArrivals() {
  const supabase = await createClient()
  const { data: newArrivals } = await supabase
    .from("products")
    .select(
      `
      id,
      title,
      slug,
      price,
      product_media(storage_path, alt_text, is_primary)
    `
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(8)

  return newArrivals || []
}

export default async function NewArrivalsPage() {
  const newArrivals = await getNewArrivals()

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">New Arrivals</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our latest collection of premium products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => {
              const primaryImage = product.product_media?.find((media: any) => media.is_primary) || product.product_media?.[0]
              return (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={primaryImage?.storage_path || "/placeholder.svg"}
                      alt={primaryImage?.alt_text || product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">NEW</Badge>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
                      <Link href={`/products/${product.slug}`}>
                        <Button size="sm">View</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}