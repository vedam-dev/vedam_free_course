'use client';

import { useMediaQuery } from '@mui/material';

import AboutMobileView from '../home/client/components/AboutMobileView';
import AboutUs from '../home/client/components/AboutUs';

export default function ResponsiveAboutSection() {
  const isMobile = useMediaQuery('(max-width:600px)');
  return isMobile ? <AboutMobileView /> : <AboutUs />;
}
