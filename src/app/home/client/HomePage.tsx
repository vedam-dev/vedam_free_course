
import React from 'react';

import Certificate from './components/Certificate';
import Faq from './components/Faq';
import Landing from './components/Landing';
import Outcomes from './components/Outcomes';
import VideoCourses from './components/VideoCourses';
import VideoInfo from './components/VideoInfo';
import AboutUs from './components/AboutUs';


const HomePage = () => {
  return (
    <>
      <Landing />
      <AboutUs/>
      <VideoInfo/>
      <VideoCourses/>
      <Certificate/>
      <Outcomes/>
      <Faq/>
    </>
  );
};

export default HomePage;