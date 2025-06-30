'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const Header: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh', // Ensure full screen section
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 6 },
        py: 4,
        boxSizing: 'border-box',
        bgcolor: '#fff',
      }}
    >
      {/* Background Circles Centered */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1200px',
          height: '1200px',
          zIndex: 0,
        }}
      >
        {[982, 981, 979, 983].map((n, i) => (
          <Box
            key={n}
            component="img"
            src={`/assets/Ellipse ${n}.png`}
            alt={`circle${n}`}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              zIndex: i,
            }}
          />
        ))}
      </Box>

      {/* Foreground Content */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '1280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          zIndex: 10,
        }}
      >
        {/* Left Section: Logo + Text */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: '199px',
              height: '80px',
              flexShrink: 0,
              background: `url("/assets/logo.png") lightgray -15px -24px / 114.35% 160% no-repeat`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <Typography
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '40px',
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

        {/* Right Section: Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: { xs: 3, md: 0 } }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '16px',
              color: '#8A18FF',
              borderColor: '#8A18FF',
              textTransform: 'none',
              px: 3,
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '16px',
              backgroundColor: '#8A18FF',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                backgroundColor: '#7200d6',
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
