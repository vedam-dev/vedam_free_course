import { PlayCircleFilled } from '@mui/icons-material';
import { Box, CardMedia, IconButton, Typography } from '@mui/material';
// import Image from 'next/image';
import React from 'react';
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
            src="./VedamLogo.png"
            alt="Vedam School of Technology Logo"
            sx={{
              height: { xs: 35, sm: 45 },
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
          Vedam School of Technology is an Advanced Tech College offering on-campus 4 year CS & AI program for <Box component="span" sx={{ color: '#dd2c00' }}>12 pass-outs</Box>.
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
            image="/public/home/videoInfo/videoThumbnail.png"
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
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            pointerEvents: 'none',
          }}>
            {/* Organizations Row */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%'
            }}>
              <Typography variant="caption" sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                color: 'black',
                fontWeight: 500,
                p: '2px 10px',
                borderRadius: 1,
                fontSize: '0.8rem',
              }}>
                Google
              </Typography>

              <Typography variant="caption" sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                color: 'black',
                fontWeight: 500,
                p: '2px 10px',
                borderRadius: 1,
                fontSize: '0.8rem',
              }}>
                Vedam
              </Typography>

              <Typography variant="caption" sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                color: 'black',
                fontWeight: 500,
                p: '2px 10px',
                borderRadius: 1,
                fontSize: '0.8rem',
              }}>
                Sword Technology
              </Typography>
            </Box>

            {/* Names Row */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%'
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Sudhesh Kumar
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Piyush Nangru
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Nishant Chahar
              </Typography>
            </Box>

            {/* Centered Designation */}
            <Box sx={{
              textAlign: 'center',
              mt: 1,
              width: '100%'
            }}>
              <Typography variant="caption" sx={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.85rem'
              }}>
                Head of Academic Delivery
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoInfo;