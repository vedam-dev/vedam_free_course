import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React from 'react';

interface Video {
  thumbnailUrl: string;
  title: string;
  duration?: string;
  views: number;
  uploadDate?: string;
  channelName?: string;
  Channel?: {
    channelName: string;
  };
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
  className,
  onEdit,
  onDelete,
  isOwner,
  channel,
  user,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatViewCount = (count: number): string => {
    if(count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if(count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const channelDisplayName =
    (channel?.channelName) ||
    user?.username ||
    (video?.channelName && video?.Channel?.channelName) ||
    (typeof video.channelName === 'string' ? video.channelName : 'Unknown Channel');

  const formatDate = (dateString?: string): string => {
    if(!dateString) return '';
    const date = new Date(dateString);
    if(isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
        <CardMedia
          component="img"
          image={video.thumbnailUrl}
          alt={video.title}
          sx={{
            aspectRatio: '16/9',
            width: '100%',
            height: 'auto',
          }}
        />
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
          <Typography variant="caption" color="text.secondary">
            {channelDisplayName}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {formatViewCount(video.views)} views • {formatDate(video.uploadDate)}
          </Typography>

          {isOwner && (
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              {onEdit && (
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(video);
                  }}
                  sx={{
                    bgcolor: 'warning.light',
                    '&:hover': { bgcolor: 'warning.main' },
                    color: 'grey.900',
                    py: 0.5,
                    fontSize: '0.75rem',
                  }}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(video);
                  }}
                  sx={{
                    bgcolor: 'error.main',
                    '&:hover': { bgcolor: 'error.dark' },
                    color: 'white',
                    py: 0.5,
                    fontSize: '0.75rem',
                  }}
                >
                  Delete
                </Button>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoThumbnail;