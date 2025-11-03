// app/api/send-certificate/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { sendEmailService } from '../../../services/sendEmailService';

export async function POST(req: NextRequest) {
  try {
    const { studentName, subjectName, studentEmail, pdfBase64 } = await req.json();

    // Validate required fields
    if(!studentName || !subjectName || !studentEmail || !pdfBase64) {
      return NextResponse.json(
        { error: 'Missing required fields: studentName, subjectName, studentEmail, pdfBase64' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(studentEmail)) {
      return NextResponse.json(
        { error: 'Invalid student email format' },
        { status: 400 }
      );
    }

    console.log('Sending certificate to:', studentEmail);

    // Convert base64 back to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Create email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                   color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .congrats { font-size: 24px; font-weight: bold; color: #4b1869; margin-bottom: 20px; }
          .message { margin-bottom: 20px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; 
                   color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations ${studentName}! 🎉</h1>
          </div>
          <div class="content">
            <div class="congrats">You've Successfully Completed ${subjectName}</div>
            <div class="message">
              <p>Dear <strong>${studentName}</strong>,</p>
              <p>Congratulations on successfully completing <strong>${subjectName}</strong> in our CodeSprint program!</p>
              <p>Your certificate of completion is attached to this email. This achievement demonstrates your dedication and hard work in mastering the course material.</p>
              <p>We're proud of your accomplishment and wish you continued success in your coding journey!</p>
            </div>
            <div class="footer">
              <p>Best regards,<br>The Code Sprint Team</p>
              <p><small>This certificate was automatically generated and sent via our platform.</small></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email with PDF attachment
    await sendEmailService({
      to: studentEmail,
      subject: `🎓 Your Certificate of Completion - ${subjectName}`,
      html: htmlContent,
      attachments: [
        {
          filename: `Certificate_${studentName.replace(/\s+/g, '_')}_${subjectName.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    console.log('Certificate email sent successfully to:', studentEmail);

    return NextResponse.json({
      success: true,
      message: 'Certificate sent successfully'
    });

  } catch(error) {
    console.error('Certificate send error:', error);
    return NextResponse.json({
      error: 'Failed to send certificate',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}