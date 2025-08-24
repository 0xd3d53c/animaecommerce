import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimiter, RATE_LIMITS, getClientIdentifier } from "@/lib/security/rate-limit"
import { requireApiAuth } from "@/lib/security/auth-middleware"
import { createSecureResponse, createErrorResponse } from "@/lib/security/headers"
import { validateRequest } from "@/lib/security/validation"
import { z } from "zod"
import crypto from "crypto"

const verifyPaymentSchema = z.object({
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  orderId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimitResult = await rateLimiter.check(identifier, RATE_LIMITS.payment)

    if (!rateLimitResult.success) {
      return createErrorResponse("Too many requests", 429)
    }

    // Authentication
    const authResult = await requireApiAuth(request)
    if (!authResult.success) {
      return authResult.response
    }

    // Validation
    const validationResult = await validateRequest(verifyPaymentSchema)(request)
    if (!validationResult.success) {
      return createErrorResponse(validationResult.error, 400)
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = validationResult.data

    // Verify Razorpay signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      console.error("Razorpay key secret not configured")
      return createErrorResponse("Payment configuration error", 500)
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac("sha256", keySecret).update(body.toString()).digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
      console.error("Payment signature verification failed", {
        expected: expectedSignature,
        received: razorpay_signature,
      })
      return createErrorResponse("Payment verification failed", 400)
    }

    // Verify order exists and belongs to user
    const supabase = await createClient()
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id, status, total_amount")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return createErrorResponse("Order not found", 404)
    }

    if (order.user_id !== authResult.user.id) {
      return createErrorResponse("Unauthorized", 403)
    }

    if (order.status !== "pending") {
      return createErrorResponse("Order already processed", 400)
    }

    // Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid",
        payment_status: "completed",
        payment_reference: razorpay_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (updateError) {
      console.error("Failed to update order:", updateError)
      return createErrorResponse("Failed to update order", 500)
    }

    await supabase.from("audit_logs").insert({
      actor_id: authResult.user.id,
      action: "payment_verified",
      entity_type: "order",
      entity_id: orderId,
      metadata: {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: order.total_amount,
      },
    })

    return createSecureResponse({
      success: true,
      message: "Payment verified successfully",
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return createErrorResponse("Payment verification failed", 500)
  }
}
