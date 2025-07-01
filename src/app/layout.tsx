'use client';
import { Geist, Geist_Mono, Outfit } from 'next/font/google';
import { Provider } from 'react-redux';

import UTMCaptureClient from '../components/UTMCaptureClient';
import { store } from '../lib/store';

import './globals.css';
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
        <Provider store={store}>
          <UTMCaptureClient>
            {children}
          </UTMCaptureClient>
        </Provider>
      </body>
    </html>
  );
}
