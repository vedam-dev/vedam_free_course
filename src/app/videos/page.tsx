'use client';
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
    <Box
      position="relative"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}
    >
      <Header />
      <Box
        position="relative"
        sx={{ width: '100%',display: 'flex', alignItems: 'center' }}>

        <Box
          position="relative"
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignSelf: 'start', top: 40, left: 0, padding: 2 }}
        >
          <VideoPlayerCard videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
          <Details title={''} />

        </Box>

        <Box
          position="relative"
          sx={{
            display: 'flex',
            // flexDirection: 'column',
            width: '50%',
            alignSelf: 'start',
            top: 40,
            left: 0,
            padding: 1,
            height: 'calc(100vh + 20px)',
            overflowY: 'auto',
            // overflowX: '',
            // Enables vertical scrolling
            // '&::-webkit-scrollbar': { // Optional: customize scrollbar
            //   // width: '6px',
            // },
            // '&::-webkit-scrollbar-thumb': {
            //   backgroundColor: 'rgba(0,0,0,0.2)',
            //   borderRadius: '3px',
            // }
          }}
        >
          <AsideVideoList videos={videos} />
        </Box>

      </Box>




    </Box>
  );
};

export default page;