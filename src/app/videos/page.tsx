// app/videos/page.tsx
import { Suspense } from 'react';

import Loading from '@/components/Loading';

import ResponsiveAboutSection from './ResponsiveAboutSection';
import VideoWatchPageContent from './VideoWatchPageContent';


export default function VideosPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VideoWatchPageContent />
      <ResponsiveAboutSection/>
    </Suspense>
  );
}