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
  categories?: { name: string; slug: string }
  product_media?: Array<{
    storage_path: string
    alt_text: string
    is_primary: boolean
  }>
}

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">You Might Also Like</h2>
        <p className="text-muted-foreground">Discover more products from our collection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const primaryImage = product.product_media?.find((media) => media.is_primary) || product.product_media?.[0]

          return (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 border-primary/10">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <Image
                    src={primaryImage?.storage_path || "/placeholder.svg?height=300&width=300"}
                    alt={primaryImage?.alt_text || product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 text-sm">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">₹{product.price.toLocaleString()}</span>
                      {product.compare_at_price && (
                        <span className="text-xs text-muted-foreground line-through">
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
    </section>
  )
}
