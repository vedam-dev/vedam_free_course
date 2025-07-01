import { Box } from '@mui/material';
import React from 'react';

import { VideoList } from '../videoTypes';

import VideoThumbnail from './VideoThumbnail';

const AsideVideoList = ({ videos }: { videos: VideoList }) => {
  return (
    <Box>
      {videos.map((video) => (
        <VideoThumbnail key={video.id} video={video} />
      ))}
    </Box>
  );
};

export default AsideVideoList;