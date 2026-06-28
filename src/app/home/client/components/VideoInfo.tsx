'use client';

import { PlayCircleFilled } from '@mui/icons-material';
import { Box, Container, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const VIDEO_THUMBNAIL_URL =
  '/home/codesprint-thumbnail.webp';

const VideoInfo: React.FC = () => {
  const [playing, setPlaying] = React.useState(false);

  const handlePlayVideo = () => {
    setPlaying(true);
    console.log('Video is playing');
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          background:
            'linear-gradient(180deg, #AEF3F1 0%, #E9FBF8 42%, #FFFFFF 76%)',
          bgcolor: '#fff',
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: '1280px',
            px: { xs: 2.5, sm: 3, md: 4 },
            pt: { xs: 5.5, sm: 7, md: 18 },
            pb: { xs: 7, sm: 9, md: 24 },
          }}
        >
          {/* Top Header Section */}
          <Box
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              component="p"
              sx={{
                color: '#45484F',
                fontSize: { xs: 15, sm: 18, md: 22 },
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: 0,
                m: 0,
              }}
            >
              BROUGHT TO YOU BY
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                gap: { xs: 1.5, sm: 2.5, md: 4.5 },
                mt: { xs: 3, sm: 4.5, md: 10 },
              }}
            >
              {/* Vedam Logo Image */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 146, sm: 250, md: 352 },
                  flex: '0 1 auto',
                }}
              >
                <Image
                  width={3408}
                  height={1102}
                  src="/home/videoInfo/VedamLogoTight.png"
                  alt="Vedam School of Technology Logo"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                  sizes="(max-width: 600px) 146px, (max-width: 900px) 250px, 352px"
                  priority
                />
              </Box>

              {/* Divider Line */}
              <Box
                sx={{
                  width: '1px',
                  height: { xs: 62, sm: 86, md: 120 },
                  bgcolor: '#AEB8BC',
                  flex: '0 0 1px',
                }}
              />

              {/* CodeSprint Logo */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 0,
                }}
              >
                <Typography
                  component="p"
                  sx={{
                    fontWeight: 800,
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: { xs: 30, sm: 52, md: 76 },
                    lineHeight: 1,
                    background:
                      'linear-gradient(90deg, #6200D4 0%, #8F16FC 31%, #C74787 57%, #DF6240 78%, #FF7C00 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent',
                    whiteSpace: 'nowrap',
                    m: 0,
                  }}
                >
                  CodeSprint
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Text Display Section */}
          <Box
            sx={{
              textAlign: 'center',
              mt: { xs: 4.5, sm: 7, md: 10 },
            }}
          >
            <Typography
              component="p"
              sx={{
                color: '#1D1D20',
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                fontSize: { xs: 25, sm: 34, md: 46 },
                lineHeight: { xs: 1.26, sm: 1.28, md: 1.26 },
                m: '0 auto',
                maxWidth: '1180px',
              }}
            >
              <Box component="span" sx={{ display: 'block' }}>
                Vedam School of Technology is an Advanced Tech
              </Box>
              <Box component="span" sx={{ display: 'block' }}>
                College offering on-campus 4 year CS & AI program
              </Box>
              <Box component="span" sx={{ display: 'block' }}>
                for{' '}
                <Box component="span" sx={{ color: '#6A00E8', fontWeight: 800 }}>
                  12 pass-out
                </Box>
                .
              </Box>
            </Typography>
            <Typography
              component="p"
              sx={{
                color: '#1D1D20',
                mt: { xs: 4, sm: 5.5, md: 7 },
                mb: { xs: 2.5, sm: 3, md: 4 },
                fontWeight: 700,
                fontFamily: 'Outfit, sans-serif',
                fontSize: { xs: 21, sm: 28, md: 36 },
                lineHeight: 1.2,
              }}
            >
              B.Tech Degree awarded by UGC Approved Universities
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Image
                src="/home/videoInfo/university-logos.png"
                alt="Ajeenkya DY Patil University and Sushant University"
                width={1385}
                height={300}
                style={{
                  width: 'min(480px, 100%)',
                  height: 'auto',
                }}
                sizes="(max-width: 600px) calc(100vw - 40px), 480px"
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* video section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            background: 'rgba(137, 0, 255, 0.72)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 4,
            p: { xs: 1, md: 1.5 },
            color: 'white',
            boxShadow: '0 8px 40px rgba(137, 0, 255, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              pt: '56.25%',
            }}
          >
            {playing ? (
              <iframe
                src="https://www.youtube.com/embed/vhf1ApCTKY8?si=VpQFQESryXAuR0_L&autoplay=1"
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
                  borderRadius: 4,
                  background: '#000',
                  border: 'none',
                }}
              />
            ) : (
              <>
                <Box
                  component="img"
                  src={VIDEO_THUMBNAIL_URL}
                  alt="Tech Minds Behind Vedam"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 4,
                    background: '#000',
                    display: 'block',
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
                    background:
                      'linear-gradient(to top, rgba(0, 0, 0, 0.8) 10%, transparent 40%)',
                    pointerEvents: 'none',
                  }}
                >
                  <IconButton
                    sx={{
                      color: 'rgba(255, 255, 255, 0.85)',
                      pointerEvents: 'auto',
                    }}
                    aria-label="play video"
                    onClick={handlePlayVideo}
                  >
                    <PlayCircleFilled
                      sx={{ fontSize: { xs: '5rem', md: '7rem' } }}
                    />
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
