import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const OAuth2 = google.auth.OAuth2;

// Create OAuth2 client
const createOAuth2Client = () => {
  return new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );
};

// Create transporter with OAuth2
export const createTransporter = async () => {
  const oauth2Client = createOAuth2Client();

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });

  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token as string,
      },
    });

    return transporter;
  } catch(error) {
    console.error('Error creating transporter:', error);
    throw error;
  }
};

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to Our Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome, ${name}!</h1>
        <p>Thank you for joining our platform. We're excited to have you on board.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The Team</p>
      </div>
    `,
    text: `Welcome, ${name}! Thank you for joining our platform.`
  }),

  notification: (title: string, message: string) => ({
    subject: title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${title}</h2>
        <p>${message}</p>
        <p>Best regards,<br>The Team</p>
      </div>
    `,
    text: `${title}\n\n${message}`
  }),

  contactForm: (name: string, email: string, message: string) => ({
    subject: 'New Contact Form Submission',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
      </div>
    `,
    text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
  })
};

// Email validation utility
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Rate limiting utility (simple in-memory store)
const emailRateLimit = new Map<string, { count: number; resetTime: number }>();

// eslint-disable-next-line max-len
export const checkRateLimit = (ip: string, limit: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const userLimit = emailRateLimit.get(ip);

  if(!userLimit || now > userLimit.resetTime) {
    emailRateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if(userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
};