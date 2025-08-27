"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

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
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <Link href={`/products/${product.slug}`}>
        <Image
          className="p-8 rounded-t-lg"
          src={primaryImage?.storage_path || "/placeholder.svg"}
          alt={primaryImage?.alt_text || product.title}
          width={500}
          height={500}
        />
      </Link>
      <div className="px-5 pb-5">
        <Link href={`/products/${product.slug}`}>
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{product.title}</h5>
        </Link>
        <div className="flex items-center justify-between mt-4">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => addToCart(product.id)}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add to Cart
            </button>
            <button
              onClick={() => buyNow(product.id)}
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}