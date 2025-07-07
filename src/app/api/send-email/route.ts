import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const {
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  GMAIL_USER,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // or your redirect URI
);
console.log(oAuth2Client);
oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

export async function POST(request: Request) {
  try {
    const { to, subject, message } = await request.json();

    const accessToken = await oAuth2Client.getAccessToken();
    console.log(accessToken);
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken: accessToken?.token,
      },
    } as SMTPTransport.Options);

    await transporter.sendMail({
      from: 'hrishabh.bharati@vedam.org',
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch(error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Failed to send email' }, { status: 500 });
  }
}
