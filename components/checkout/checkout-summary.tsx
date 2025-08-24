"use client"

import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export function CheckoutSummary() {
  const { items, total } = useCart()

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
          {items.map((item) => (
            <div key={`${item.id}-${item.variant?.id || "default"}`} className="flex gap-3">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={item.image || "/placeholder.svg?height=64&width=64"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                {item.variant && (
                  <p className="text-xs text-muted-foreground">
                    {Object.entries(item.variant.attributes)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")}
                  </p>
                )}
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                  <span className="font-medium text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
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
