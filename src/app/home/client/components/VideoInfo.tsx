'use client';

import { PlayCircleFilled } from '@mui/icons-material';
import { Box, CardMedia, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
const VideoInfo: React.FC = () => {
  return (<>

    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '900px', margin: 'auto', fontFamily: 'system-ui, sans-serif', bgcolor: '#fff', width:'1440', height:'800' }}>

      {/* Top Header Section */}
      <Box sx={{ textAlign: 'center', mb: 3,background: 'linear-gradient(180deg, #A0EBD4 -98.87%, #FFF 100%)', width:'full' }}>
        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.5px' }}>
          BROUGHT TO YOU BY
        </Typography>
        <Box
          sx={{
            borderRadius: 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '42px',
            alignSelf: 'stretch',
            justifyContent: { xs: 'center', sm: 'space-around' },
            flexWrap: 'wrap',
            maxWidth: '500px',
            margin: '8px auto 0',
          }}
        >
          {/* Vedam Logo Image */}
          <Box sx={{
            width: '263px',
            height: '104px',
            flexShrink: 0,
            aspectRatio: '263 / 104'
          }}>
            <Image
              width={262}
              height={104}
              src="/home/videoInfo/VedamLogo.png"
              alt="Vedam School of Technology Logo"

            />

          </Box>


          {/* CodeSprint Logo */}
          <Box
            sx={{
              background: 'linear-gradient(90deg, #5A02A7 0%, #8A18FF 33.74%, #C14B81 54.73%, #DD6442 75%, #F97D03 100%)',
            }}
            style={{
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#4a148c',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '60px',
                fontStyle: 'normal',
                lineHeight: 'normal',
              }}
            >
  CodeSprint
            </Typography>
          </Box>

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
    </Box>


    <Box sx={{
      background: 'linear-gradient(135deg, #4a148c 0%, #1a237e 100%)',
      borderRadius: 4,
      p: { xs: 2, md: 3 },
      color: 'white',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    }}>
      <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem', position: 'relative' } }}>
        Tech Minds Behind Vedam
      </Typography>

      <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', pt: '56.25%' /* 16:9 Aspect Ratio */ }}>
        <CardMedia
          component="video"
          image="/home/videoInfo/videoThumbnail.png"
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


      </Box>
    </Box>


  </>
  );
};

export default VideoInfo;