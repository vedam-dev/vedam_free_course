import { NextRequest, NextResponse } from 'next/server';

import { sendEmailService } from '../../../services/sendEmailService';

export async function POST(req: NextRequest) {
  try {
    const { studentName, subjectName, studentEmail, jpgBase64 } = await req.json();

    // 1️⃣ Validate required fields
    if(!studentName || !subjectName || !studentEmail || !jpgBase64) {
      return NextResponse.json(
        { error: 'Missing required fields: studentName, subjectName, studentEmail, jpgBase64' },
        { status: 400 }
      );
    }

    // 2️⃣ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(studentEmail)) {
      return NextResponse.json(
        { error: 'Invalid student email format' },
        { status: 400 }
      );
    }

    console.log('Sending certificate (JPG) to:', studentEmail);

    // 3️⃣ Clean base64 string (in case "data:image/jpeg;base64," is included)
    const cleanedBase64 = jpgBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(cleanedBase64, 'base64');

    if(!imageBuffer || imageBuffer.length === 0) {
      throw new Error('Invalid or empty image buffer');
    }

    // 4️⃣ Email HTML content with attachment
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f6f6f6; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px; }
          .header h1 { margin: 0; font-size: 22px; }
          .content { padding: 30px; }
          .congrats { font-size: 22px; font-weight: bold; color: #4b1869; margin-bottom: 15px; }
          .message { margin-bottom: 20px; }
          .footer { text-align: center; color: #666; font-size: 14px; padding: 15px 0; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations, ${studentName}! 🎉</h1>
          </div>
          <div class="content">
            <div class="congrats">You've successfully completed <strong>${subjectName}</strong></div>
            <div class="message">
              <p>Dear <strong>${studentName}</strong>,</p>
              <p>Congratulations on successfully completing <strong>${subjectName}</strong> in our CodeSprint program!</p>
              <p>Your certificate of completion (JPG image) is attached to this email.</p>
              <p>We're proud of your accomplishment and wish you continued success in your coding journey!</p>
            </div>
            <div class="footer">
              <p>Best regards,<br><strong>The CodeSprint Team</strong></p>
              <p><small>This certificate was automatically generated and sent via our platform.</small></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // 5️⃣ Send email with JPG attachment
    await sendEmailService({
      to: studentEmail,
      subject: `🎓 Your Certificate of Completion - ${subjectName}`,
      html: htmlContent,
      attachments: [
        {
          filename: `Certificate_${studentName.replace(/\s+/g, '_')}_${subjectName.replace(/\s+/g, '_')}.jpg`,
          content: imageBuffer,
          contentType: 'image/jpeg'
        }
      ]
    });

    console.log('✅ Certificate JPG email sent successfully to:', studentEmail);

    return NextResponse.json({
      success: true,
      message: 'Certificate JPG sent successfully'
    });

  } catch(error) {
    console.error('❌ Certificate send error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send certificate',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}