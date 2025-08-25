"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { CartItem } from "./cart-item"
import { ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Cart } from "@/lib/cart-client"

interface CartPageClientProps {
  initialCart: Cart | null
}

export function CartPageClient({ initialCart }: CartPageClientProps) {
  const { cart, loading, clearCart } = useCart()

  // Use server cart as initial state, then client cart takes over
  const currentCart = cart || initialCart

  if (loading && !initialCart) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!currentCart || currentCart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-primary mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Discover our beautiful collection of authentic Assamese textiles</p>
        <Button asChild size="lg">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    )
  }

  const subtotal = currentCart.total
  const shipping = subtotal >= 2000 ? 0 : 99
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {currentCart.item_count} item{currentCart.item_count > 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cart Items</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
                Clear Cart
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {currentCart.items.map((item, index) => (
                  <div key={item.id} className="p-6">
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (GST 18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString()}</span>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add ₹{(2000 - subtotal).toLocaleString()} more for free shipping
                </p>
              )}

              <div className="space-y-3 pt-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/products">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
