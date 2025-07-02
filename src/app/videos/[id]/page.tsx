'use client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
  const params = useParams();
  const router = useRouter();
  const { id: shortcode } = params as { id: string };
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [groupedVideos, setGroupedVideos] = useState<Record<string, Video[]>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

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

  const handleVideoClick = (sc: string) => {
    router.push(`/videos/${sc}`);
  };

  const handleMarkCompleted = async () => {
    if(!currentVideo) return;
    const user_id = localStorage.getItem('userId');
    if(!user_id) {
      alert('You must be logged in to mark as completed.');
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
        setCompleted(true);
      } else {
        alert('Failed to mark as completed.');
      }
    } catch{
      alert('Error marking as completed.');
    }
  };

  if(loading) return <div style={{ padding: 32 }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '80vh' }}>
      {/* Main Video Player */}
      <div style={{ flex: 2, padding: 32 }}>
        {currentVideo ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton onClick={() => router.replace('/home')} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <h1 style={{ margin: 0 }}>{currentVideo.title}</h1>
            </Box>

            {/* Add video player here. currentVideo.streambaleUrl */}
            <>VIdeo player</>

            <p>{currentVideo.description}</p>
            {completed ? (<Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Typography>Completed</Typography> <CheckCircleIcon sx={{ color: 'green', fontSize: 28 }} /></Box>
            ) : (
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleMarkCompleted}>
                Mark as Completed
              </Button>
            )}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              message="Marked as completed!"
            />
          </>
        ) : (
          <div>Video not found.</div>
        )}
      </div>
      {/* Sidebar with all videos */}
      <div style={{ flex: 1, borderLeft: '1px solid #eee', padding: 24, background: '#fafafa' }}>
        <h3>All Videos</h3>
        {Object.entries(groupedVideos).map(([topic, vids]) => (
          <Accordion key={topic} defaultExpanded={true} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>{topic}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {vids.map((video) => (
                  <li
                    key={video.shortcode}
                    style={{
                      marginBottom: 8,
                      cursor: 'pointer',
                      background: video.shortcode === shortcode ? '#e0e7ff' : 'transparent',
                      borderRadius: 6,
                      padding: 8,
                      fontWeight: video.shortcode === shortcode ? 700 : 400,
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
      </div>
    </div>
  );
};

export default VideoWatchPage;