import type { NextRequest } from "next/server"
import { requireApiAuth } from "@/lib/security/auth-middleware"
import { createSecureResponse, createErrorResponse } from "@/lib/security/headers"
import { createClient } from "@/lib/supabase/server"
import { shiprocketService } from "@/lib/shiprocket"

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    // Authentication
    const authResult = await requireApiAuth(request)
    if (!authResult.success) {
      return authResult.response
    }

    const { orderId } = params

    // Verify order belongs to user
    const supabase = await createClient()
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, user_id, tracking_number, status")
      .eq("id", orderId)
      .single()

    if (error || !order) {
      return createErrorResponse("Order not found", 404)
    }

    if (order.user_id !== authResult.user.id) {
      return createErrorResponse("Unauthorized", 403)
    }

    // If no tracking number, return basic status
    if (!order.tracking_number) {
      return createSecureResponse({
        success: true,
        tracking_data: {
          status: order.status,
          message: "Tracking information will be available once the order is shipped",
          events: [],
        },
      })
    }

    try {
      // Fetch tracking data from Shiprocket
      const trackingData = await shiprocketService.trackOrder(order.tracking_number)

      return createSecureResponse({
        success: true,
        tracking_data: trackingData.tracking_data,
      })
    } catch (shiprocketError) {
      // If Shiprocket fails, return basic order status
      console.error("Shiprocket tracking failed:", shiprocketError)

      return createSecureResponse({
        success: true,
        tracking_data: {
          status: order.status,
          message: "Unable to fetch detailed tracking information at the moment",
          events: [],
        },
      })
    }
  } catch (error) {
    console.error("Order tracking API error:", error)
    return createErrorResponse("Failed to fetch tracking information", 500)
  }
}
