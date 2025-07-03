'use client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Fade, Typography,useMediaQuery  } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import VideoPlayerCard from '../VideoPlayerCard';

interface Video {
  shortcode: string;
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  embedCode?: string;
  streamableUrl?: string;
  topic?: string;
  [key: string]: unknown;
}

const VideoWatchPage = () => {
  const isMobile = useMediaQuery('(max-width:1200px)');
  const params = useParams();
  const router = useRouter();
  const { id: shortcode } = params as { id: string };
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [groupedVideos, setGroupedVideos] = useState<Record<string, Video[]>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [completed, setCompleted] = useState<boolean | undefined>(undefined);
  const [expandedTopic, setExpandedTopic] = useState<string | false>(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const res = await fetch('/api/content');
      const json = await res.json();
      // Flatten grouped content
      const allVideos = (Object.values(json.data || {}) as Video[][]).flat();
      setGroupedVideos(json.data || {});
      const found = allVideos.find((v) => v.shortcode === shortcode);
      setCurrentVideo(found || null);
      setLoading(false);
    };
    fetchVideos();
  }, [shortcode]);

  useEffect(() => {
    // Fetch progress for this user and video
    setLoading(true);

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
    setLoading(false);

  }, [currentVideo]);

  useEffect(() => {
    if(currentVideo && currentVideo.topic) {
      setExpandedTopic(currentVideo.topic);
    }
  }, [currentVideo]);

  const handleVideoClick = (sc: string) => {
    router.push(`/videos/${sc}`);
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

  if(loading) return <Box style={{ padding: 32 }}>Loading...</Box>;



  if(isMobile) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
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
          maxWidth: '400px',
          width: '100%'
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
            Open in Desktop to play Video : Login on Desktop
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '99vh' }}>
      {/* Main Video Player */}
      <div style={{ flex: 2, padding: 16 }}>
        {currentVideo ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton onClick={() => router.replace('/home')} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <h1 style={{ margin: 0 }}>{currentVideo.title}</h1>
            </Box>

            <VideoPlayerCard shortcode={currentVideo.shortcode}/>

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
                width:'auto',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {completed == undefined ? null :
                <><Fade in={completed} timeout={400} unmountOnExit>
                  <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', left: 0, right: 0, justifyContent: 'space-between',px:1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
                      Your Progress :
                    </Typography>
                    <Box sx={{ display:'flex',alignItems:'center' }}>
                      <CheckCircleIcon sx={{ color: '#2ecc40', fontSize: 24, mr: 1 }} />
                      <Typography sx={{ color: '#218838',opacity:0.8, fontWeight: 600, fontSize: 20 }}>
                      Completed
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
                <Fade in={!completed} timeout={400} unmountOnExit>
                  <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', left: 0, right: 0, justifyContent: 'space-between',px:1 }}>
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
                        boxShadow: '0 2px 8px #0001',
                      }}
                      onClick={handleMarkCompleted}
                    >
                        Mark as Completed
                    </Button>
                  </Box>
                </Fade></>}
            </Box>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              message={snackbarMsg}
            />
          </>
        ) : (
          <Box>Video not found.</Box>
        )}
      </div>
      {/* Sidebar with all videos */}
      <Box
        sx={{
          flex: 1,
          borderLeft: '1px solid #eee',
          p: 3,
          background: '#fff',
          height: '85vh',
          overflow: 'scroll',
          scrollbarWidth: 'none',
          borderRadius: { md: '24px', xs: '0' },
          boxShadow: { md: 3, xs: 0 },
          mt: { md: 4, xs: 0 },
          mx: { md: 2, xs: 0 },
          fontFamily: 'Outfit, sans-serif',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: '#272727',
            fontFamily: 'Outfit, sans-serif',
            letterSpacing: 0.5,
          }}
        >
          All Videos
        </Typography>
        {Object.entries(groupedVideos).map(([topic, vids]) => (
          <Accordion
            key={topic}
            expanded={expandedTopic === topic}
            onChange={(_e, isExpanded) => setExpandedTopic(isExpanded ? topic : false)}
            sx={{
              mb: 2,
              background: '#fff',
              borderRadius: 3,
              boxShadow: expandedTopic === topic ? 3 : 1,
              border: expandedTopic === topic ? '2px solid #e0e7ff' : '1px solid #eee',
              transition: 'box-shadow 0.2s, border 0.2s',
              fontFamily: 'Outfit, sans-serif',
              '&:before': {
                display: 'none',
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: expandedTopic === topic ? '#e0e7ff' : 'transparent',
                borderRadius: 2,
                fontWeight: currentVideo && currentVideo.topic === topic ? 700 : 600,
                fontFamily: 'Outfit, sans-serif',
                color: '#272727',
                minHeight: 56,
              }}
            >
              <Typography fontWeight={currentVideo && currentVideo.topic === topic ? 700 : 600} sx={{ fontFamily: 'Outfit, sans-serif', fontSize: 18 }}>
                {topic}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, py: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {vids.map((video) => (
                  <li
                    key={video.shortcode}
                    style={{
                      marginBottom: 8,
                      cursor: 'pointer',
                      background: video.shortcode === shortcode ? '#e0e7ff' : 'transparent',
                      borderRadius: 8,
                      padding: '10px 14px',
                      fontWeight: video.shortcode === shortcode ? 700 : 400,
                      color: video.shortcode === shortcode ? '#4B2996' : '#272727',
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: 16,
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    onClick={() => handleVideoClick(video.shortcode as string)}
                  >
                    {video.title}
                  </li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </div>
  );
};

export default VideoWatchPage;
