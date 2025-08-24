import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  console.log("[v0] Auth callback - code:", code ? "present" : "missing")
  console.log("[v0] Auth callback - next:", next)

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log("[v0] Auth callback - exchange result:", {
      hasSession: !!data.session,
      hasUser: !!data.user,
      error: error?.message,
    })

    if (!error && data.session) {
      console.log("[v0] Auth callback - successful login, redirecting to:", next)
      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalhost = forwardedHost?.includes("localhost")

      if (isLocalhost) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.log("[v0] Auth callback - failed:", error?.message)
    }
  }

  // Return the user to an error page with instructions
  console.log("[v0] Auth callback - redirecting to error page")
  return NextResponse.redirect(`${origin}/auth/error`)
}
