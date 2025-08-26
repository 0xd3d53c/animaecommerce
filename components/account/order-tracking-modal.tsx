"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

interface TrackingEvent {
  status: string
  activity: string
  date: string
  location: string
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
      const response = await fetch(`/api/orders/${order.id}/tracking`)
      const data = await response.json()
      if (data.success && data.tracking_data?.shipment_track_activities) {
        setTrackingEvents(data.tracking_data.shipment_track_activities)
      }
    } catch (error) {
      console.error("Failed to fetch tracking data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("delivered")) return <CheckCircle className="h-4 w-4" />
    if (s.includes("shipped") || s.includes("transit")) return <Truck className="h-4 w-4" />
    if (s.includes("processing") || s.includes("confirmed")) return <Package className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("delivered")) return "text-green-600"
    if (s.includes("shipped") || s.includes("transit")) return "text-blue-600"
    if (s.includes("processing")) return "text-orange-600"
    return "text-gray-600"
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Track Order {order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
          <div>
            <h3 className="font-semibold mb-4">Tracking History</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading tracking information...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trackingEvents.length > 0 ? (
                  trackingEvents.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className={`flex-shrink-0 ${getStatusColor(event.status)}`}>{getStatusIcon(event.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{event.activity}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
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
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No tracking history available yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}