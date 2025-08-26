"use client"

import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export function CheckoutSummary() {
  const { cart, loading } = useCart()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading summary...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
        </CardContent>
      </Card>
    )
  }

  const { items, total } = cart

  const shippingCost = 50
  const platformFee = Math.round(total * 0.02) // 2% platform fee
  const finalTotal = total + shippingCost + platformFee

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3">
          {items.map((item) => {
            const primaryImage = item.product.product_media?.find((media) => media.is_primary) || item.product.product_media?.[0];
            return (
              <div key={`${item.id}-${item.variant_id || "default"}`} className="flex gap-3">
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                  <Image
                    src={primaryImage?.storage_path || "/placeholder.svg?height=64&width=64"}
                    alt={primaryImage?.alt_text || item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.product.title}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                    <span className="font-medium text-sm">₹{(item.unit_price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <Separator />

        {/* Order Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>₹{shippingCost}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Platform Fee</span>
            <span>₹{platformFee.toLocaleString()}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{finalTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
            </div>
            <span>Secure payment processing</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
            </div>
            <span>Quality products guaranteed</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
            </div>
            <span>Fast and reliable shipping</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}