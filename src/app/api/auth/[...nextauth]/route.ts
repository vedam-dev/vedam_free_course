import NextAuth, { NextAuthOptions, Profile, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';

// @ts-expect-error: No type declarations for custom nodemailer utility
import { createTransporter } from '../../../lib/nodemailer';

if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing required Google OAuth environment variables');
}

// Extend types for session and token
interface ExtendedToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  googleId?: string;
  givenName?: string;
  familyName?: string;
  error?: string;
  accessTokenExpires?: number;
}

interface ExtendedUser extends User {
  googleId?: string;
  givenName?: string;
  familyName?: string;
  phoneNumbers?: { value: string }[];
}

interface ExtendedSession extends Session {
  accessToken?: string;
  error?: string;
  user: ExtendedUser;
}

// Function to refresh the access token
async function refreshAccessToken(token: ExtendedToken): Promise<ExtendedToken> {
  try {
    const url = 'https://oauth2.googleapis.com/token';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken!,
      }),
    });
    const refreshedTokens = await response.json();
    if(!response.ok) {
      throw refreshedTokens;
    }
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch(error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/user.phonenumbers.read',
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/gmail.send'
          ].join(' '),
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    }),
    EmailProvider({
      server: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_REFRESH_TOKEN,
        },
      },
      from: process.env.GMAIL_USER,
      async sendVerificationRequest({ identifier, url, provider }) {
        const { host } = new URL(url);
        const transport = await createTransporter();
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: `Sign in to ${host}\n${url}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Sign in to ${host}</h2>
              <p>Hello,</p>
              <p>Click the following link to sign in to ${host}:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="background-color: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Sign in to ${host}
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">If you did not request this, please ignore this email.</p>
            </div>
          `,
        });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      const extToken = token as ExtendedToken;
      // Store access tokens on initial sign-in
      if(account) {
        extToken.accessToken = account.access_token;
        extToken.refreshToken = account.refresh_token;
        extToken.googleId = account.providerAccountId;
        extToken.accessTokenExpires = Date.now() + (account.expires_in as number) * 1000;
      }
      if(profile) {
        // Google profile fields
        const googleProfile = profile as Profile & {
          sub?: string;
          given_name?: string;
          family_name?: string;
        };
        extToken.googleId = googleProfile.sub;
        extToken.givenName = googleProfile.given_name;
        extToken.familyName = googleProfile.family_name;
      }
      if(extToken.accessTokenExpires && extToken.refreshToken) {
        if(Date.now() > (extToken.accessTokenExpires as number) - 5 * 60 * 1000) {
          console.log('Access token expired, refreshing...');
          return refreshAccessToken(extToken);
        }
      }
      return extToken;
    },
    async session({ session, token }) {
      const extSession = session as ExtendedSession;
      const extToken = token as ExtendedToken;
      if(!extSession.user) extSession.user = { id: '' };
      extSession.accessToken = extToken.accessToken;
      extSession.user.googleId = extToken.googleId;
      extSession.user.givenName = extToken.givenName;
      extSession.user.familyName = extToken.familyName;
      extSession.error = extToken.error;
      // Fetch phone numbers from Google People API
      if(extToken.accessToken && !extToken.error) {
        try {
          const response = await fetch(
            'https://people.googleapis.com/v1/people/me?personFields=phoneNumbers',
            {
              headers: {
                Authorization: `Bearer ${extToken.accessToken}`,
              },
            }
          );
          if(response.ok) {
            const data = await response.json();
            const phoneNumbers = (data.phoneNumbers || []) as { value: string }[];
            const uniquePhones = phoneNumbers.filter(
              (phone, index, self) =>
                index === self.findIndex((p) => p.value === phone.value)
            );
            extSession.user.phoneNumbers = uniquePhones;
          } else {
            console.warn('Failed to fetch phone numbers:', response.status);
            extSession.user.phoneNumbers = [];
          }
        } catch(error) {
          console.error('Error fetching phone numbers:', error);
          extSession.user.phoneNumbers = [];
        }
      } else {
        extSession.user.phoneNumbers = [];
      }
      return extSession;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };