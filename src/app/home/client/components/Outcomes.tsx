import { Box, Typography } from '@mui/material';
import React from 'react';

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
    hasLineGap: true
  },
];

const Outcomes = () => {
  return (
    <Box sx={{
      marginY: { xs: '50px', md: '100px' },
      px: { lg: '20px' }
    }}>
      <Typography
        component="h1"
        sx={{
          color: '#1E1E1E',
          fontFamily: 'Outfit, sans-serif',
          fontSize: { xs: '0.75px', sm: '2.25px', md: '2.75px' },
          fontWeight: 500,
          lineHeight: 'normal',
          mb: { xs: '16px', md: '60px' },
          textAlign: 'left',
        }}
      >
        <Box
          component="span"
          sx={{
            color: '#8A18FF',
            fontSize: { xs: '1.5rem', sm: '2.75rem', md: '3.25rem' },
            fontWeight: { xs: '600', sm: '700' },
            lineHeight: 'normal',
          }}
        >
        Outcomes
        </Box>{' '}
      that make you ready before college starts
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: '30px', md: '88px' },
          justifyContent: 'center',
          padding:{ xs: '24px', md: '16px' },
        }}
      >
        {data.map((item) => {
          const [firstWord, ...restWords] = item.content.split(' ');
          const restText = restWords.join(' ');

          return (
            <Box
              key={item.s_no}
              sx={{
                flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 44px)', lg: '0 0 calc(40% - 16px)' },

                borderRadius: '36px',
                bgcolor: '#FFFFFF',
                boxShadow: '0px 0px 40px rgba(0, 0, 0, 0.10)',
                pt: { xs: '50px', md: '72px' },
                px: { xs: '20px', md: '24px' },
                pb: { xs: '20px', md: '24px' },
                boxSizing: { sm: 'border-box' },

              }}
            >
              <Box
                sx={{
                  bgcolor: item.bgcolor,
                  borderRadius: '24px',
                  p: { xs: '20px', md: '30px' },
                  minHeight: { md: '290px' },
                  background: `linear-gradient(${item.bgcolor}, ${item.bgcolor}) padding-box, 
                            linear-gradient(to top, ${item.bordercolor} 0%, transparent 100%) border-box`,
                  border: '3px solid transparent',
                }}
              >
                <Typography
                  sx={{
                    color: item.bordercolor,
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 600,
                    textAlign: 'left',
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
                    textAlign: 'left',
                    fontWeight: 300
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
  );
};

export default Outcomes;
