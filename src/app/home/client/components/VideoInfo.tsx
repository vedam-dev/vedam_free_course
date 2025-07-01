'use client';

import { PlayCircleFilled } from '@mui/icons-material';
import { Box, Container, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
const VideoInfo: React.FC = () => {

  const [playing, setPlaying] = React.useState(false);



  const handlePlayVideo = () => {
    setPlaying(true);
    console.log('Video is playing');

  };

  return (<>




    <Box sx={{ margin: 'auto', fontFamily: 'system-ui, sans-serif', bgcolor: '#fff', width:'1440', height:'800',background: 'linear-gradient(180deg, #A0EBD4 -98.87%, #FFF 100%)', }}>
      <Container maxWidth='lg'>
        {/* Top Header Section */}
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
            boxShadow: { xs: 0, md: '0 2px 12px rgba(160,235,212,0.15)' },
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              marginTop:2,
              paddingRight:6,
              letterSpacing: '0.5px',
              fontSize: { xs: '0.85rem', md: '1rem' },
              fontWeight: 500,
            }}
          >
          BROUGHT TO YOU BY
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: { xs: 2, md: 4 },
              width: '100%',
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            {/* Vedam Logo Image */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: { xs: 0, md: 2 },
                mb: { xs: 1, md: 0 },
                width: { xs: 120, sm: 180, md: 220 },
                minWidth: 90,
                maxWidth: 263,
              }}
            >
              <Image
                width={263}
                height={104}
                src="/home/videoInfo/VedamLogo.png"
                alt="Vedam School of Technology Logo"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
                sizes="(max-width: 600px) 120px, (max-width: 900px) 180px, 220px"
                priority
              />
            </Box>

            {/* Divider Line */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'block' },
                mx: { sm: 1, md: 2 },
              }}
            >
              <Image
                src="/home/videoInfo/Line 23 (Stroke).svg"
                width={2}
                height={70}
                alt="Divider Line"
                style={{
                  width: '2px',
                  height: '70px',
                  minWidth: '2px',
                  minHeight: '40px',
                }}
              />
            </Box>

            {/* CodeSprint Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                px: 1,
                background: 'none',
                overflow: 'visible',
                minHeight: { xs: 48, sm: 60, md: 72 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  fontStyle: 'normal',
                  lineHeight: 1.1,
                  background: 'linear-gradient(90deg, #5A02A7 0%, #8A18FF 33.74%, #C14B81 54.73%, #DD6442 75%, #F97D03 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center',
                  width: '100%',
                  display: 'inline-block',
                  overflow: 'visible',
                  whiteSpace: 'nowrap',
                }}
              >
              CodeSprint
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Text Display Section */}
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h5" component="p" sx={{ maxWidth: '650px', margin: '0 auto', fontWeight: 600, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
          Vedam School of Technology is an Advanced Tech College offering on-campus 4 year CS & AI program for <Box component="span" sx={{ color: '#7000E3' }}>12 pass-outs</Box>.
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ mt: 2, fontWeight:500, }}>
          B.Tech Degree awarded by Ajeenkya DY Patil University
          </Typography>
          <Typography variant="caption" color="text.primary">
          UGC Approved
          </Typography>
        </Box>
      </Container>
    </Box>

    {/* video section */}
    <Container maxWidth='lg'>
      <Box sx={{
        background: 'linear-gradient(135deg, #4a148c 0%, #1a237e 100%)',
        borderRadius: 3,
        p: { xs: 1, md: 2 },
        color: 'white',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>

        <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', pt: '56.25%' }}>
          {playing ? (
            <iframe
              src="https://www.youtube.com/embed/R9moRoww1s4?si=VpQFQESryXAuR0_L"
              title="Tech Minds Behind Vedam"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: 12,
                background: '#000',
                border: 'none'
              }}
            />
          ) : (
            <>
              <Box
                component="img"
                src="/home/videoInfo/videoThumbnail.png"
                alt="Tech Minds Behind Vedam"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 12,
                  background: '#000',
                  display: 'block'
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
                  pointerEvents: 'none'
                }}
              >
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.85)', pointerEvents: 'auto' }}
                  aria-label="play video"
                  onClick={handlePlayVideo}
                >
                  <PlayCircleFilled sx={{ fontSize: { xs: '5rem', md: '7rem' } }} />
                </IconButton>
              </Box>
            </>
          )}


        </Box>
      </Box>
    </Container>

  </>
  );
};

export default VideoInfo;