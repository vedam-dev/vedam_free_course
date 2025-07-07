import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const OAuth2 = google.auth.OAuth2;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { to, subject, message } = req.body;

  if(!to || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const oauth2Client = new OAuth2(
    process.env.EMAIL_CLIENT_ID,
    process.env.EMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.EMAIL_REFRESH_TOKEN,
  });

  try {
    const { token } = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_SENDER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken: token as string,
      },
    });

    const mailOptions = {
      from: `Your App Name <${process.env.EMAIL_SENDER}>`,
      to,
      subject,
      html: getEmailTemplate({ subject, message }),
    };

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, messageId: info.messageId });

  } catch(error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

function getEmailTemplate({ subject, message }: { subject: string; message: string }) {
  return `
    <div style="font-family:sans-serif; padding:20px;">
      <h2>${subject}</h2>
      <p>${message}</p>
    </div>
  `;
}
