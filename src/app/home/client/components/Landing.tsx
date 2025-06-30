'use client';
import React from 'react';
import {
  Box,
  Typography,
  Container,
  Stack
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BaseButton from '@/components/BaseButton';

const Landing: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E8D5FF 0%, #B8E6F0 50%, #FFE5E5 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: { xs: 1, md: 2 },
            px: { xs: 2, md: 4 },
          }}
        >
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                width: { xs: '120px', md: '199px' },
                height: { xs: '48px', md: '80px' },
                background: `url("/assets/logo.png") -15px -24px / 114.35% 160% no-repeat`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <Box
              sx={{
                width: '1px',
                height: { xs: '28px', md: '45px' },
                background: `url("/assets/Line.png")`,
                backgroundColor: '#2C0052',
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

          {/* Header Buttons - Hidden on mobile */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <BaseButton variant="outlined">Login</BaseButton>
            <BaseButton variant="contained">Sign Up</BaseButton>
          </Box>
        </Box>
      </Container>

      {/* Main Content */}
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2, md: 4 },
            // py: { xs: 2, md: 4 },
            minHeight: { xs: 'auto', md: 'calc(100vh - 120px)' },
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 4, lg: 8 },
          }}
        >
          {/* Desktop Layout */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            {/* Left Content - Desktop */}
            <Box
              sx={{
                flex: 1,
                maxWidth: '50%',
                zIndex: 2,
              }}
            >
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
                  fontSize: '62px',
                  fontWeight: 600,
                  lineHeight: '71px',
                  mb: 3,
                }}
              >
                Sprint into College
                <br />
                With a{' '}
                <Box
                  component="span"
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    paddingBottom: '6px',
                    // 👈 Adjust this value for more/less gap
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '20px', // Adjust according to your image
                      backgroundImage: `url("/assets/Vector8.png")`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      // borderRadius: '2px',
                    },
                  }}
                >
                  Clear
                </Box>
                <br />
                Advantage
              </Typography>

              <Typography
                sx={{
                  color: '#1E1E1E',
                  fontFamily: 'Outfit',
                  fontSize: '32px',
                  fontWeight: 500,
                  lineHeight: '36px',
                  mb: 4,
                }}
              >
                A free program for 12th Grade
                <br />
                students starting B.tech CS this year
              </Typography>

              <Stack direction="row" spacing={2} mb={4}>
                <BaseButton variant="outlined" size="large">
                  Join CodeSprint
                </BaseButton>
                <BaseButton variant="contained" size="large">
                  Register for later
                </BaseButton>
              </Stack>

              <Stack spacing={1}>
                {[
                  'Beginner Friendly',
                  'Free of Cost',
                  'No prior experience required',
                ].map((feature) => (
                  <Box
                    key={feature}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ color: '#4CAF50', fontSize: '20px' }}
                    />
                    <Typography
                      sx={{
                        color: '#333',
                        fontWeight: 500,
                        fontSize: '16px',
                      }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Right Content - Desktop */}
            <Box
              sx={{
                flex: 2,
                maxWidth: '50%',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWwidth: '771px',
                  height: '670px',
                  background: `url("/assets/rightBox.png")`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                   backgroundPositionX: '-10px', // 👈 Negative shift
    backgroundPositionY: 'center',
                }}
              />
            </Box>
          </Box>

          {/* Mobile Layout */}
          <Box
            sx={{
              display: { xs: 'flex', lg: 'none' },
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              width: '100%',
              maxWidth: '400px',
              mx: 'auto',
            }}
          >
            <Typography
              sx={{
                color: '#272727',
                fontWeight: 600,
                fontSize: '12px',
                fontFamily: 'Outfit',
                lineHeight: '28px',
                mb: 2,
              }}
            >
              START SMART, START EARLY!
            </Typography>

            <Typography
              sx={{
                color: '#1E1E1E',
                fontFamily: 'Outfit',
                fontSize: '36px',
                fontWeight: 600,
                lineHeight: '39px',
                mb: 3,
              }}
            >
              Walk into College
              <br />
              With a{' '}
              <Box
                 component="span"
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    paddingBottom: '6px',
                    // 👈 Adjust this value for more/less gap
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '10px', // Adjust according to your image
                      backgroundImage: `url("/assets/Vector8.png")`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      // borderRadius: '2px',
                    },
                  }}
              >
                Clear
              </Box>
              <br />
              Advantage
            </Typography>

            <Typography
              sx={{
                color: '#1E1E1E',
                fontFamily: 'Outfit',
                fontSize: '20px',
                fontWeight: 500,
                lineHeight: '26px',
                mb: 4,
              }}
            >
              A free program for 12th
              <br />
              Grade students starting
              <br />
              B.tech CS this year
            </Typography>

            <Stack spacing={2} mb={4} >
              <BaseButton variant="contained" size="large">
                Register for Later
              </BaseButton>
              <BaseButton variant="outlined" size="large">
                Join CodeSprint
              </BaseButton>
            </Stack>

            <Stack spacing={1} alignItems="center">
              {[
                'Beginner Friendly',
                'Free of Cost',
                'No prior experience required',
              ].map((feature) => (
                <Box
                  key={feature}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <CheckCircleIcon
                    sx={{ color: '#4CAF50', fontSize: '18px' }}
                  />
                  <Typography
                    sx={{
                      color: '#333',
                      fontWeight: 500,
                      fontSize: '14px',
                    }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Stack>

            {/* Mobile Instructor Image */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '341px',
                height: '400px',
                background: `url("/assets/rightBox.png")`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                borderRadius: '16px',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;