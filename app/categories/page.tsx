import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const categories = [
  {
    name: "Sarees",
    description: "Traditional and contemporary sarees",
    image: "/elegant-saree-collection.png",
    count: 45,
  },
  {
    name: "Kurtas",
    description: "Comfortable and stylish kurtas",
    image: "/modern-kurta-designs.png",
    count: 32,
  },
  {
    name: "Accessories",
    description: "Traditional jewelry and accessories",
    image: "/traditional-accessories.png",
    count: 28,
  },
  {
    name: "Home Decor",
    description: "Beautiful home decoration items",
    image: "/home-decor-items.png",
    count: 19,
  },
]

export default function CategoriesPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Shop by Category</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of products across different categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={`/products?category=${category.name.toLowerCase()}`}>
                <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <Badge variant="secondary">{category.count} items</Badge>
                    </div>
                    <p className="text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
