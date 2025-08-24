import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimiter, RATE_LIMITS, getClientIdentifier } from "@/lib/security/rate-limit"
import { requireApiAuth } from "@/lib/security/auth-middleware"
import { createSecureResponse, createErrorResponse } from "@/lib/security/headers"
import { validateRequest } from "@/lib/security/validation"
import { z } from "zod"

const createOrderRequestSchema = z.object({
  amount: z.number().positive().max(1000000), // Max ₹10,00,000
  currency: z.string().default("INR"),
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
    const validationResult = await validateRequest(createOrderRequestSchema)(request)
    if (!validationResult.success) {
      return createErrorResponse(validationResult.error, 400)
    }

    const { amount, currency, orderId } = validationResult.data

    // Verify order exists and belongs to user
    const supabase = await createClient()
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, total_amount, user_id, status")
      .eq("id", orderId)
      .single()

    if (error || !order) {
      return createErrorResponse("Order not found", 404)
    }

    // Verify order belongs to authenticated user
    if (order.user_id !== authResult.user.id) {
      return createErrorResponse("Unauthorized", 403)
    }

    // Verify order status
    if (order.status !== "pending") {
      return createErrorResponse("Order cannot be paid", 400)
    }

    // Verify amount matches order total
    if (Math.abs(amount - order.total_amount) > 0.01) {
      return createErrorResponse("Amount mismatch", 400)
    }

    // Create Razorpay order (simulated for demo)
    // In production: const razorpayOrder = await razorpay.orders.create({...})
    const razorpayOrder = {
      id: `order_${Date.now()}`,
      amount: amount * 100, // Convert to paise
      currency,
      receipt: orderId,
      status: "created",
    }

    return createSecureResponse({
      success: true,
      order: razorpayOrder,
    })
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    return createErrorResponse("Failed to create payment order", 500)
  }
}
