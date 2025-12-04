# Contact Form Setup Guide

## Overview

The contact form has been successfully implemented with the following features:
- Real-time validation for name, email, and message fields
- Rate limiting (3 submissions per hour per IP)
- Email delivery via Resend API
- Terminal mode styling
- Success/error state handling

## Environment Variables Required

Add the following to your `.env.local` file:

```bash
# Resend API Configuration
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL_TO=your_email@example.com
CONTACT_EMAIL_FROM=noreply@yourdomain.com
```

## Getting a Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## Testing the Contact Form

### In Terminal Mode

1. Start the development server: `npm run dev`
2. Open the terminal interface
3. Type `contact` and press Enter
4. Fill out the form with:
   - Name: Your name
   - Email: A valid email address
   - Message: Your message
5. Click "Send Message"

### Expected Behavior

- **Valid submission**: Form clears, success message displays
- **Invalid email**: Error message appears under email field
- **Empty message**: Error message appears under message field
- **Rate limit exceeded**: After 3 submissions in an hour, you'll see a rate limit error

## Implementation Details

### Files Created/Modified

1. **components/shared/ContactForm.tsx**
   - Reusable contact form component
   - Real-time validation
   - Terminal and GUI mode styling
   - Requirements: 2.6, 5.2, 5.3

2. **lib/commands/contact.tsx**
   - ContactCommand implementation
   - Displays contact info and form
   - Requirements: 2.6

3. **app/api/contact/route.ts**
   - POST endpoint for form submissions
   - Zod validation
   - Resend email integration
   - Rate limiting (3 per hour per IP)
   - Requirements: 5.1, 5.2, 5.3, 5.4

4. **lib/commands/index.ts**
   - Registered ContactCommand

### Rate Limiting

The current implementation uses in-memory storage for rate limiting. For production:
- Consider using Redis or Upstash for distributed rate limiting
- Current limit: 3 submissions per hour per IP address
- Returns 429 status code when limit exceeded

### Validation Rules

- **Name**: Required, cannot be empty
- **Email**: Required, must be valid email format
- **Message**: Required, cannot be empty or whitespace only

## Troubleshooting

### "Email service not configured" error
- Ensure `RESEND_API_KEY` is set in `.env.local`
- Restart the development server after adding environment variables

### Rate limit errors during testing
- Wait 1 hour between test submissions
- Or restart the development server to clear in-memory rate limit store

### Build errors related to Supabase
- Ensure Supabase environment variables are configured
- See `SUPABASE_SETUP_COMPLETE.md` for Supabase setup instructions

## Next Steps

To fully test the contact form:
1. Configure Resend API key
2. Set up email addresses in environment variables
3. Test form submission
4. Verify email delivery
5. Test rate limiting behavior
