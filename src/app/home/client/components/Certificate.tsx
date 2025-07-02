'use client';

import { Box, Typography } from '@mui/material';
import React from 'react';

const Certificate: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("/assets/certificate/certificateBackground.png")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Content Overlay */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // justifyContent: 'center',
          px: 2,
          py: {
            xs: 4,
            lg: 8
          },
          textAlign: 'center',
        }}
      >
        {/* Mobile Typography */}
        <Typography
          sx={{
            display: { xs: 'block', lg: 'none' },
            fontFamily: 'Outfit, sans-serif',
            fontSize: '32px',
            fontWeight: '500',
            lineHeight: '36px',
            color: '#FFF',
            mb: 6,
          }}
        >
          Get a Certificate
          <br />
          of Completion at
          <br />
          the end
        </Typography>

        {/* Desktop Typography */}
        <Typography
          sx={{
            display: { xs: 'none', lg: 'block' },
            fontFamily: 'Outfit, sans-serif',
            fontSize: '56px',
            fontWeight: '600',
            lineHeight: '60px',
            color: '#FFF',
            mb: 3,
          }}
        >
          Get a Certificate
          <br />
          of Completion at the end
        </Typography>

        <Box
          component="img"
          src="/assets/certificate/certificate.png"
          alt="Certificate"
          sx={{
            width: {xs:'95%', md: '600px', lg:'960px'},
            aspectRatio:{
              xs: '321/244',
              lg: '29/22'
            },
            height: 'auto',
            boxShadow: 3,
            borderRadius: {
              xs: '20px',
              lg: '40px'
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default Certificate;