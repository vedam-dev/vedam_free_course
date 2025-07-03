import { Box } from '@mui/material';
<<<<<<< HEAD
=======
import Image from 'next/image';
>>>>>>> 8382c344b84f7c555862ae088003a4d9aff7d06f
import React from 'react';

interface VideoPlayerCardProps {
  shortcode: string;
}

const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({ shortcode }) => {
<<<<<<< HEAD
=======
  const sourceType = process.env.NEXT_PUBLIC_GDRIVE;
  const src =
    sourceType === 'google'
      ? `https://drive.google.com/file/d/${shortcode}/preview`
      : `https://streamable.com/e/${shortcode}`;
>>>>>>> 8382c344b84f7c555862ae088003a4d9aff7d06f

  return (
    <Box
      sx={{
        position: 'relative',
<<<<<<< HEAD
        paddingTop: '56.25%',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <iframe
        width="100%"
        height="100%"
        src={`https://streamable.com/o/${shortcode}`}
        allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture; web-share"
        title="YouTube video player"
=======
        paddingTop: '56.25%', // 16:9
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
>>>>>>> 8382c344b84f7c555862ae088003a4d9aff7d06f
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
<<<<<<< HEAD
          border: 'none',
        }}
      />
=======
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
          src="/home/videoInfo/VedamLogo.png"
          alt="Vedam Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </Box>
>>>>>>> 8382c344b84f7c555862ae088003a4d9aff7d06f
    </Box>
  );
};

<<<<<<< HEAD
export default VideoPlayerCard;
=======
export default VideoPlayerCard;
>>>>>>> 8382c344b84f7c555862ae088003a4d9aff7d06f
