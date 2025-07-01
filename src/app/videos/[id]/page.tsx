'use client';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Video {
  id: string;
  shortcode: string;
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

  const handleVideoClick = (sc: string) => {
    router.push(`/videos/${sc}`);
  };

  if(loading) return <div style={{ padding: 32 }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '80vh' }}>
      {/* Main Video Player */}
      <div style={{ flex: 2, padding: 32 }}>
        {currentVideo ? (
          <>
            <h1>{currentVideo.title}</h1>
            {typeof currentVideo.embedCode === 'string' && currentVideo.embedCode ? (
              <div dangerouslySetInnerHTML={{ __html: currentVideo.embedCode as string }} />
            ) : typeof currentVideo.streamableUrl === 'string' && currentVideo.streamableUrl ? (
              <iframe
                src={currentVideo.streamableUrl}
                style={{ width: '100%', height: 400, border: 'none', borderRadius: 8 }}
                allowFullScreen
                title={currentVideo.title}
              />
            ) : (currentVideo.files && typeof currentVideo.files === 'object' && 'mp4' in currentVideo.files && currentVideo.files.mp4 && typeof currentVideo.files.mp4 === 'object' && 'url' in currentVideo.files.mp4 && typeof currentVideo.files.mp4.url === 'string') ? (
              <video controls width="100%" src={currentVideo.files.mp4.url} style={{ borderRadius: 8 }} />
            ) : (
              <div>No video file available.</div>
            )}
            <p>{currentVideo.description}</p>
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