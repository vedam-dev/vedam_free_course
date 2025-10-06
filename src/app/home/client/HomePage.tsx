
import React from 'react';

import AboutUs from './components/AboutUs';
import Certificate from './components/Certificate';
import Faq from './components/Faq';
import Landing from './components/Landing';
import Outcomes from './components/Outcomes';
import VideoCourses from './components/VideoCourses';
import VideoInfo from './components/VideoInfo';


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