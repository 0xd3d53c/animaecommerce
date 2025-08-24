import { z } from "zod"

// Environment variable validation schema
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Razorpay
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),

  // Database
  POSTGRES_URL: z.string().url().optional(),

  // App
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL: z.string().url().optional(),
})

export function validateEnvironment() {
  try {
    const env = envSchema.parse(process.env)
    return { success: true, env }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join(".")).join(", ")
      console.error(`Missing or invalid environment variables: ${missingVars}`)
      return { success: false, error: `Missing environment variables: ${missingVars}` }
    }
    return { success: false, error: "Environment validation failed" }
  }
}

// Validate environment on startup
const validation = validateEnvironment()
if (!validation.success) {
  throw new Error(validation.error)
}
