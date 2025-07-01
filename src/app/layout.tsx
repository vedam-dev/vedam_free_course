import { Geist, Geist_Mono, Outfit } from 'next/font/google';

import './globals.css';
import UTMCaptureClient from '../components/UTMCaptureClient';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${outfit.className }`}>
        <UTMCaptureClient>
          {children}
        </UTMCaptureClient>
      </body>
    </html>
  );
}
