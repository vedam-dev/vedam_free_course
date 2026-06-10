import { useEffect, useState } from 'react';

const MSG91_SCRIPT_ID = 'msg91-otp-provider';
const MSG91_SCRIPT_SRC = 'https://control.msg91.com/app/assets/otp-provider/otp-provider.js';

export const useOtpModal = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);


  useEffect(() => {
    if(!showOtpModal || typeof window === 'undefined') {
      return;
    }

    // Widget already loaded and initialized from a previous open
    if(window.sendOtp) {
      return;
    }

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

    const initWidget = () => {
      if(window.initSendOTP) {
        window.initSendOTP(configuration);
      }
    };

    const existingScript = document.getElementById(MSG91_SCRIPT_ID) as HTMLScriptElement | null;
    if(existingScript) {
      // Script tag exists but may still be downloading; init once it finishes
      existingScript.addEventListener('load', initWidget);
      return () => existingScript.removeEventListener('load', initWidget);
    }

    const script = document.createElement('script');
    script.id = MSG91_SCRIPT_ID;
    script.src = MSG91_SCRIPT_SRC;
    script.onload = initWidget;
    script.onerror = () => {
      console.error('Failed to load MSG91 OTP provider script');
      // Remove the broken tag so the next modal open retries the download
      script.remove();
    };
    document.body.appendChild(script);

    // Intentionally keep the script in the DOM on close so reopening the
    // modal doesn't re-download it and race against the user clicking Send.
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
