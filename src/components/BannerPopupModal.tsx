'use client';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface BannerPopupProps {
  bannerImageUrl?: string;
  redirectUrl?: string;
  intervalSeconds?: number;
}

const BannerPopup: React.FC<BannerPopupProps> = ({
  bannerImageUrl = '/assets/bannerPopup.png',
  redirectUrl = 'https://vedam.org',
  intervalSeconds = Number(process.env.NEXT_PUBLIC_INTERVAL_SECONDS) || 300,
}) => {
  const [open, setOpen] = useState(false);
  const [shouldRecheck, setShouldRecheck] = useState(0); // Trigger for rechecking

  useEffect(() => {
    // Check if user has permanently dismissed the banner (clicked on it)
    const isPermanentlyDismissed = localStorage.getItem('bannerPermanentlyDismissed');
    if(isPermanentlyDismissed === 'true') {
      return;
    }

    // Check last shown time
    const lastShownTime = localStorage.getItem('bannerLastShown');
    const now = Date.now();
    const intervalMs = intervalSeconds * 1000;

    if(!lastShownTime || now - parseInt(lastShownTime) >= intervalMs) {
      // Show banner after a small delay on first load
      const timer = setTimeout(() => {
        setOpen(true);
        localStorage.setItem('bannerLastShown', Date.now().toString());
      }, 2000);

      return () => clearTimeout(timer);
    }

    // Set up timer to show banner again after the remaining interval
    const timeUntilNext = intervalMs - (now - parseInt(lastShownTime));
    if(timeUntilNext > 0) {
      const timer = setTimeout(() => {
        const isPermanentlyDismissed = localStorage.getItem('bannerPermanentlyDismissed');
        if(isPermanentlyDismissed !== 'true') {
          setOpen(true);
          localStorage.setItem('bannerLastShown', Date.now().toString());
        }
      }, timeUntilNext);

      return () => clearTimeout(timer);
    }
  }, [intervalSeconds, shouldRecheck]);

  const handleClose = () => {
    setOpen(false);
    // Update last shown time so it reappears after the interval
    localStorage.setItem('bannerLastShown', Date.now().toString());


    const intervalMs = intervalSeconds * 1000;
    setTimeout(() => {
      setShouldRecheck(prev => prev + 1);
    }, intervalMs);
  };

  const handleBannerClick = () => {
    localStorage.setItem('bannerPermanentlyDismissed', 'true');
    setOpen(false);
    // Redirect to URL
    window.location.href = redirectUrl;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          outline: 'none',
          maxWidth: { xs: '90%', sm: '80%', md: '700px', lg: '800px' },
          width: '100%',
          animation: 'fadeInScale 0.3s ease-out',
          '@keyframes fadeInScale': {
            '0%': {
              opacity: 0,
              transform: 'scale(0.9)',
            },
            '100%': {
              opacity: 1,
              transform: 'scale(1)',
            },
          },
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: { xs: -8, sm: -12 },
            right: { xs: -8, sm: -12 },
            backgroundColor: 'white',
            color: '#000',
            zIndex: 10,
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>

        {/* Banner Image - Clickable */}
        <Box
          onClick={handleBannerClick}
          sx={{
            width: '100%',
            cursor: 'pointer',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
        >
          <Box
            component="img"
            src={bannerImageUrl}
            alt="Banner"
            sx={{
              width: '100%',
              height: 'auto',
              display: 'block',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default BannerPopup;