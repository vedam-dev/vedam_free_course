import { Box } from '@mui/material';
import React from 'react';

import AsideVideoList from './playVideo/client/components/AsideVideoList';
import Details from './playVideo/client/components/Details';
import Header from './playVideo/client/components/Header';
import VideoPlayerCard from './playVideo/client/components/VideoPlayerCard';
import videosData from './playVideo/client/SampleVideosDataArray.json';
import type { VideoList } from './playVideo/client/videoTypes';

const videos: VideoList = videosData.map((v) => ({
  ...v,
  id: String(v.id),
  views: Number(v.views),
  likes: Number(v.likes),
  dislikes: Number(v.dislikes),
  subscriberCount: Number(v.subscriberCount ?? 0),
  Channel: {
    ...v.Channel,
    id: v.Channel.id ?? `${v.Channel.channelName}`.replace(/\s+/g, '-').toLowerCase(),
    avatar: v.Channel.avatar ?? '',
  },
}));



const page = () => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
      <Header />
      <Box sx={{ width: '100%', maxWidth: 1200, display: 'flex', alignItems: 'center' }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignSelf: 'start' }}>
          <VideoPlayerCard videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
          <Details title={''} />

        </Box>

        <AsideVideoList videos={videos} />
      </Box>




    </Box>
  );
};

export default page;