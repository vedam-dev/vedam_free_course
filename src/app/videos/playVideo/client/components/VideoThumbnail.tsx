'use client';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React from 'react';

interface Video {
  thumbnailUrl: string;
  title: string;
  duration?: string;
}

interface User {
  username?: string;
  [key: string]: number | string| undefined ;
}

interface Channel {
  channelName?: string;
  [key: string]: number | string | undefined;
}

interface VideoThumbnailProps {
  video: Video;
  className?: string;
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
  isOwner?: boolean;
  channel?: Channel;
  user?: User;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  video,
  className
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  return (
    <Card
      sx={{
        width: isMobile ? '100%' : 300,
        m: 1,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: theme.shadows[6],
        },
        ...(className ? { className } : {}),
      }}
      elevation={2}
    >
      <Box sx={{ position: 'relative' }}>
        {video.duration && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              px: 0.5,
              py: 0.1,
              borderRadius: 1,
              typography: 'caption',
            }}
          >
            {video.duration}
          </Box>
        )}
      </Box>

      <CardContent sx={{ display: 'flex', pt: 1, pb: '8px !important' }}>
        <Avatar sx={{ mr: 1, width: 36, height: 36 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" component="h3" noWrap>
            {video.title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoThumbnail;