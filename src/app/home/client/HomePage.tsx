
import React from 'react';

import AboutUs from './components/AboutUs';
import Certificate from './components/Certificate';
import Faq from './components/Faq';
import Landing from './components/Landing';
import Outcomes from './components/Outcomes';
import VideoCourses from './components/VideoCourses';
import VideoInfo from './components/VideoInfo';
// import AboutMobileView from './components/AboutMobileView';


const HomePage = () => {
  return (
    <>
      <Landing />
      <AboutUs/>
      {/* <AboutMobileView/> */}
      <VideoInfo/>
      <VideoCourses/>
      <Certificate/>
      <Outcomes/>
      <Faq/>
    </>
  );
};

export default HomePage;