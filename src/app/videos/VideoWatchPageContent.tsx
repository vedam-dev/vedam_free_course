'use client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Fade, Skeleton,Typography, useMediaQuery  } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import { usePathname, useRouter,useSearchParams  } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch('/api/content');
      const json = await res.json();
      // Flatten grouped content
      const allVideos = (Object.values(json.data || {}) as Video[][]).flat();
      setGroupedVideos(json.data || {});
      const found = allVideos.find((v) => v.shortcode === shortcode);
      setCurrentVideo(found || null);
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    if(Object.keys(groupedVideos).length === 0) return;

    const allVideos = Object.values(groupedVideos).flat();
    const found = allVideos.find(v => v.shortcode === shortcode);
    setCurrentVideo(found || null);
  }, [shortcode, groupedVideos]);

  useEffect(() => {
    // Fetch progress for this user and video
    if(!currentVideo) return;

    const user_id = localStorage.getItem('userId');
    if(user_id && currentVideo) {
      fetch(`/api/progress?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => {
          if(Array.isArray(data.data)) {
            const progress = data.data.find((p: unknown) => {
              if(
                typeof p === 'object' &&
                p !== null &&
                'content_id' in p &&
                'is_complete' in p
              ) {
                const prog = p as { content_id: string; is_complete: boolean };
                return (
                  prog.content_id === currentVideo.id && prog.is_complete
                );
              }
              return false;
            });
            setCompleted(!!progress);
          }
        });
    }

  }, [currentVideo]);

  // Find the topic containing the current video by shortcode
  useEffect(() => {
    if(!shortcode || Object.keys(groupedVideos).length === 0) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const foundTopic = Object.entries(groupedVideos).find(([topic, vids]) =>
      vids.some(v => v.shortcode === shortcode)
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
        setSnackbarOpen(true);
        setSnackbarMsg('Marked as completed!');
        setCompleted(true);
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
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width:'100%',
        paddingY: '20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px 30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: '80%',
          maxWidth:'480px',
          display:'flex',
          flexDirection:'column'
        }}>
          <Box sx={{
            fontSize: '60px',
            marginBottom: '20px'
          }}>
            🖥️
          </Box>
          <Typography variant='h2' sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: 'white'
          }}>
            Desktop Required
          </Typography>
          <Typography variant='subtitle2' style={{
            fontSize: '18px',
            lineHeight: '1.6',
            margin: '0',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            Open in Desktop to play Video <br/> Login on Desktop
          </Typography>
        </Box>
      </Box>
    );
  }

  if(Object.keys(groupedVideos).length === 0) {
    return <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: 'flex',
          minHeight: '99vh',
        }}
      >
        <Box
          sx={{
            flex: 2,
            p: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
            <Skeleton variant="text" width="60%" height={40} />
          </Box>

          <Skeleton
            variant="rectangular"
            sx={{ pb: '56.25%', mb: 2, width: '100%', borderRadius:3 }}
          />

          <Skeleton variant="text" sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" />

          <Skeleton
            variant="rectangular"
            sx={{
              mt: 3,
              mb: 2,
              px: 3,
              py: 1,
              borderRadius: 3,
              boxShadow: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minHeight: 36,
              minWidth: 260,
              width: 'auto',
            }}
            height={60}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            borderLeft: '1px solid #eee',
            p: 3,
            background: '#fafafa',
            height: '85vh',
            overflow: 'scroll',
          }}
        >
          <Typography component="h3">
            <Skeleton variant="text" width="70%" />
          </Typography>
          {Array.from(new Array(3)).map((_, index) => (
            <Accordion key={index} defaultExpanded={true} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>
                  <Skeleton variant="text" width="50%" />
                </Typography>
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
    </Box>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '99vh',
      }}
    >
      <Box
        sx={{
          flex: 2,
          p: 4,
        }}
      >
        {currentVideo ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton onClick={() => router.replace('/home')} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" component="h1" sx={{ m: 0 }}>
                {currentVideo.title}
              </Typography>
            </Box>

            <VideoPlayerCard shortcode={currentVideo.shortcode} />

            <Typography variant="body1" sx={{ mt: 2 }}>
              {currentVideo.description}
            </Typography>
            <Box
              sx={{
                mt: 3,
                mb: 2,
                px: 3,
                py: 1,
                borderRadius: 3,
                boxShadow: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: completed ? '#e6f9ed' : '#f5f5f5',
                minHeight: 36,
                minWidth: 260,
                width: 'auto',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {completed === undefined ? null : (
                <>
                  <Fade in={completed} timeout={400} unmountOnExit>
                    <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', left: 0, right: 0, justifyContent: 'space-between', px: 1 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
                      Your Progress :
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ color: '#2ecc40', fontSize: 24, mr: 1 }} />
                        <Typography sx={{ color: '#218838', opacity: 0.8, fontWeight: 600, fontSize: 20 }}>
                        Completed
                        </Typography>
                      </Box>
                    </Box>
                  </Fade>
                  <Fade in={!completed} timeout={400} unmountOnExit>
                    <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', left: 0, right: 0, justifyContent: 'space-between', px: 1 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
                      Your Progress :
                      </Typography>
                      <Button
                        variant="contained"
                        color="warning"
                        sx={{
                          fontWeight: 600,
                          fontSize: 16,
                          p: 1,
                          my: 1.5,
                          borderRadius: 3,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        }}
                        onClick={handleMarkCompleted}
                      >
                      Mark as Completed
                      </Button>
                    </Box>
                  </Fade>
                </>
              )}
            </Box>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              message={snackbarMsg}
            />
          </>
        ) : (
          <Box>
            <Typography variant="h6">Video not found.</Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          borderLeft: '1px solid #eee',
          p: 3,
          background: '#fafafa',
          height: '85vh',
          overflow: 'scroll',
        }}
      >
        <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
        All Videos
        </Typography>
        {Object.entries(groupedVideos).map(([topic, vids]) => (
          <Accordion key={topic} defaultExpanded={true} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>{topic}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {vids.map((video) => (
                  <Box
                    component="li"
                    key={video.shortcode}
                    sx={{
                      mb: 1,
                      cursor: 'pointer',
                      background: video.shortcode === shortcode ? '#e0e7ff' : 'transparent',
                      borderRadius: 1.5,
                      p: 1,
                      fontWeight: video.shortcode === shortcode ? 800 : 400,
                      '&:hover': {
                        backgroundColor: video.shortcode === shortcode ? '#e0e7ff' : 'grey.100',
                      },
                    }}
                    onClick={() => handleVideoClick(video.shortcode)}
                  >
                    {video.title}
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default VideoWatchPage;
