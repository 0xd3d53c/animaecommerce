import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  title: string
  slug: string
  price: number
  compare_at_price?: number
  badges?: string[]
  categories?: { name: string; slug: string }
  product_media?: Array<{
    storage_path: string
    alt_text: string
    is_primary: boolean
  }>
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const primaryImage = product.product_media?.find((media) => media.is_primary) || product.product_media?.[0]

        return (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <Card className="group hover:shadow-xl transition-all duration-300 border-primary/10">
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <Image
                  src={primaryImage?.storage_path || "/placeholder.svg?height=400&width=400"}
                  alt={primaryImage?.alt_text || product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {product.badges?.slice(0, 2).map((badge) => (
                    <Badge key={badge} variant="secondary" className="bg-white/90 text-primary text-xs">
                      {badge.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
                    {product.compare_at_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.compare_at_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {product.categories?.name}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
