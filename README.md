# Vedam Free Course

A Next.js application for managing and delivering free educational content with UTM tracking, analytics, and automated certificate delivery.

## Features

- **Video Content Management**: Upload and manage video content using Streamable
- **User Authentication**: OTP-based authentication system
- **UTM Tracking**: Comprehensive UTM parameter tracking and analytics
- **Progress Tracking**: Track user progress through video content
- **Analytics Dashboard**: Real-time analytics for UTM data and user engagement
- **Automated Certificate Delivery**: Generates and emails certificates upon topic completion
- **Client-Side Certificate Generation**: HTML-to-image certificate creation using html2canvas
- **Responsive Design**: Mobile-first responsive design using Material-UI

## Analytics Dashboard

The analytics dashboard (`/analytics`) provides comprehensive insights into your UTM campaign performance:

### Key Metrics
- **Total Visitors**: Total number of unique visitors
- **Verified Users**: Number of users who completed registration
- **Conversion Rate**: Percentage of visitors who became verified users
- **Traffic Sources**: Number of different traffic sources

### Charts and Visualizations
- **Traffic Sources**: Doughnut chart showing distribution by source
- **Campaign Performance**: Bar chart of top performing campaigns
- **Traffic Mediums**: Doughnut chart showing distribution by medium
- **Daily Visitors Trend**: Line chart showing visitor trends over time
- **Verification Trend**: Line chart comparing total vs verified users over time

### Access
- Navigate to `/analytics` when logged in
- Click the "Analytics" button in the header (visible when logged in)
- **Admin Authentication Required**: You'll need to enter admin credentials to access the dashboard
- Data refreshes automatically and can be manually refreshed
- Use the logout button to sign out of the analytics dashboard

## Certificate System

### How It Works

The certificate system automatically triggers when a user completes **all videos in a topic**:

1. **Progress Tracking**: When a user marks a video as complete (via `POST /api/progress`)
2. **Completion Check**: System checks if all videos in the topic are completed
3. **Duplicate Prevention**: Verifies certificate hasn't already been sent for this topic
4. **Certificate Generation**: 
   - Frontend generates a high-quality JPG certificate using `html2canvas`
   - Uses HTML template (`/certi.html`) with dynamic student name and subject
   - Renders at 3x scale (1100x800px) for print quality
5. **Email Delivery**: Sends personalized email with certificate attachment via Nodemailer

### Certificate Generation Flow

```
User completes last video → Progress API checks completion
    ↓
Returns certificateData (name, topic, email)
    ↓
Frontend calls certificateGenerator.ts
    ↓
Loads certi.html template in hidden iframe
    ↓
Replaces placeholders with student data
    ↓
html2canvas renders to high-res JPG (base64)
    ↓
Sends base64 JPG to /api/send-certificate
    ↓
Server attaches JPG and emails via Nodemailer
    ↓
User receives certificate in email inbox
```

### Certificate Features

- **Automatic Trigger**: No manual intervention required
- **Topic-Based**: One certificate per completed topic (not per course)
- **Duplicate Prevention**: Uses `certificates_sent` table to prevent re-sending
- **High Quality**: 3x scale rendering (3300x2400px effective resolution)
- **Professional Design**: Customizable HTML template with CSS styling
- **Email Attachment**: JPG format certificate attached to email
- **Personalization**: Includes student name and completed topic name

### Certificate Template

The certificate template (`/public/certi.html`) uses placeholders:
- `{{Your Name here}}` → Student's name
- `{{Subject Name here}}` → Completed topic name

You can customize the design by editing the HTML/CSS in this file.

### Email Configuration

Configure SMTP settings for certificate delivery:

- `SMTP_HOST`: Your SMTP server hostname
- `SMTP_PORT`: SMTP port (587 for TLS, 465 for SSL)
- `SMTP_USER`: SMTP authentication username
- `SMTP_PASS`: SMTP password or app-specific password
- `EMAIL_FROM`: Sender email address with display name

### Supported Email Providers

#### Gmail
- **SMTP_HOST**: `smtp.gmail.com`
- **SMTP_PORT**: `587`
- **Setup**: Enable 2-Step Verification and generate App Password

#### Outlook/Office 365
- **SMTP_HOST**: `smtp.office365.com`
- **SMTP_PORT**: `587`

#### SendGrid
- **SMTP_HOST**: `smtp.sendgrid.net`
- **SMTP_PORT**: `587`
- **SMTP_USER**: `apikey`
- **SMTP_PASS**: Your SendGrid API key

#### Custom SMTP
- Use your hosting provider's SMTP settings

## API Endpoints

### UTM Analytics
- `GET /api/analytics` - Fetch processed UTM analytics data
- `POST /api/utm` - Capture UTM parameters from visitors

### User Management
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user and update UTM data

### Content Management
- `GET /api/content` - Fetch grouped video content
- `POST /api/content` - Add new video content
- `POST /api/upload` - Upload video to Streamable

### Progress Tracking
- `GET /api/progress` - Fetch user progress
  - **Query**: `?user_id={userId}`
  - **Returns**: List of completed videos with content details
  
- `POST /api/progress` - Update user progress
  - **Payload**: `{ user_id, content_id, is_complete }`
  - **Response**: Progress data + optional `certificateRequired: true` with `certificateData`
  - **Certificate Trigger**: Returns certificate data when topic is completed

### Certificate Delivery
- `POST /api/send-certificate` - Send certificate email with JPG attachment
  - **Payload**: 
    ```json
    {
      "studentName": "John Doe",
      "subjectName": "JavaScript Fundamentals",
      "studentEmail": "john@example.com",
      "jpgBase64": "base64-encoded-jpg-string"
    }
    ```
  - **Returns**: `{ success: true, message: "Certificate JPG sent successfully" }`
  - **Attachment**: High-resolution JPG certificate
  - **Email**: Professional HTML email with personalized content

## Database Schema

### Users Table (`users`)
- `id`: Unique user ID
- `name`: User's full name
- `email`: User's email address (required for certificates)
- `phone_number`: User's phone number

### UTM Data Table (`utm-data`)
- `visitor_token`: Unique identifier for each visitor
- `utm`: Combined UTM string
- `source`: UTM source parameter
- `medium`: UTM medium parameter
- `campaign`: UTM campaign parameter
- `isVerified`: Whether user completed registration
- `phoneNumber`: User's phone number (if verified)
- `created_at`: Timestamp of first visit

### Content Table (`content`)
- `id`: Unique content ID
- `shortcode`: Streamable video shortcode
- `topic`: Topic/subject name (groups related videos)
- `title`: Video title
- `description`: Video description

### Progress Table (`progress`)
- `id`: Unique progress ID
- `user_id`: Reference to user
- `content_id`: Reference to content/video
- `is_complete`: Boolean completion status
- `timestamp`: Last update timestamp

### Certificates Sent Table (`certificates_sent`)
- `id`: Unique certificate record ID
- `user_id`: Reference to user
- `topic`: Topic name (matches content.topic)
- `sent_at`: Timestamp when certificate was sent
- **Purpose**: Prevents duplicate certificate emails for same topic

## Getting Started

### 1. Install dependencies:
```bash
yarn install
```

### 2. Set up environment variables:
```bash
cp .env.example .env.local
```

Add the following to your `.env.local`:

```env
# Supabase Configuration
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Admin Authentication
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="CodeSprint Team <noreply@codesprint.com>"
```

### 3. Configure Supabase:

Create the following tables in your Supabase project:

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Content Table
```sql
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shortcode TEXT NOT NULL,
  topic TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Progress Table
```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  is_complete BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);
```

#### Certificates Sent Table
```sql
CREATE TABLE certificates_sent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, topic)
);
```

### 4. Add Certificate Template:

Create `/public/certi.html` with your certificate design:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      width: 1100px;
      height: 800px;
      margin: 0;
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      font-family: 'Georgia', serif;
      color: #333;
    }
    .certificate-container {
      background: white;
      height: 100%;
      padding: 60px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    h1 {
      font-size: 48px;
      margin-bottom: 20px;
      color: #764ba2;
    }
    .student-name {
      font-size: 42px;
      font-weight: bold;
      color: #333;
      margin: 30px 0;
    }
    .subject-name {
      font-size: 32px;
      color: #667eea;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="certificate-container">
    <h1>🎓 Certificate of Completion</h1>
    <p style="font-size: 24px;">This is to certify that</p>
    <div class="student-name">{{Your Name here}}</div>
    <p style="font-size: 24px;">has successfully completed</p>
    <div class="subject-name">{{Subject Name here}}</div>
    <p style="font-size: 18px; margin-top: 40px; color: #666;">
      Presented by CodeSprint Team
    </p>
  </div>
</body>
</html>
```

### 5. Configure Email Settings:

#### For Gmail:
1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Select "2-Step Verification" → "App passwords"
   - Generate a password for "Mail"
3. Use the generated password as `SMTP_PASS`

#### For Other Providers:
- Use your provider's SMTP settings
- Ensure SMTP is enabled for your account
- Use appropriate authentication credentials

### 6. Run the development server:
```bash
yarn dev
```

### 7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Certificate Generation Implementation

### Frontend: certificateGenerator.ts

Located in your project (client-side service):

```typescript
export interface CertificateData {
  studentName: string;
  subjectName: string;
  studentEmail: string;
}

export const generateCertificateImage = async (data: CertificateData): Promise<string>
```

**Key Features:**
- Loads HTML template from `/certi.html`
- Replaces placeholders dynamically
- Renders in hidden iframe (1100x800px)
- Uses `html2canvas` at 3x scale for quality
- Returns base64-encoded JPG string
- Automatic cleanup after generation

**Usage Example:**
```typescript
const jpgBase64 = await generateCertificateImage({
  studentName: "John Doe",
  subjectName: "JavaScript Basics",
  studentEmail: "john@example.com"
});
```

### Backend: Email Service

Create `src/services/sendEmailService.ts`:

```typescript
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export async function sendEmailService(options: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments,
  });
}
```

## Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t vedam-course .

# Run the container with environment variables
docker run -p 3000:3000 \
  -e SUPABASE_URL=your-url \
  -e SUPABASE_ANON_KEY=your-key \
  -e SMTP_HOST=smtp.gmail.com \
  -e SMTP_PORT=587 \
  -e SMTP_USER=your-email@gmail.com \
  -e SMTP_PASS=your-password \
  -e EMAIL_FROM="CodeSprint <noreply@codesprint.com>" \
  vedam-course

# Or use an env file
docker run -p 3000:3000 --env-file .env vedam-course
```

## Testing Certificate System

### Manual Testing Flow:
1. Register/login as a user
2. Complete all videos in a topic (mark as watched)
3. On completing the last video, certificate generation triggers automatically
4. Check your email inbox (including spam folder)
5. Verify certificate JPG attachment

### API Testing:

#### Test Certificate Generation:
```bash
# Complete a video (triggers certificate check)
curl -X POST http://localhost:3000/api/progress \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid",
    "content_id": "content-uuid",
    "is_complete": true
  }'

# Response will include certificateData if topic completed
```

#### Test Email Sending Directly:
```bash
curl -X POST http://localhost:3000/api/send-certificate \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "subjectName": "JavaScript Fundamentals",
    "studentEmail": "test@example.com",
    "jpgBase64": "base64-encoded-image-string"
  }'
```

## Troubleshooting

### Certificate Generation Issues

#### Certificate not triggering:
- Verify all videos in the topic are marked complete
- Check `certificates_sent` table for duplicates
- Review browser console for errors
- Ensure user has valid email in database

#### Image generation fails:
- Check if `/certi.html` exists in `/public` folder
- Verify html2canvas is installed: `yarn add html2canvas`
- Check browser console for CORS or resource loading errors
- Ensure iframe has proper dimensions (1100x800px)

#### Empty or corrupted certificate:
- Verify base64 string length (should be >50KB)
- Check if template placeholders are replaced
- Increase timeout in `generateCertificateImage` function
- Review html2canvas options (scale, dimensions)

### Email Delivery Issues

#### "Invalid login" error:
- Verify SMTP credentials are correct
- For Gmail, ensure you're using an App Password
- Check if 2-Step Verification is enabled

#### Emails not received:
- Check spam/junk folder
- Verify `EMAIL_FROM` is properly formatted
- Test SMTP connection with a tool like Telnet
- Check SMTP server logs for delivery errors

#### Attachment not showing:
- Verify `jpgBase64` is valid base64 string
- Check buffer creation: `Buffer.from(base64, 'base64')`
- Ensure `contentType: 'image/jpeg'` is set
- Verify base64 string doesn't include data URI prefix

#### Port connection errors:
- Try alternative ports: 587 (TLS) or 465 (SSL)
- Check if firewall blocks SMTP ports
- Verify hosting provider allows outbound SMTP

#### Rate limiting:
- Gmail: 500 emails per day for free accounts
- Use dedicated email service (SendGrid, Mailgun) for high volume
- Implement queuing for bulk certificate delivery

### Database Issues

#### Certificate sent multiple times:
- Verify `certificates_sent` table exists and has UNIQUE constraint
- Check table creation SQL includes `UNIQUE(user_id, topic)`
- Review API logs for duplicate prevention logic

#### Progress not tracking:
- Verify `progress` table has UNIQUE constraint on `(user_id, content_id)`
- Check if content exists and has valid `topic` field
- Review API response for errors

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` | Yes |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` | Yes |
| `SMTP_PORT` | SMTP server port | `587` | Yes |
| `SMTP_USER` | SMTP username/email | `user@gmail.com` | Yes |
| `SMTP_PASS` | SMTP password | `app-password` | Yes |
| `EMAIL_FROM` | From email with name | `"Course <no-reply@course.com>"` | Yes |
| `NEXT_PUBLIC_ADMIN_USERNAME` | Analytics admin username | `admin` | Yes |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Analytics admin password | `secure-pass` | Yes |

## Dependencies

### Certificate Generation
- **html2canvas**: ^1.4.x - HTML to canvas rendering for certificate generation

### Email Related
- **nodemailer**: ^6.9.x - Email sending library

### Core
- **next**: 14.x - React framework
- **react**: 18.x - UI library
- **@mui/material**: 5.x - Material-UI components
- **@supabase/supabase-js**: 2.x - Supabase client

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  (Video Player + Progress Tracking + Certificate Display)   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Progress API (POST)                       │
│  • Updates user_id + content_id completion status           │
│  • Calls checkTopicCompletion()                             │
│  • Returns certificateData if topic complete                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              checkTopicCompletion() Function                 │
│  1. Get all videos in topic from content table              │
│  2. Count user's completed videos for this topic            │
│  3. Check if certificate already sent (certificates_sent)   │
│  4. If complete + not sent: return certificate data         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           Frontend Certificate Generator (Client)            │
│  • Loads /certi.html template                               │
│  • Replaces {{placeholders}} with student data              │
│  • Renders in hidden iframe (1100x800px)                    │
│  • html2canvas converts to high-res JPG (3x scale)          │
│  • Returns base64 JPG string                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            Send Certificate API (POST)                       │
│  • Receives: name, topic, email, jpgBase64                  │
│  • Converts base64 to Buffer                                │
│  • Creates HTML email with professional template            │
│  • Attaches JPG certificate                                 │
│  • Sends via Nodemailer                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   SMTP Email Service                         │
│  (Gmail/SendGrid/Custom SMTP)                               │
│  → Delivers email with certificate to student               │
└─────────────────────────────────────────────────────────────┘
```

## Performance Considerations

### Certificate Generation
- **Rendering Time**: 1-3 seconds (depends on template complexity)
- **Image Size**: ~100-300KB JPG at 3x scale
- **Memory Usage**: Temporary iframe created and destroyed
- **Browser Compatibility**: Requires modern browsers with Canvas API

### Email Delivery
- **Send Time**: 1-5 seconds (depends on SMTP server)
- **Rate Limits**: Gmail 500/day, SendGrid varies by plan
- **Attachment Size**: Keep under 5MB (current ~200KB is optimal)

### Optimization Tips
- Cache certificate template in memory
- Compress JPG with quality parameter (0.8-0.9)
- Use email queue for bulk sending
- Implement retry logic for failed sends

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Release**: 5 November 2025  
Last Deployment : 18 Nov 2025 11:06 AM IST
