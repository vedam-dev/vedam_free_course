import { Box, Typography } from '@mui/material';
import React from 'react';

import { VideoList } from '../videoTypes';

import VideoThumbnail from './VideoThumbnail';

const AsideVideoList = ({ videos }: { videos: VideoList }) => {
  return (
    <Box>
      <Box>
        <Box
          sx={{
            padding: 2,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderBottom: '1px solid #ccc',
          }}
        >
          <Typography variant="h6" component="div">
            Recommended Videos
          </Typography>
        </Box>
      </Box>
      {videos.map((video) => (
        <VideoThumbnail key={video.id} video={video} />
      ))}
    </Box>
  );
};

export default AsideVideoList;