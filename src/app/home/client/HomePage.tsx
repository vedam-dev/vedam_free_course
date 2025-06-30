import { Container } from '@mui/material';
import React from 'react';

import Certificate from './components/Certificate';
import Faq from './components/Faq';
import Landing from './components/Landing';
import Outcomes from './components/Outcomes';
import VideoCourses from './components/VideoCourses';
import VideoInfo from './components/VideoInfo';


const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Landing/>
      <VideoInfo/>
      <VideoCourses/>
      <Certificate/>
      <Outcomes/>
      <Faq/>
    </Container>
  );
};

export default HomePage;