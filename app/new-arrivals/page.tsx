import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Star } from "lucide-react"
import Link from "next/link"

const newArrivals = [
  {
    id: "1",
    title: "Contemporary Silk Blouse",
    price: 2499,
    image: "/contemporary-silk-blouse.png",
    rating: 4.7,
    reviews: 23,
    isNew: true,
  },
  {
    id: "2",
    title: "Handwoven Cotton Saree",
    price: 3999,
    image: "/handwoven-cotton-saree.png",
    rating: 4.9,
    reviews: 45,
    isNew: true,
  },
  {
    id: "3",
    title: "Designer Palazzo Set",
    price: 1899,
    image: "/designer-palazzo-set.png",
    rating: 4.5,
    reviews: 12,
    isNew: true,
  },
  {
    id: "4",
    title: "Embroidered Dupatta",
    price: 899,
    image: "/embroidered-dupatta.png",
    rating: 4.8,
    reviews: 34,
    isNew: true,
  },
]

export default function NewArrivalsPage() {
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
            {newArrivals.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.isNew && (
                    <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">NEW</Badge>
                  )}
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
                    <Link href={`/products/${product.id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
