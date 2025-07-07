'use client';
import { Box } from '@mui/material';
import Script from 'next/script';




import { ContactForm } from './email/Email';
import HomePage from './home/client/HomePage';

export default function HomePageComponent() {


  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-KC46RHD2WJ"
      />

      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KC46RHD2WJ');
          `,
        }}
      />


      <Box sx={{ textAlign: 'center' }}>
        <ContactForm />
        <HomePage />
      </Box>
    </>
  );
}
