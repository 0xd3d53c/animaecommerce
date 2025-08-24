"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { OrderTrackingModal } from "./order-tracking-modal"
import { useState } from "react"

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  payment_status: string
  tracking_number: string | null
  created_at: string
  shipped_at: string | null
  delivered_at: string | null
  order_items: Array<{
    id: string
    quantity: number
    unit_price: number
    total_price: number
    products: {
      title: string
      slug: string
      product_media: Array<{
        storage_path: string
        alt_text: string
        is_primary: boolean
      }>
    }
  }>
}

interface OrdersListProps {
  orders: Order[]
}

export function OrdersList({ orders }: OrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [trackingModalOpen, setTrackingModalOpen] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
      case "paid":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      paid: { variant: "default" as const, label: "Paid" },
      processing: { variant: "default" as const, label: "Processing" },
      shipped: { variant: "default" as const, label: "Shipped" },
      delivered: { variant: "default" as const, label: "Delivered" },
      cancelled: { variant: "destructive" as const, label: "Cancelled" },
      refunded: { variant: "outline" as const, label: "Refunded" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "secondary" as const,
      label: status,
    }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order)
    setTrackingModalOpen(true)
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order {order.order_number}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">₹{order.total_amount.toLocaleString()}</p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {order.order_items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 relative rounded-md overflow-hidden bg-muted">
                      <Image
                        src={
                          item.products.product_media.find((m) => m.is_primary)?.storage_path ||
                          "/placeholder.svg?height=48&width=48" ||
                          "/placeholder.svg"
                        }
                        alt={item.products.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.products.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × ₹{item.unit_price.toLocaleString()}
                      </p>
                    </div>
                    <p className="font-medium text-sm">₹{item.total_price.toLocaleString()}</p>
                  </div>
                ))}
                {order.order_items.length > 3 && (
                  <p className="text-sm text-muted-foreground">+{order.order_items.length - 3} more items</p>
                )}
              </div>

              <Separator />

              {/* Order Status & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="text-sm font-medium">
                    {order.status === "delivered" && order.delivered_at
                      ? `Delivered on ${new Date(order.delivered_at).toLocaleDateString()}`
                      : order.status === "shipped" && order.shipped_at
                        ? `Shipped on ${new Date(order.shipped_at).toLocaleDateString()}`
                        : `Status: ${order.status}`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/account/orders/${order.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                  {(order.status === "shipped" || order.status === "delivered") && (
                    <Button size="sm" onClick={() => handleTrackOrder(order)}>
                      <Truck className="mr-2 h-4 w-4" />
                      Track Order
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <OrderTrackingModal order={selectedOrder} open={trackingModalOpen} onOpenChange={setTrackingModalOpen} />
    </>
  )
}
