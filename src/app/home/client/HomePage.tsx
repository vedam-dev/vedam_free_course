'use client';

import { useMediaQuery } from '@mui/material';
import React from 'react';

import AboutMobileView from './components/AboutMobileView';
import AboutUs from './components/AboutUs';
import Certificate from './components/Certificate';
import Faq from './components/Faq';
import Landing from './components/Landing';
import Outcomes from './components/Outcomes';
import VideoCourses from './components/VideoCourses';
import VideoInfo from './components/VideoInfo';

const HomePage = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <Landing />
      {isMobile ? <AboutMobileView /> : <AboutUs />}
      <VideoInfo />
      <VideoCourses />
      <Certificate />
      <Outcomes />
      <Faq />
    </>
  );
};

export default HomePage;
