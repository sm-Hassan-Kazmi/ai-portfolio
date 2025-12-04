import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { checkRateLimit, getRateLimitHeaders, getClientIp, RATE_LIMIT_CONFIGS } from "@/lib/utils/rate-limit";

// Initialize Resend client lazily
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  if (!resend) {
    throw new Error("Resend client not initialized");
  }
  return resend;
}

/**
 * Contact form validation schema
 * Requirements: 5.2, 5.3
 */
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email address").trim(),
  message: z.string().min(1, "Message cannot be empty").trim(),
});

/**
 * POST /api/contact
 * Handle contact form submissions
 * Requirements: 5.1, 5.2, 5.3, 5.4, 10.4
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request.headers);

    // Check rate limit (Requirements 5.4, 10.4)
    const rateLimitResult = checkRateLimit(clientIp, RATE_LIMIT_CONFIGS.CONTACT_FORM);
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: RATE_LIMIT_CONFIGS.CONTACT_FORM.message,
        },
        {
          status: 429,
          headers: rateLimitHeaders,
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: validationResult.error.issues[0].message,
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, email, message } = validationResult.data;

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        {
          error: "Email service not configured",
          message: "Unable to send email at this time. Please try again later.",
        },
        { status: 500 }
      );
    }

    // Send email via Resend (Requirement 5.1)
    const emailTo = process.env.CONTACT_EMAIL_TO || "hassan@example.com";
    const emailFrom = process.env.CONTACT_EMAIL_FROM || "noreply@yourdomain.com";

    const resendClient = getResendClient();
    const emailResult = await resendClient.emails.send({
      from: emailFrom,
      to: emailTo,
      replyTo: email,
      subject: `Portfolio Contact: Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      text: `
New Contact Form Submission

From: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error);
      return NextResponse.json(
        {
          error: "Failed to send email",
          message: "Unable to send your message. Please try again later.",
        },
        { status: 500 }
      );
    }

    // Success response (Requirement 5.5)
    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! I'll get back to you soon.",
      },
      { 
        status: 200,
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
