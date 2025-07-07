import { useEffect, useState } from 'react';

export const useOtpModal = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);


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
  };

  return {
    showOtpModal,
    setShowOtpModal,
    handleVerificationSuccess,
  };
};