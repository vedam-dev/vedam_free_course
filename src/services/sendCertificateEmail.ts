import { CertificateData } from './generateCertificatePDF';
import { sendEmailService } from './sendEmailService';

export const sendCertificateEmail = async (data: CertificateData) => {
  try {
    console.log('Sending certificate email for:', data.studentName);

    // PDF generation disabled - Puppeteer removed

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
            <h1>🎉 Congratulations ${data.studentName}! 🎉</h1>
          </div>
          <div class="content">
            <div class="congrats">You've Successfully Completed ${data.subjectName}</div>
            <div class="message">
              <p>Dear <strong>${data.studentName}</strong>,</p>
              <p>Congratulations on successfully completing <strong>${data.subjectName}</strong> in our CodeSprint program!</p>
              <p>This achievement demonstrates your dedication and hard work in mastering the course material.</p>
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

    // Send email without PDF attachment (PDF generation disabled - Puppeteer removed)
    await sendEmailService({
      to: data.studentEmail,
      subject: `🎓 Your Certificate of Completion - ${data.subjectName}`,
      html: htmlContent
    });

    console.log('Certificate email sent successfully to:', data.studentEmail);

  } catch(error) {
    console.error('Error sending certificate email:', error);
    throw error;
  }
};