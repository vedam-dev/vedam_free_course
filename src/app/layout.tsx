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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2046732509398744');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID_HERE&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${outfit.className}`}>
        <Provider store={store}>
          <UTMCaptureClient>
            <ClientGaurd>
              {children}
              <FloatingButton />
              <BannerPopupModal />
            </ClientGaurd>
            <Footer />
          </UTMCaptureClient>
        </Provider>
      </body>
    </html>
  );
}
