'use client';
import { Box, Container, Typography } from '@mui/material';
import React from 'react';

import BaseDecoration from '@/components/BaseDecoration';

const AboutUs: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        backgroundImage: 'url("/assets/Background.png")',
        backgroundSize: '100% auto',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', pt:'55px' }}>
          <Typography
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontSize:'44px',
              fontWeight: 500,
              color: '#1E1E1E',
            }}
          >
                        Introducing
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '56px',
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
              fontSize: '32px' ,
              fontWeight: 500,
              color: '#000',
            }}
          >
                        4 Year Undergrad Program in CS & AI
          </Typography>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: '17px', mt: '67.5px' }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: '17px', position: 'relative', top: '-60px' }}>
            <Box
              sx={{
                borderRadius: '26px',
                border: '2px solid #FFE9AE',
                background: 'linear-gradient(0deg, #FFE9AE 1.44%, #FFF 73.08%)',
                width: '408px',
                flexShrink: 0,
                p: '32px 23px'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                {/* Left Line */}
                <Box
                  sx={{
                    flex: 1,
                    maxWidth: '70px',
                    height: '1px',
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
                    px: '42px',
                    color: '#9D75F1',
                    textAlign: 'center',
                    maxWidth: '200px',

                  }}
                >
                                    Top Content
                </Typography>

                {/* Right Line */}
                <Box
                  sx={{
                    flex: 1,
                    maxWidth: '70px',
                    height: '1px',
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
                width: '408px',
                p: '32px 23px',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                {/* Left Line */}
                <Box
                  sx={{
                    flex: 1,
                    maxWidth: '70px',
                    height: '1px',
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
                    px:'21px',
                    textTransform: 'uppercase',
                    color: '#9D75F1',
                    textAlign: 'center',
                    maxWidth: '210px',

                  }}
                >
                                    CODE FROM DAY 1
                </Typography>

                {/* Right Line */}
                <Box
                  sx={{
                    flex: 1,
                    maxWidth: '70px',
                    height: '1px',
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

          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: '17px' }}>
            <Box>
              <img
                src="/assets/Image04.png"
                alt="About Us"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
            <Box>
              <img
                src="/assets/Image05.png"
                alt="About Us"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
            <Box>
              <img
                src="/assets/Image06.png"
                alt="About Us"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: '17px', position: 'relative', top: '-60px' }}>
            <Box
              sx={{
                borderRadius: '26px',
                border: '2px solid #FFE9AE',
                background: 'linear-gradient(0deg, #FFE9AE 1.44%, #FFF 73.08%)',
                width: '408px',
                p:'26px 23px',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                {/* Left Line */}
                <Box
                  sx={{
                    flex: 1,
                    maxWidth: '70px',
                    height: '1px',
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
                    px:'21px',
                    textTransform: 'uppercase',
                    color: '#9D75F1',
                    textAlign: 'center',
                    maxWidth: '210px',

                  }}
                >
                                    6-MONTHS PAID INTERNSHIP
                </Typography>

                {/* Right Line */}
                <Box
                  sx={{
                    flex: 1,
                    maxWidth: '70px',
                    height: '1px',
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
                                Gain real-world experience while earning.
              </Typography>

            </Box>
            <Box
              sx={{
                borderRadius: '26px',
                border: '2px solid #ECD5FF',
                background: 'linear-gradient(0deg, #ECD5FF 1.44%, #FFF 73.08%)',
                width: '408px',
                p: '26px 23px',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                {/* Left Line */}
                <Box
                  sx={{
                    flex: 1,
                    maxWidth: '70px',
                    height: '1px',
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
                    px:'23px',
                    color: '#9D75F1',
                    textAlign: 'center',
                    maxWidth: '200px',

                  }}
                >
                                    TRUSTED BY
                                    TOP-RANKERS
                </Typography>

                {/* Right Line */}
                <Box
                  sx={{
                    flex: 1,
                    maxWidth: '70px',
                    height: '1px',
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
                                Students with 97%le in JEE have chosen Vedam
              </Typography>
            </Box>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default AboutUs;