import { z } from "zod"

// Common validation schemas
export const emailSchema = z.string().email("Invalid email address").max(255)
export const phoneSchema = z.string().regex(/^\+?[\d\s\-$$$$]{10,}$/, "Invalid phone number")
export const nameSchema = z.string().min(1, "Name is required").max(100)
export const addressSchema = z.string().min(5, "Address too short").max(500)
export const postalCodeSchema = z.string().regex(/^[0-9]{6}$/, "Invalid postal code")

// API validation schemas
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().int().min(1).max(100),
        price: z.number().positive(),
      }),
    )
    .min(1, "At least one item required"),
  customerInfo: z.object({
    email: emailSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    phone: phoneSchema,
    address: addressSchema,
    city: nameSchema,
    state: nameSchema,
    postalCode: postalCodeSchema,
  }),
  total: z.number().positive(),
  shippingMethod: z.enum(["standard", "express", "pickup"]),
  paymentMethod: z.enum(["razorpay", "cod"]),
})

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]),
})

export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(100),
  variantId: z.string().uuid().optional(),
})

// Sanitization functions
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

// Validation middleware
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: Request): Promise<{ success: true; data: T } | { success: false; error: string }> => {
    try {
      const body = await request.json()
      const data = schema.parse(body)
      return { success: true, data }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
        return { success: false, error: errorMessage }
      }
      return { success: false, error: "Invalid request data" }
    }
  }
}
