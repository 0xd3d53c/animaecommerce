"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Order {
  id: string
  total_amount: number // The property is total_amount
  status: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
}

export function OrderSuccessContent() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return
      };

      const supabase = createClient()
      const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

      if (!error && data) {
        setOrder(data)
      }
      setLoading(false)
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return <div className="text-center py-8">Loading order details...</div>
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find your order details.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your order. We'll send you a confirmation email shortly.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Order Number:</span>
              <p className="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Order Date:</span>
              <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Amount:</span>
              {/* CORRECTED: Changed order.total to order.total_amount */}
              <p className="font-medium">₹{order.total_amount.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <p className="font-medium capitalize">{order.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Order Processing</h3>
              <p className="text-sm text-muted-foreground">
                We're preparing your authentic Assamese textiles with care.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Shipping Updates</h3>
              <p className="text-sm text-muted-foreground">
                You'll receive tracking information once your order ships.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Contact us on WhatsApp at +91 8011255880 for any questions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">A confirmation email has been sent to {order.email}</p>
        <div className="flex gap-4 justify-center">
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link href={`/account/orders`}>
            <Button>Track Order</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}