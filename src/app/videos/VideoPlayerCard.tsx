import { Box } from '@mui/material';
import React from 'react';

interface VideoPlayerCardProps {
  shortcode: string;
}

const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({ shortcode }) => {
  const sourceType = process.env.NEXT_PUBLIC_GDRIVE;

  const src = sourceType === 'google' ? `https://drive.google.com/file/d/${shortcode}/preview` : `https://streamable.com/e/${shortcode}`;

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
        src={src}
        allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture; web-share"
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
