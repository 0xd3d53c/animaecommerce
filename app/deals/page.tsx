import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Star } from "lucide-react"
import Link from "next/link"

const deals = [
  {
    id: "1",
    title: "Premium Silk Saree",
    originalPrice: 8999,
    salePrice: 5999,
    discount: 33,
    image: "/silk-saree-deal.png",
    rating: 4.8,
    reviews: 124,
    timeLeft: "2 days left",
  },
  {
    id: "2",
    title: "Designer Kurta Set",
    originalPrice: 3499,
    salePrice: 2099,
    discount: 40,
    image: "/designer-kurta-deal.png",
    rating: 4.6,
    reviews: 89,
    timeLeft: "5 hours left",
  },
  {
    id: "3",
    title: "Traditional Jewelry Set",
    originalPrice: 2999,
    salePrice: 1799,
    discount: 40,
    image: "/jewelry-set-deal.png",
    rating: 4.9,
    reviews: 156,
    timeLeft: "1 day left",
  },
]

export default function DealsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Special Deals</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Limited time offers on our best products. Don't miss out!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <Card key={deal.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={deal.image || "/placeholder.svg"}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">{deal.discount}% OFF</Badge>
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {deal.timeLeft}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{deal.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{deal.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({deal.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary">₹{deal.salePrice.toLocaleString()}</span>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{deal.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <Link href={`/products/${deal.id}`}>
                    <Button className="w-full">View Deal</Button>
                  </Link>
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
