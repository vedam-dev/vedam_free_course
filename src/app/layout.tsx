'use client';
import { Geist, Geist_Mono, Outfit } from 'next/font/google';
import { Provider } from 'react-redux';
import './globals.css';

import BannerPopupModal from '@/components/BannerPopupModal';
import ClientGaurd from '@/components/ClientGuard';
import FloatingButton from '@/components/FloatingButton';
import Footer from '@/components/Footer';

import UTMCaptureClient from '../components/UTMCaptureClient';
import { store } from '../lib/store';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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
            <ClientGaurd>
              {children}
              <FloatingButton />
              <BannerPopupModal/>
            </ClientGaurd>
            <Footer />
          </UTMCaptureClient>
        </Provider>
      </body>
    </html>
  );
}
