'use client';
import { Box, Button, Typography } from '@mui/material';
import Script from 'next/script';
import { useEffect, useState } from 'react';

import OtpModal from '@/components/otp/OtpModal';

export default function HomePage() {
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Initialize MSG91 OTP widget
  useEffect(() => {
    if(showOtpModal && typeof window !== 'undefined') {
      const configuration = {
        widgetId: process.env.NEXT_PUBLIC_MSG91_WIDGET_ID,
        tokenAuth: process.env.NEXT_PUBLIC_MSG91_AUTH_KEY,
        exposeMethods: true,
        success: (data: unknown) => {
          console.log('Verification success:', data);
        },
        failure: (error: unknown) => {
          console.error('Verification failed:', error);
        },
      };

      const script = document.createElement('script');
      script.src =
        'https://control.msg91.com/app/assets/otp-provider/otp-provider.js';
      script.onload = () => {
        if(window.initSendOTP) {
          window.initSendOTP(configuration);
        }
      };
      document.body.appendChild(script);

      return () => {
        if(document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [showOtpModal]);

  const handleVerificationSuccess = (userData: {
    name: string;
    email: string;
    phone: string;
  }) => {
    console.log('User verified successfully:', userData);
    // Handle successful verification here
    // Save user data, redirect, etc.
  };

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


      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
        OTP Verification Demo
        </Typography>

        <Button
          variant="contained"
          onClick={() => setShowOtpModal(true)}
          sx={{ mt: 2 }}
        >
        Open OTP Modal
        </Button>

        <OtpModal
          open={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          onVerificationSuccess={handleVerificationSuccess}
        />
      </Box>
    </>
  );
}