'use client';
import { Box, Container, Typography } from '@mui/material';
import React from 'react';

import BaseDecoration from '@/components/BaseDecoration';

const AboutUs: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        width: '100vw',
        minHeight: '100vh',
        backgroundImage: 'url("/assets/Background.png")',
        backgroundSize: '100% auto',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        py: { xs: 4, md: '48px' },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: { xs: '18px', md: '44px' },
              fontWeight: 500,
              color: '#1E1E1E',
            }}
          >
                        Introducing
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: { xs: '28px', md: '56px' },
              fontWeight: 700,
              mb: '29px',
            }}
          >
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(90deg, #8A18FF 0%, #F5790D 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
                            Vedam School of{' '}
            </Box>
            <BaseDecoration
              sx={{
                background: 'linear-gradient( #F5790D 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
                            Technology
            </BaseDecoration>
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: { xs: '14px', md: '32px' },
              fontWeight: 500,
              color: '#000',
            }}
          >
                        4 Year Undergrad Program in CS & AI
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: '17px' }}>
          <Box>
            <img
              src="/assets/Image01.png"
              alt="About Us"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
          <Box>
            <img
              src="/assets/Image02.png"
              alt="About Us"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
          <Box>
            <img
              src="/assets/Image03.png"
              alt="About Us"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: '17px', position: 'relative', top: '-50px' }}>
          <Box
            sx={{
              borderRadius: '26px',
              border: '2px solid #FFE9AE',
              background: 'linear-gradient(0deg, #FFE9AE 1.44%, #FFF 73.08%)',
              width: '454px',
              height: '238px',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '42px',
                width: '100%',
                mt: '40px'
              }}
            >
              {/* Left Line */}
              <Box
                sx={{
                  flex: 1,
                  maxWidth: '70px',
                  height: '1.5px',
                  backgroundColor: '#9D75F1', // purple line
                }}
              />

              {/* Center Text */}
              <Typography
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#9D75F1',
                  textAlign: 'center',

                }}
              >
                                Top Content
              </Typography>

              {/* Right Line */}
              <Box
                sx={{
                  flex: 1,
                  maxWidth: '70px',
                  height: '1.5px',
                  backgroundColor: '#9D75F1',
                }}
              />
            </Box>


            <Typography
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '28px',
                fontWeight: 400,
                color: '#000',
                textAlign: 'center',
                px: '23px',
                mt: '26px',
              }}
            >
                            Curriculum designed and taught by expert from MAANG companies
            </Typography>

          </Box>
          <Box
            sx={{
              borderRadius: '26px',
              border: '2px solid #ECD5FF',
              background: 'linear-gradient(0deg, #ECD5FF 1.44%, #FFF 73.08%)',
              width: '454px',
              height: '238px',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '42px',
                width: '100%',
                mt: '40px'
              }}
            >
              {/* Left Line */}
              <Box
                sx={{
                  flex: 1,
                  maxWidth: '70px',
                  height: '1.5px',
                  backgroundColor: '#9D75F1', // purple line
                }}
              />

              {/* Center Text */}
              <Typography
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#9D75F1',
                  textAlign: 'center',

                }}
              >
                                CODE FROM DAY 1
              </Typography>

              {/* Right Line */}
              <Box
                sx={{
                  flex: 1,
                  maxWidth: '70px',
                  height: '1.5px',
                  backgroundColor: '#9D75F1',
                }}
              />
            </Box>


            <Typography
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '28px',
                fontWeight: 400,
                color: '#000',
                textAlign: 'center',
                px: '23px',
                mt: '26px',
              }}
            >
                            Students learn core coding concepts from day 1.
            </Typography>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default AboutUs;