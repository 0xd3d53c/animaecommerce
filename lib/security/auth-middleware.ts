import { createClient } from "@/lib/supabase/server"
import type { NextRequest, NextResponse } from "next/server"
import { createErrorResponse } from "./headers"
import type { User } from "@supabase/supabase-js"

// Define explicit types for the authentication result
type AuthSuccess = {
  success: true;
  user: User;
  profile?: { role: string };
};
type AuthFailure = {
  success: false;
  response: NextResponse;
};
type AuthResult = AuthSuccess | AuthFailure;

export async function requireApiAuth(request: NextRequest): Promise<AuthResult> {
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

export async function requireApiAdmin(request: NextRequest): Promise<AuthResult> {
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

    // Return the successful result, now including the profile
    return { ...authResult, profile }
  } catch (error) {
    return { success: false, response: createErrorResponse("Authorization failed", 403) }
  }
}