// pages/api/auth/[...
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import nodemailer from 'nodemailer';

export default NextAuth({
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT ? Number(process.env.EMAIL_SERVER_PORT) : 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        const { host } = new URL(url);
        const transport = nodemailer.createTransport(provider.server);
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: `Sign in to ${host}\n${url}`,
          html: `
              <body>
                <p>Hello,</p>
                <p>Click the following link to sign in to ${host}:</p>
                <p><a href="${url}">Sign in to ${host}</a></p>
                <p>If you did not request this, please ignore this email.</p>
              </body>
            `,
        });
      },
    }),
  ],
  // ... other NextAuth options (database, callbacks, etc.)
});