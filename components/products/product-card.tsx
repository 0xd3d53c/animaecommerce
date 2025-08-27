"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface Product {
  id: string
  title: string
  slug: string
  price: number
  product_media?: Array<{
    storage_path: string
    alt_text: string
    is_primary: boolean
  }>
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, buyNow } = useCart()
  const primaryImage = product.product_media?.find((media) => media.is_primary) || product.product_media?.[0]

  return (
    <div className="flex h-full w-full max-w-sm flex-col rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square p-4">
          <Image
            className="h-full w-full object-contain"
            src={primaryImage?.storage_path || "/placeholder.svg"}
            alt={primaryImage?.alt_text || product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-between p-5 pt-0">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h5 className="h-20 text-lg font-extralight tracking-tight text-gray-900 line-clamp-2 dark:text-white sm:text-xl">{product.title}</h5>
          </Link>
          <div className="mt-2.5 mb-4 flex items-center justify-between">
            <span className="text-3xl font-medium text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => addToCart(product.id)}
              size="sm"
              className="flex-1"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              onClick={() => buyNow(product.id)}
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
            >
              Buy Now
            </Button>
          </div>
      </div>
    </div>
  )
}