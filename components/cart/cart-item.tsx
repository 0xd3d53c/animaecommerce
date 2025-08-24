"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { CartItem as CartItemType } from "@/lib/cart"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const primaryImage = item.product.product_media?.find((media) => media.is_primary) || item.product.product_media?.[0]

  return (
    <div className="flex gap-4 py-4">
      <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
        <div className="w-16 h-16 relative rounded-md overflow-hidden">
          <Image
            src={primaryImage?.storage_path || "/placeholder.svg"}
            alt={primaryImage?.alt_text || item.product.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.product.slug}`}
          className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
        >
          {item.product.title}
        </Link>

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-primary">₹{item.unit_price.toLocaleString()}</span>

          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>

              <span className="px-2 text-sm min-w-[2rem] text-center">{item.quantity}</span>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.product.stock_quantity}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-1">
          Subtotal: ₹{(item.unit_price * item.quantity).toLocaleString()}
        </div>
      </div>
    </div>
  )
}
