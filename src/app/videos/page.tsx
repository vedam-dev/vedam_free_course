import { Box } from '@mui/material';
import React from 'react';

import AsideVideoList from './playVideo/client/components/AsideVideoList';
import Details from './playVideo/client/components/Details';
import Header from './playVideo/client/components/Header';
import VideoPlayerCard from './playVideo/client/components/VideoPlayerCard';
const page = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
      <Header />
      <Box sx={{ width: '100%', maxWidth: 1200, display: 'flex', alignItems: 'center' }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <VideoPlayerCard videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
          <Details />

        </Box>

        <AsideVideoList />
      </Box>




    </Box>
  );
};

export default page;