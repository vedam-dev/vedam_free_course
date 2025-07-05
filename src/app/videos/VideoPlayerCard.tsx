import { Box } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface VideoPlayerCardProps {
  shortcode: string;
}

const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({ shortcode }) => {
  const sourceType = process.env.NEXT_PUBLIC_GDRIVE;
  const src =
    sourceType === 'google'
      ? `https://drive.google.com/file/d/${shortcode}/preview`
      : `https://streamable.com/e/${shortcode}`;

  return (
    <Box
      sx={{
        position: 'relative',
        paddingTop: '56.25%',
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'black',
      }}
    >
      <iframe
        src={src}
        title="Video player"
        allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 40,
          height: 40,
          zIndex: 2,
          pointerEvents: 'auto',
          background: 'transparent',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 40,
          height: 40,
          zIndex: 3,
          pointerEvents: 'none',
          background: 'white',
        }}
      >
        <Image
          src="https://acjlsquedaotbhbxmtee.supabase.co/storage/v1/object/public/vedam-website-assets/images/home/logo.png"
          alt="Vedam Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </Box>
    </Box>
  );
};

export default VideoPlayerCard;
