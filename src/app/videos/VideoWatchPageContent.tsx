'use client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Fade,
  Skeleton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { CertificateGenerator } from '@/components/CertificateGenerator';
import LogoutButton from '@/components/LogoutButton';

import VideoPlayerCard from './VideoPlayerCard';

interface Video {
  shortcode: string;
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  embedCode?: string;
  streamableUrl?: string;
  [key: string]: unknown;
}

interface CertificateData {
  studentName: string;
  subjectName: string;
  studentEmail: string;
}

const VideoWatchPage = () => {
  const isMobile = useMediaQuery('(max-width:1200px)');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shortcode = searchParams.get('v') ?? '';
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [groupedVideos, setGroupedVideos] = useState<Record<string, Video[]>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [completed, setCompleted] = useState<boolean | undefined>(undefined);
  const [expandedTopic, setExpandedTopic] = useState<string | false>(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch('/api/content');
      const json = await res.json();
      const allVideos = (Object.values(json.data || {}) as Video[][]).flat();
      setGroupedVideos(json.data || {});
      const found = allVideos.find((v) => v.shortcode === shortcode);
      setCurrentVideo(found || null);
    };
    fetchVideos();
  }, [shortcode]);

  useEffect(() => {
    if(Object.keys(groupedVideos).length === 0) return;
    setShowSkeleton(true);
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 300);

    const allVideos = Object.values(groupedVideos).flat();
    const found = allVideos.find((v) => v.shortcode === shortcode);
    setCurrentVideo(found || null);
    return () => clearTimeout(timer);
  }, [shortcode, groupedVideos]);

  useEffect(() => {
    if(!currentVideo) return;

    const user_id = localStorage.getItem('userId');
    if(user_id && currentVideo) {
      fetch(`/api/progress?user_id=${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if(Array.isArray(data.data)) {
            const progress = data.data.find((p: unknown) => {
              if(
                typeof p === 'object' &&
                p !== null &&
                'content_id' in p &&
                'is_complete' in p
              ) {
                const prog = p as { content_id: string; is_complete: boolean };
                return prog.content_id === currentVideo.id && prog.is_complete;
              }
              return false;
            });
            setCompleted(!!progress);
          }
        });
    }
  }, [currentVideo]);

  useEffect(() => {
    if(!shortcode || Object.keys(groupedVideos).length === 0) return;
    const foundTopic = Object.entries(groupedVideos).find(([, vids]) =>
      vids.some((v) => v.shortcode === shortcode)
    )?.[0];
    if(foundTopic) setExpandedTopic(foundTopic);
  }, [shortcode, groupedVideos]);

  const handleVideoClick = (sc: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('v', sc);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleMarkCompleted = async () => {
    if(!currentVideo) return;
    const user_id = localStorage.getItem('userId');
    if(!user_id) {
      setSnackbarOpen(true);
      setSnackbarMsg('You must be logged in to mark as completed.');
      return;
    }
    const body = {
      user_id,
      content_id: currentVideo.id,
      is_complete: true,
    };
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if(res.ok) {
        const result = await res.json();

        setSnackbarOpen(true);
        setSnackbarMsg('Marked as completed!');
        setCompleted(true);

        if(result.certificateRequired && result.certificateData) {
          console.log('🎓 Topic completed! Generating certificate...');
          setSnackbarMsg('Marked as completed! Generating your certificate...');
          setCertificateData(result.certificateData);
        }
      } else {
        setSnackbarOpen(true);
        setSnackbarMsg('Failed to mark as completed.');
      }
    } catch{
      setSnackbarOpen(true);
      setSnackbarMsg('Error marking as completed.');
    }
  };

  if(isMobile) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
          paddingY: '20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px 30px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: '80%',
            maxWidth: '480px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ fontSize: '60px', marginBottom: '20px' }}>🖥️</Box>
          <Typography variant="h2" sx={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', color: 'white' }}>
            Desktop Required
          </Typography>
          <Typography variant="subtitle2" style={{ fontSize: '18px', lineHeight: '1.6', margin: '0', color: 'rgba(255, 255, 255, 0.9)' }}>
            Open in Desktop to play Video <br /> Login on Desktop
          </Typography>
        </Box>
      </Box>
    );
  }

  if(Object.keys(groupedVideos).length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', minHeight: '99vh' }}>
          <Box sx={{ flex: 2, p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
              <Skeleton variant="text" width="60%" height={40} />
            </Box>
            <Skeleton variant="rectangular" sx={{ pb: '56.25%', mb: 2, width: '100%', borderRadius: 3 }} />
            <Skeleton variant="text" sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="rectangular" sx={{ mt: 3, mb: 2, px: 3, py: 2, borderRadius: 3, boxShadow: 2, display: 'flex', alignItems: 'center', gap: 2, minWidth: 260, width: 'auto' }} height={68} />
          </Box>
          <Box sx={{
            flex: 1,
            borderLeft: '1px solid rgba(108, 16, 188, 0.15)',
            p: 3,
            background: 'rgba(248, 245, 255, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            height: '85vh',
            overflow: 'scroll',
          }}>
            <Typography component="h3"><Skeleton variant="text" width="70%" /></Typography>
            {Array.from(new Array(3)).map((_, index) => (
              <Accordion key={index} defaultExpanded={true} sx={{
                mb: 1.5,
                borderRadius: '16px !important',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(108, 16, 188, 0.12)',
                boxShadow: '0 2px 12px rgba(108, 16, 188, 0.07)',
                '&:before': { display: 'none' },
              }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}><Skeleton variant="text" width="50%" /></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {Array.from(new Array(4)).map((_, idx) => (
                      <Box component="li" key={idx} sx={{ mb: 1, p: 1 }}>
                        <Skeleton variant="text" width="90%" />
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box style={{ display: 'flex', minHeight: '99vh' }}>
      {certificateData && (
        <CertificateGenerator
          studentName={certificateData.studentName}
          subjectName={certificateData.subjectName}
          studentEmail={certificateData.studentEmail}
          onComplete={() => {
            console.log('✅ Certificate generation complete');
            setCertificateData(null);
            setSnackbarOpen(true);
            setSnackbarMsg('🎉 Certificate sent to your email!');
          }}
          onError={(error) => {
            console.error('Certificate error:', error);
            setCertificateData(null);
            setSnackbarOpen(true);
            setSnackbarMsg('Failed to send certificate. Please contact support.');
          }}
        />
      )}

      <Box style={{ flex: 2, padding: 32 }}>
        {showSkeleton || !currentVideo ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Skeleton variant="circular" width={40} height={30} sx={{ mr: 1 }} />
              <Skeleton variant="text" width="60%" height={40} />
            </Box>
            <Skeleton variant="rectangular" sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', borderRadius: 2, overflow: 'hidden' }} />
            <Skeleton variant="rectangular" sx={{ mt: 3, mb: 2, px: 3, py: 2, borderRadius: 3, boxShadow: 2, display: 'flex', alignItems: 'center', gap: 2, minWidth: 260, width: 'auto' }} height={68} />
          </>
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                <IconButton onClick={() => router.replace('/home')} sx={{ mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography
                  component="h1"
                  sx={{
                    m: 0,
                    fontSize: 32,
                    fontWeight: 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currentVideo.title}
                </Typography>
              </Box>
              <LogoutButton />
            </Box>

            <VideoPlayerCard shortcode={currentVideo.shortcode} />

            <p>{currentVideo.description}</p>
            <Box
              sx={{
                mt: 3,
                mb: 2,
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: completed ? 'rgba(46, 204, 64, 0.4)' : 'rgba(255, 255, 255, 0.45)',
                background: completed
                  ? 'rgba(46, 204, 64, 0.12)'
                  : 'rgba(255, 255, 255, 0.28)',
                boxShadow: completed
                  ? '0 8px 32px rgba(46, 204, 64, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                  : '0 8px 32px rgba(108, 16, 188, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                minWidth: 260,
                width: 'auto',
                position: 'relative',
                overflow: 'hidden',
                height: 68,
                transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
              }}
            >
              {completed == undefined ? null : (
                <>
                  <Fade in={completed} timeout={400} unmountOnExit>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        px: 3,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Your Progress:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ color: '#2ecc40', fontSize: 24, mr: 1 }} />
                        <Typography sx={{ color: '#218838', opacity: 0.8, fontWeight: 600, fontSize: 20 }}>
                          Completed
                        </Typography>
                      </Box>
                    </Box>
                  </Fade>
                  <Fade in={!completed} timeout={400} unmountOnExit>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        px: 3,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: 18 }}>Your Progress:</Typography>
                      <Button
                        variant="contained"
                        onClick={handleMarkCompleted}
                        sx={{
                          fontWeight: 600,
                          fontSize: 16,
                          p: 1,
                          borderRadius: '12px',
                          background: 'rgba(251, 127, 5, 0.85)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 4px 16px rgba(251, 127, 5, 0.35)',
                          '&:hover': {
                            background: 'rgba(251, 127, 5, 0.95)',
                            boxShadow: '0 6px 20px rgba(251, 127, 5, 0.5)',
                          },
                        }}
                      >
                        Mark as Completed
                      </Button>
                    </Box>
                  </Fade>
                </>
              )}
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)} message={snackbarMsg} />
          </>
        )}
      </Box>

      <Box sx={{
        flex: 1,
        padding: '12px',
        height: '87vh',
        overflow: 'scroll',
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        borderTop: 'none',
        boxShadow: '0 8px 32px rgba(108, 16, 188, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        borderRadius: '0 0 20px 20px',
      }}>
        <h3>All Videos</h3>
        {Object.entries(groupedVideos).map(([topic, vids]) => {
          const isTopicOfCurrentVideo = vids.some((v) => v.shortcode === shortcode);

          return (
            <Accordion
              key={topic}
              expanded={expandedTopic === topic}
              onChange={(_e, isExpanded) => setExpandedTopic(isExpanded ? topic : false)}
              sx={{
                mb: 1.5,
                borderRadius: '16px !important',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${isTopicOfCurrentVideo ? 'rgba(108, 16, 188, 0.35)' : 'rgba(108, 16, 188, 0.12)'}`,
                boxShadow: isTopicOfCurrentVideo
                  ? '0 4px 20px rgba(108, 16, 188, 0.18)'
                  : '0 2px 12px rgba(108, 16, 188, 0.07)',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#6C10BC' }} />}
                sx={{
                  fontWeight: isTopicOfCurrentVideo ? 800 : 500,
                  transition: 'background 0.2s',
                  background: isTopicOfCurrentVideo ? 'rgba(108, 16, 188, 0.08)' : 'transparent',
                  '&:hover': { background: 'rgba(108, 16, 188, 0.06)' },
                }}
              >
                <Typography fontWeight={isTopicOfCurrentVideo ? 700 : 600} fontSize={18}>
                  {topic}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {vids.map((video) => {
                    const isActive = video.shortcode === shortcode;

                    return (
                      <Box
                        key={video.shortcode}
                        onClick={() => handleVideoClick(video.shortcode as string)}
                        component="li"
                        sx={{
                          mb: 1,
                          cursor: 'pointer',
                          background: isActive ? 'rgba(108, 16, 188, 0.12)' : 'transparent',
                          backdropFilter: isActive ? 'blur(8px)' : 'none',
                          WebkitBackdropFilter: isActive ? 'blur(8px)' : 'none',
                          border: `1px solid ${isActive ? 'rgba(108, 16, 188, 0.3)' : 'transparent'}`,
                          borderRadius: '12px',
                          px: 2,
                          py: 1.2,
                          fontWeight: isActive ? 600 : 400,
                          fontSize: 17,
                          color: isActive ? '#6C10BC' : 'inherit',
                          transition: 'all 0.2s',
                          '&:hover': {
                            background: isActive ? 'rgba(108, 16, 188, 0.14)' : 'rgba(108, 16, 188, 0.05)',
                            transform: 'scale(1.01)',
                            boxShadow: '0 2px 8px rgba(108, 16, 188, 0.1)',
                          },
                        }}
                      >
                        {video.title}
                      </Box>
                    );
                  })}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
        <Image
          src="/banner.jpg"
          alt="banner-image"
          width={1000}
          height={1000}
          style={{
            width: '100%',
            height: '130px',
            borderRadius: '16px',
            marginTop: '16px',
            maxHeight: '125px',
            cursor: 'pointer',
          }}
          onClick={() => window.open('https://vedam.org/?utm_source=Codesprint&utm_medium=Banner1&utm_campaign=Banner1_campusimage', '_blank')}
        />
      </Box>
    </Box>
  );
};

export default VideoWatchPage;
