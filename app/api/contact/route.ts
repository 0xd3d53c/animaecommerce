import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimit } from "@/lib/security/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, "contact", 5, 60 * 60) // 5 requests per hour
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Too many contact requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    const { firstName, lastName, email, phone, category, message } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !category || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const supabase = await createClient()

    // Store contact form submission in database
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        category,
        message,
        status: "new",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save contact form" }, { status: 500 })
    }

    // Send email notification (using a simple email service)
    try {
      const emailContent = `
New Contact Form Submission

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || "Not provided"}
Category: ${category}

Message:
${message}

Submission ID: ${data.id}
Submitted at: ${new Date().toLocaleString()}
      `

      // In production, you would integrate with an email service like:
      // - Resend (recommended for Vercel)
      // - SendGrid
      // - AWS SES
      // For now, we'll log the email content
      console.log("Email notification:", emailContent)

      // You can also send a WhatsApp message using WhatsApp Business API
      const whatsappMessage = `🔔 New Contact Form Submission\n\n👤 ${firstName} ${lastName}\n📧 ${email}\n📱 ${phone || "N/A"}\n📂 ${category}\n\n💬 ${message}`

      // WhatsApp Business API integration would go here
      console.log("WhatsApp notification:", whatsappMessage)
    } catch (emailError) {
      console.error("Email/WhatsApp notification error:", emailError)
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      id: data.id,
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
