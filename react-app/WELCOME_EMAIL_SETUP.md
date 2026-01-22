# Welcome Email Configuration Guide

## Setup Instructions for Nodemailer Welcome Emails

### 1. Install Nodemailer (if not already installed)
```bash
npm install nodemailer
```

### 2. Gmail Configuration

To use Gmail with nodemailer, you need to:

#### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled

#### Step 2: Create an App Password
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or your device)
3. Click "Generate"
4. Copy the 16-character app password (remove spaces)

#### Step 3: Add to Environment Variables
Add these to your `.env` file:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `xxxx xxxx xxxx xxxx` with the 16-character app password (without spaces)

### 3. How It Works

- **First Login**: When a user logs in for the first time, the system:
  1. Sends a welcome email to their registered email address
  2. Updates the `firstLogin` field in the database to `false`
  3. Subsequent logins won't trigger the welcome email

- **Email Content**: Includes:
  - Personalized greeting with user's name
  - Welcome message
  - Features overview (Upload PDFs, AI Summaries, Save Resources, etc.)
  - Support information

### 4. Testing Locally

1. Ensure `.env` has the correct email credentials
2. Create a test account or login with existing account
3. Check the registered email for the welcome message
4. Monitor console for "Welcome email sent" confirmation

### 5. Troubleshooting

**Error: "Invalid login"**
- Verify Gmail address and app password in `.env`
- Ensure app password has no spaces
- Check that 2FA is enabled on Gmail

**Email not received**
- Check spam/junk folder
- Verify email address in signup form
- Check server console for error messages

**Console error about nodemailer**
- Ensure nodemailer is installed: `npm install nodemailer`
- Verify import statement in login.model.js

### 6. Production Deployment

For production, consider:
- Using a dedicated email service (SendGrid, Mailgun)
- Setting up email templates
- Adding email logging/tracking
- Implementing retry logic for failed emails
- Using environment-specific email addresses
