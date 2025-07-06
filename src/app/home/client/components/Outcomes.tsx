'use client';

import { Box, Container, Typography, useMediaQuery } from '@mui/material';
import React from 'react';

import OptimizedImage from '@/components/OptimizedImage';

const data = [
  {
    s_no: '01',
    content: 'Build a rock-solid foundation in coding after your 12th std.',
    bgcolor: '#FFF2E5',
    bordercolor: '#FF7829',
  },
  {
    s_no: '02',
    content: 'Develop the tech mindset and logic to learn faster in college',
    bgcolor: '#EFE0FF',
    bordercolor: '#8A18FF',
  },
  {
    s_no: '03',
    content:
      'Stand out with your skills and certificate while applying for early Internships.',
    bgcolor: '#DFFBF3',
    bordercolor: '#3AB894',
  },
  {
    s_no: '04',
    content:
      'Dive early in your preparations for Hackathons and Coding competitions.',
    bgcolor: '#FFE3F2',
    bordercolor: '#EF54A6',
    featured: true,
  },
  {
    s_no: '05',
    content:
      'Practice Before college what others will only start learning in their first year',
    bgcolor: '#FFF9CF',
    bordercolor: '#E9C200',
  },
  {
    s_no: '06',
    content: 'Get an edge over your peers on coding skills',
    bgcolor: '#D8E5FF',
    bordercolor: '#6381BD',
    hasLineGap:false
  },
];

const Outcomes = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: { xs: 6, md: 12 }, px: { lg: 2 } }}>
        <Typography
          component="h1"
          sx={{
            color: '#1E1E1E',
            fontFamily: 'Outfit, sans-serif',
            fontSize: { xs: '1.5rem', sm: '2.75rem', md: '3.25rem' },
            fontWeight: 700,
            mb: { xs: 2, md: 6 },
          }}
        >
          <Box component="span" sx={{ color: '#8A18FF' }}>Outcomes</Box>{' '}
        that make you ready before college starts
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 4, md: 11 },
            justifyContent: 'center',
            p: { xs: 3, md: 2 },
          }}
        >
          {data.map((item) => {
            const [firstWord, ...restWords] = item.content.split(' ');
            const restText = restWords.join(' ');

            return (
              <Box
                key={item.s_no}
                sx={{
                  position: 'relative',
                  flex: {
                    xs: '0 0 100%',
                    sm: '0 0 calc(50% - 44px)',
                    lg: '0 0 calc(40% - 16px)',
                  },
                  borderRadius: '36px',
                  bgcolor: '#FFFFFF',
                  boxShadow: '0px 0px 40px rgba(0,0,0,0.1)',
                  pt: { xs: 6, md: 9 },
                  px: { xs: 2.5, md: 3 },
                  pb: { xs: 2.5, md: 3 },
                  boxSizing: 'border-box',
                  ...(item.featured && {
                    border: `3px solid ${item.bordercolor}`,
                  }),
                }}
              >
                {item.featured && (
                  <OptimizedImage
                    src="https://acjlsquedaotbhbxmtee.supabase.co/storage/v1/object/public/vedam-website-assets/images/others/star.png"
                    alt="Featured"
                    width={isMobile ? 65 : 100}
                    height={isMobile ? 65 : 100}
                    sizes="(max-width: 600px) 65px, 100px"
                    style={{
                      position: 'absolute',
                      top: isMobile ? -35 : -56,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderRadius: '50%',
                    }}
                  />
                )}

                <Box
                  sx={{
                    bgcolor: item.bgcolor,
                    borderRadius: '24px',
                    p: { xs: 2.5, md: 3.75 },
                    minHeight: { md: 290 },
                    background: `linear-gradient(${item.bgcolor}, ${item.bgcolor}) padding-box,
                               linear-gradient(to top, ${item.bordercolor}, transparent) border-box`,
                    border: '3px solid transparent',
                  }}
                >
                  <Typography
                    sx={{
                      color: item.bordercolor,
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      fontWeight: 600,
                      textAlign:'left'
                    }}
                  >
                    {item.s_no}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: { xs: '1rem', md: '2rem' },
                      lineHeight: 1.4,
                      color: '#1E1E1E',
                      fontWeight: 300,
                      textAlign:'left'
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      {item.hasLineGap && <br />}
                      {firstWord}
                    </Box>{' '}
                    {restText}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
};

export default Outcomes;
