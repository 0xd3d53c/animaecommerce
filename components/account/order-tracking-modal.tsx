"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

interface TrackingEvent {
  status: string
  description: string
  timestamp: string
  location?: string
}

interface Order {
  id: string
  order_number: string
  status: string
  tracking_number: string | null
  created_at: string
  shipped_at: string | null
  delivered_at: string | null
}

interface OrderTrackingModalProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderTrackingModal({ order, open, onOpenChange }: OrderTrackingModalProps) {
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (order && open) {
      fetchTrackingData(order)
    }
  }, [order, open])

  const fetchTrackingData = async (order: Order) => {
    setLoading(true)
    try {
      // In production, this would call Shiprocket API
      // For demo, we'll simulate tracking events based on order status
      const events = generateMockTrackingEvents(order)
      setTrackingEvents(events)
    } catch (error) {
      console.error("Failed to fetch tracking data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockTrackingEvents = (order: Order): TrackingEvent[] => {
    const events: TrackingEvent[] = []

    // Order placed
    events.push({
      status: "placed",
      description: "Order placed successfully",
      timestamp: order.created_at,
      location: "Online",
    })

    if (
      order.status === "paid" ||
      order.status === "processing" ||
      order.status === "shipped" ||
      order.status === "delivered"
    ) {
      events.push({
        status: "confirmed",
        description: "Order confirmed and payment received",
        timestamp: order.created_at,
        location: "Warehouse",
      })
    }

    if (order.status === "processing" || order.status === "shipped" || order.status === "delivered") {
      events.push({
        status: "processing",
        description: "Order is being prepared for shipment",
        timestamp: order.created_at,
        location: "Fulfillment Center",
      })
    }

    if (order.status === "shipped" || order.status === "delivered") {
      events.push({
        status: "shipped",
        description: "Package has been shipped",
        timestamp: order.shipped_at || order.created_at,
        location: "In Transit",
      })

      // Add some transit events for shipped orders
      if (order.status === "shipped") {
        events.push({
          status: "in_transit",
          description: "Package is on the way to your location",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          location: "Regional Hub",
        })
      }
    }

    if (order.status === "delivered") {
      events.push({
        status: "delivered",
        description: "Package delivered successfully",
        timestamp: order.delivered_at || order.created_at,
        location: "Delivery Address",
      })
    }

    return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed":
      case "confirmed":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600"
      case "shipped":
      case "in_transit":
        return "text-blue-600"
      case "processing":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Track Order {order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Current Status</h3>
              <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
            </div>
            {order.tracking_number && (
              <div className="text-right">
                <h3 className="font-semibold">Tracking Number</h3>
                <p className="text-sm font-mono">{order.tracking_number}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Tracking Timeline */}
          <div>
            <h3 className="font-semibold mb-4">Tracking History</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading tracking information...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trackingEvents.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className={`flex-shrink-0 ${getStatusColor(event.status)}`}>{getStatusIcon(event.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{event.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleDateString()} at{" "}
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{event.location}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estimated Delivery */}
          {order.status === "shipped" && (
            <>
              <Separator />
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Estimated Delivery</h3>
                <p className="text-sm text-blue-700">Your order is expected to arrive within 2-3 business days</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
