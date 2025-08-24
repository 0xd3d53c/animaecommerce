import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"
import { createErrorResponse } from "./headers"

export async function requireApiAuth(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return { success: false, response: createErrorResponse("Authentication required", 401) }
    }

    return { success: true, user }
  } catch (error) {
    return { success: false, response: createErrorResponse("Authentication failed", 401) }
  }
}

export async function requireApiAdmin(request: NextRequest) {
  const authResult = await requireApiAuth(request)

  if (!authResult.success) {
    return authResult
  }

  try {
    const supabase = await createClient()
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", authResult.user.id).single()

    if (!profile || !["admin", "editor"].includes(profile.role)) {
      return { success: false, response: createErrorResponse("Admin access required", 403) }
    }

    return { success: true, user: authResult.user, profile }
  } catch (error) {
    return { success: false, response: createErrorResponse("Authorization failed", 403) }
  }
}
