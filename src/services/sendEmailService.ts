import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import myOAuth2Client from './myOAuth2Client';
export const sendEmailService = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    myOAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    const accessToken = await myOAuth2Client.getAccessToken();

    const transportOptions: SMTPTransport.Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token ?? undefined,
      },
    };
    const smtpTransport = createTransport(transportOptions);
    const mailOptions = {
      from: `"GmailNodeMailer" <${process.env.GOOGLE_EMAIL ?? ''}>`,
      to,
      subject,
      html,
    };
    await smtpTransport.sendMail(mailOptions);
  } catch(error: unknown) {
    console.error(error);
  }
};
