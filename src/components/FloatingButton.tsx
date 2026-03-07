'use client';
import { keyframes } from '@emotion/react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button } from '@mui/material';
import { useState } from 'react';

// Animation for subtle pulse effect
const pulse = keyframes`
  0% { transform: scale(0.7); }
  50% { transform: scale(0.8); }
  100% { transform: scale(0.7); }
`;

const FloatingButton = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
  };

  return (
    <Box sx={{
      position: 'fixed',
      bottom: { xs:'24px',sm:'70px' },
      right: '20px',
      zIndex: 1000,
      animation: `${pulse} 3s ease-in-out infinite`,
    }}>
      <Button
        onClick={handleClick}
        sx={{
          fontSize: 'clamp(12px, 2.5vw, 20px)',
          color: '#F9F9F9',
          background: 'linear-gradient(95.22deg, rgba(251, 127, 5, 0.82) 2.91%, rgba(108, 16, 188, 0.82) 99.18%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          boxShadow: '0px 0px 20px rgba(108, 16, 188, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          transform: isClicked ? 'translateY(4px) scale(0.98)' : 'none',
          '&:hover': {
            background: 'linear-gradient(95.22deg, rgba(251, 127, 5, 0.9) 2.91%, rgba(108, 16, 188, 0.9) 99.18%)',
            boxShadow: '0px 0px 28px rgba(108, 16, 188, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(4px) scale(0.96)',
            boxShadow: '0px 0px 10px rgba(108, 16, 188, 0.3)',
          },
        }}
        href="https://vedam.org"
        target="_blank"
        rel="noopener noreferrer"
        endIcon={<OpenInNewIcon sx={{
          color: 'white',
          transition: 'transform 0.3s ease',
          transform: 'scale(0.9)',
          '&:hover': {
            transform: 'scale(1.1)'
          }
        }} />}
      >
        Apply for VSAT 2026
      </Button>
    </Box>
  );
};

export default FloatingButton;