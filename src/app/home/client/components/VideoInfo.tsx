import { PlayCircleFilled } from '@mui/icons-material';
import { Box, CardMedia, IconButton, Typography } from '@mui/material';
import React from 'react';

// Define the props for the BrandLogo component
interface BrandLogoProps {
  brand: 'google' | 'microsoft';
}

// A simple component to replicate the brand logos from the screenshot
const BrandLogo: React.FC<BrandLogoProps> = ({ brand }) => {
  // Define styles for different brands
  const styles: { [key in BrandLogoProps['brand']]: { text: string; color: string } } = {
    google: {
      text: '↳ Google',
      color: '#4285F4', // This color is not used but kept for reference
    },
    microsoft: {
      text: '↳ Microsoft',
      color: '#00A4EF', // This color is not used but kept for reference
    },
  };

  const selectedBrand = styles[brand];

  return (
    <Typography
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        color: 'black',
        fontWeight: 500,
        p: '2px 10px',
        borderRadius: 1,
        fontSize: '0.8rem',
        display: 'inline-flex',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      {selectedBrand.text}
    </Typography>
  );
};

const VideoInfo: React.FC = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '900px', margin: 'auto', fontFamily: 'system-ui, sans-serif', bgcolor: '#fff' }}>

      {/* Top Header Section */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.5px' }}>
          BROUGHT TO YOU BY
        </Typography>
        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'space-around' },
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            maxWidth: '500px',
            margin: '8px auto 0',
          }}
        >
          {/* Vedam Logo Image */}
          <Box
            component="img"
            src="/public/home/videoInfo/VedamLogo.png"
            alt="Vedam School of Technology Logo"
            sx={{
              height: { xs: 35, sm: 45 }, // Responsive height for the logo
              width: 'auto',
              objectFit: 'contain',
            }}
          />
          {/* CodeSprint Logo */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4a148c' }}>
            CodeSprint
          </Typography>
        </Box>
      </Box>

      {/* Text Display Section */}
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h5" component="p" sx={{ maxWidth: '650px', margin: '0 auto', fontWeight: 500, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
          Vedam School of Technology is an Advanced Tech College offering on-campus 4 year CS & AI program for <Box component="span" sx={{ color: '#dd2c00' }}>12 pass-out</Box>.
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ mt: 2 }}>
          B.Tech Degree awarded by Ajeenkya DY Patil University
        </Typography>
        <Typography variant="caption" color="text.secondary">
          UGC Approved
        </Typography>
      </Box>

      {/* Video Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4a148c 0%, #1a237e 100%)',
        borderRadius: 4,
        p: { xs: 2, md: 3 },
        color: 'white',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
          Tech Minds Behind Vedam
        </Typography>

        <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', pt: '56.25%' /* 16:9 Aspect Ratio */ }}>
          <CardMedia
            component="video"
            image="/public/home/videoInfo/videoThumbnail.png" // Sample video URL
            title="Tech Minds Behind Vedam"
            controls
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'black'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 10%, transparent 40%)',
              // Hide the play button overlay if video controls are shown
              pointerEvents: 'none',
            }}
          >
            <IconButton sx={{ color: 'rgba(255, 255, 255, 0.85)', pointerEvents: 'auto' }} aria-label="play video">
              <PlayCircleFilled sx={{ fontSize: { xs: '5rem', md: '7rem' } }} />
            </IconButton>
          </Box>

          {/* People Info Overlay */}
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 1, sm: 2 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 1,
            pointerEvents: 'none', // Allow clicks to go through to the video
          }}>
            {/* Person 1 */}
            <Box sx={{ textAlign: 'left' }}>
              <BrandLogo brand="google" />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 0.5, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                Subhesh Kumar
              </Typography>
              <Typography variant="caption" sx={{ color: '#e0e0e0', display: { xs: 'none', sm: 'block' } }}>
                Head of Academic Delivery
              </Typography>
            </Box>

            {/* Person 2 */}
            <Box sx={{ textAlign: 'center', pb: { xs: 2, sm: 3 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                Piyush Nangru
              </Typography>
            </Box>

            {/* Person 3 */}
            <Box sx={{ textAlign: 'right' }}>
              <BrandLogo brand="microsoft" />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 0.5, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                Nishant Chahar
              </Typography>
              <Typography variant="caption" sx={{ color: '#e0e0e0', display: { xs: 'none', sm: 'block' } }}>
                Head of Program Design
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoInfo;
