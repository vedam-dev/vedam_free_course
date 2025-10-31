import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export const sendEmailService = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    // Validate required environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP configuration is incomplete');
    }

    const transportOptions: SMTPTransport.Options = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // Use TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // For development, remove in production if you have proper certificates
      }
    };

    console.log('Creating SMTP transporter...');
    const transporter = createTransport(transportOptions);

    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Mentorship Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully! Message ID:', result.messageId);
    
    return result;
  } catch (error: unknown) {
    console.error('❌ Email service error:');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.error('Full error:', error);
    throw error;
  }
};