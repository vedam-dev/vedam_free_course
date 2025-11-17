'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import Loading from '@/components/Loading';

const VideoWatchPageContent = dynamic(() => import('./VideoWatchPageContent'), {
  ssr: false,
  loading: () => <Loading />
});
const ResponsiveAboutSection = dynamic(() => import('./ResponsiveAboutSection'), {
  ssr: false
});

export default function VideosPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VideoWatchPageContent />
      <ResponsiveAboutSection />
    </Suspense>
  );
}
