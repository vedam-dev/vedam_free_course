import { Box } from '@mui/material';
import React from 'react';

interface VideoPlayerCardProps {
  videoUrl: string;
}

const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({ videoUrl }) => {
  const videoId = new URL(videoUrl).searchParams.get('v');

  return (
    <Box
      sx={{
        position: 'relative',
        paddingTop: '56.25%',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <iframe
        width="100%"
        height="100%"
        src={
          videoUrl.includes('watch?v=')
            ? `https://www.youtube.com/embed/${videoId}`
            : videoUrl
        }
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        title="YouTube video player"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          border: 'none',
        }}
      />
    </Box>
  );
};

export default VideoPlayerCard;