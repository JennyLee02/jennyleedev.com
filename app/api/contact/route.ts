import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // For now, just log the contact form data
    // In the future, you can integrate with email services like:
    // - Nodemailer + SMTP
    // - SendGrid
    // - Resend
    // - AWS SES
    console.log("Contact form submission:", {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    })

    // Here you would typically send an email
    // Example with a future email service:
    // await sendEmail({
    //   to: "jenny@jennyleedev.com",
    //   from: email,
    //   subject: `Contact Form: ${subject}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message.replace(/\n/g, '<br>')}</p>
    //   `
    // })

    return NextResponse.json({
      success: true,
      message: "Message received successfully"
    })

  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    )
  }
} 