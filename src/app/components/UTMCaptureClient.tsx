'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function UTMCaptureClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const utm_source = searchParams.get('utm_source');
    const utm_medium = searchParams.get('utm_medium');
    const utm_campaign = searchParams.get('utm_campaign');
    const utm_term = searchParams.get('utm_term');
    const utm_content = searchParams.get('utm_content');

    if(utm_source) {
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `visitor_token=${uuidv4()}; path=/; expires=${expires}`;
      if(utm_source) document.cookie = `utm_source=${utm_source}; path=/; expires=${expires}`;
      if(utm_medium) document.cookie = `utm_medium=${utm_medium}; path=/; expires=${expires}`;
      if(utm_campaign) document.cookie = `utm_campaign=${utm_campaign}; path=/; expires=${expires}`;
      document.cookie = `landing_page=${window.location.pathname}; path=/; expires=${expires}`;

    }
  }, []);

  return <>{children}</>;
}
