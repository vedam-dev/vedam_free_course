'use client';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Container,
  Stack,
  Typography
} from '@mui/material';
import React from 'react';

import BaseButton from '@/components/BaseButton';
import BaseDecoration from '@/components/BaseDecoration';
const Landing: React.FC = () => {
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                width: { xs: '87px', md: '199px' },
                height: { xs: '60px', md: '80px' },
                backgroundImage: 'url("/assets/logo.png")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
            {/* Line Divider */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                width: '1px',
                height: '45px',
                backgroundColor: '#2C0052',
                mx: 2,
              }}
            />
            <Box
              sx={{
                display: { xs: 'block', md: 'none' },
                width: '19px',
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
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <BaseButton variant="outlined">Login</BaseButton>
            <BaseButton variant="contained">Sign Up</BaseButton>
          </Box>
        </Box>

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
                lineHeight: { xs: '44px', md: '71px' },
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
              {['Beginner Friendly', 'Free of Cost', 'No prior experience required'].map((feature) => (
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
              minHeight: { xs: '300px', sm: '400px', md: '500px', lg: '670px' },
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
    </Box>

  );
};

export default Landing;