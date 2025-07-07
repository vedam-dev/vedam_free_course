

import { Suspense } from 'react';

import Loading from '@/components/Loading';

import VideoWatchPage from './page';
<Suspense fallback={<Loading/>}>
  <VideoWatchPage />
</Suspense>;