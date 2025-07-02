'use client';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Avatar,
  Box,
  Container,
  Divider,
  Stack,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


import BaseButton from '@/components/BaseButton';
import BaseDecoration from '@/components/BaseDecoration';
import OtpModal from '@/components/otp/OtpModal';
import type { RootState } from '@/lib/store';


const temp = ['Beginner Friendly', 'Free of Cost', 'No prior experience required'];

// Helper to get random color
function stringToColor(str: string) {
  let hash = 0;
  for(let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for(let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

const Landing: React.FC = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const username = useSelector((state: RootState) => state.user.username);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  
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
  if (!hasMounted) return null;
  return (

    <Box
      sx={{
        background: 'linear-gradient(135deg, #E8D5FF 0%, #B8E6F0 50%, #FFE5E5 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        px: { xs: 2, md: 6 },
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth='lg'>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: { xs: 4, md: 6 },
          }}
        >
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, lg: 0 } }}>
            <Box
              sx={{
                width: { xs: '88px', md: '200px' },
                height: { xs: '60px', md: '80px' },
                backgroundImage: 'url("/assets/logo.png")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                marginRight: '1px'
              }}
            />
            {/* Line Divider */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                width: '1px',
                height: '44px',
                backgroundColor: '#2C0052',
                marginRight: '56px'
              }}
            />
            <Box
              sx={{
                display: { xs: 'block', md: 'none' },
                width: '20px',
                height: '1px',
                backgroundColor: '#858585',
                transform: 'rotate(90deg)',
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: { xs: '20px', sm: '28px', md: '40px' },
                fontWeight: 600,
                background: 'linear-gradient(90deg, #5A02A7 0%, #8A18FF 33.74%, #C14B81 54.73%, #DD6442 75%, #F97D03 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              CodeSprint
            </Typography>
          </Box>



          {/* Header Buttons */}
          <Box sx={{ display: { xs: 'flex', md: 'flex' }, gap: 2, alignItems: 'end', pl:{xs:"16px",md:"0px" }}}>
            {isLoggedIn ? (
              <Avatar sx={{ bgcolor: stringToColor(username || 'U'), width:{xs:'28px', md:'40px'} , height: {xs:'28px', md:'40px'} , fontWeight: 700, fontSize: {xs:15,md:22} }}>
                {(username || 'U').charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <>
                <BaseButton variant="outlined" onClick={() => setShowOtpModal(true)}>Login</BaseButton>
                <BaseButton variant="contained" onClick={() => setShowOtpModal(true)}>Sign Up</BaseButton>
              </>
            )}
          </Box>

        </Box>
      </Container>

      <Divider sx={{ display: { xs: 'block', md: 'none', lg: 'none' }, mt: '-40px', mb: '20px',backgroundColor:'#929292' }}/>

      <Container maxWidth='lg'>
        {/* Main Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          {/* Left Section */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'center', lg: 'left' } }}>
            <Typography
              sx={{
                color: '#272727',
                fontWeight: 600,
                fontSize: '24px',
                fontFamily: 'Outfit',
                mb: 2,
              }}
            >
              START SMART, START EARLY!
            </Typography>

            <Typography
              sx={{
                color: '#1E1E1E',
                fontFamily: 'Outfit',
                fontSize: { xs: '36px', md: '60px' },
                fontWeight: 600,
                lineHeight: { xs: '44px', md: '72px' },
                mb: 3,
              }}
            >
              Sprint into College
              <br />
              With a{' '}
              <BaseDecoration>Clear</BaseDecoration>
              <br />
              Advantage
            </Typography>

            <Typography
              sx={{
                color: '#1E1E1E',
                fontFamily: 'Outfit',
                fontSize: { xs: '20px', md: '32px' },
                fontWeight: 500,
                lineHeight: '36px',
                mb: 4,
              }}
            >
              A free program for 12th Grade
              <br />
              students starting B.Tech CS this year
            </Typography>

            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'column', lg: 'row' }, gap: 2, mb: 4
            }}>
              <BaseButton variant="outlined" size="large">
                Join CodeSprint
              </BaseButton>
              <BaseButton variant="contained" size="large">
                Register for later
              </BaseButton>
            </Box>

            <Stack spacing={1}>
              {temp.map((feature) => (
                <Box key={feature} sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                }}>
                  <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: '20px' }} />
                  <Typography sx={{ color: '#333', fontWeight: 500, fontSize: '16px' }}>
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              flex: 1,
              minHeight: { xs: '300px', sm: '400px', md: '500px', lg: '672px' },
              width: '100%',
              backgroundImage: {
                xs: 'url("/assets/centralBox.png")',
                lg: 'url("/assets/rightBox.png")'
              },
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
        </Box>
      </Container>
      <OtpModal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </Box>

  );
};

export default Landing;