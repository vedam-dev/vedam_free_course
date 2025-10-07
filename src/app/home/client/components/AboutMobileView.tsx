'use client';
import { Box, Typography } from '@mui/material';
import React from 'react';

import BaseDecoration from '@/components/BaseDecoration';

const AboutUs: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundImage: 'url("/assets/BackgroundMobile.png")',
        backgroundSize: '100% auto',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box sx={{ p: '15px 20px'}}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', pt:'20px' }}>
          <Typography
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontSize:'20px',
              lineHeight:'26px',
              fontWeight: 500,
              color: '#1E1E1E',
              mb:'18px'
            }}
          >
            Introducing
          </Typography>
          <Box
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '36px',
              fontWeight: 600,
              lineHeight: '39px',
              mb: '18px',
            }}
          >
            <Box
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
                background: 'linear-gradient(90deg, #8A18FF 0%, #F5790D 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Technology
            </BaseDecoration>
          </Box>
          <Typography
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '16px' ,
              fontWeight: 500,
              color: '#000',
              mb:'26px',
            }}
          >
            4 Year Undergrad Program in CS & AI
          </Typography>
        </Box>
        
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '26px'}}>
            {/* Image 1 */}
            <Box sx={{ position: 'relative' }}>
              <img
                src="/assets/Image01_Mobile.png"
                alt="About Us"
                style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  borderRadius: '26px',
                  border: '1px solid #FFE9AE',
                  background: 'linear-gradient(0deg, #FFE9AE 1.44%, #FFF 73.08%)',
                  display: 'flex',
                  flexDirection: 'column',
                  p: '24px 15px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '11px',
                    width: '100%',
                  }}
                >
                  {/* Left Line */}
                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: '28px',
                      height: '1px',
                      backgroundColor: '#9D75F1',
                    }}
                  />

                  {/* Center Text */}
                  <Typography
                    sx={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: '#8A18FF',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    TOP CONTENT
                  </Typography>

                  {/* Right Line */}
                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: '28px',
                      height: '1px',
                      backgroundColor: '#9D75F1',
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#000',
                    textAlign: 'center',
                    mt: '17px',
                  }}
                >
                  Curriculum designed and taught by expert from MAANG companies
                </Typography>
              </Box>
            </Box>

            {/* Image 2 */}
            <Box sx={{ position: 'relative' }}>
              <img
                src="/assets/Image02_Mobile.png"
                alt="About Us"
                style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
              />
              
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  borderRadius: '26px',
                  border: '1px solid #ECD5FF',
                  background: 'linear-gradient(0deg, #ECD5FF 1.44%, #FFF 73.08%)',
                  display: 'flex',
                  flexDirection: 'column',
                  p: '31px 27px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '11px',
                    width: '100%',
                  }}
                >
                  {/* Left Line */}
                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: '28px',
                      height: '1px',
                      backgroundColor: '#9D75F1',
                    }}
                  />

                  {/* Center Text */}
                  <Typography
                    sx={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: '#8A18FF',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    CODE FROM DAY 1
                  </Typography>

                  {/* Right Line */}
                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: '28px',
                      height: '1px',
                      backgroundColor: '#9D75F1',
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#000',
                    textAlign: 'center',
                    mt: '17px',
                  }}
                >
                  Students learn core coding concepts from day 1
                </Typography>
              </Box>
            </Box>

            {/* Image 3 */}
            <Box sx={{ position: 'relative' }}>
              <img
                src="/assets/Image03_Mobile.png"
                alt="About Us"
                style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  borderRadius: '26px',
                  border: '1px solid #FFE9AE',
                  background: 'linear-gradient(0deg, #FFE9AE 1.44%, #FFF 73.08%)',
                  display: 'flex',
                  flexDirection: 'column',
                  p: '27px 15px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '11px',
                    width: '100%',
                  }}
                >
                  {/* Left Line */}
                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: '28px',
                      height: '1px',
                      backgroundColor: '#9D75F1',
                    }}
                  />

                  {/* Center Text */}
                  <Typography
                    sx={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: '#8A18FF',
                      textAlign: 'center',
                      maxWidth: '150px',
                    }}
                  >
                    6-MONTHS PAID INTERNSHIP
                  </Typography>

                  {/* Right Line */}
                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: '28px',
                      height: '1px',
                      backgroundColor: '#9D75F1',
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#000',
                    textAlign: 'center',
                    mt: '17px',
                  }}
                >
                  Gain real-world experience while earning.
                </Typography>
              </Box>
            </Box>

            {/* Image 4 */}
            <Box sx={{ position: 'relative' }}>
              <img
                src="/assets/Image04_Mobile.png"
                alt="About Us"
                style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  borderRadius: '26px',
                  border: '1px solid #ECD5FF',
                  background: 'linear-gradient(0deg, #ECD5FF 1.44%, #FFF 73.08%)',
                  display: 'flex',
                  flexDirection: 'column',
                  p: '27px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '11px',
                    width: '100%',
                  }}
                >
                  {/* Left Line */}
                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: '28px',
                      height: '1px',
                      backgroundColor: '#9D75F1',
                    }}
                  />

                  {/* Center Text */}
                  <Typography
                    sx={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      maxWidth: '150px',
                      color: '#8A18FF',
                      textAlign: 'center',
                    }}
                  >
                    TRUSTED BY TOP RANKERS
                  </Typography>

                  {/* Right Line */}
                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: '28px',
                      height: '1px',
                      backgroundColor: '#9D75F1',
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#000',
                    textAlign: 'center',
                    mt: '17px',
                  }}
                >
                  Students with 97%le in JEE have chosen Vedam
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutUs;