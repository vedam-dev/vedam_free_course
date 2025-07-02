'use client';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function UTMCaptureClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processUTMData = async () => {
      if(isProcessing) return;
      setIsProcessing(true);

      try {
        const searchParams = new URLSearchParams(window.location.search);
        const utm_source = searchParams.get('utm_source');
        const utm_medium = searchParams.get('utm_medium');
        const utm_campaign = searchParams.get('utm_campaign');

        const expires = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toUTCString();
        const setCookie = (name: string, value: string) => {
          document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Lax; Secure`;
        };

        const getCookie = (name: string): string | null => {
          const match = document.cookie
            .split('; ')
            .find((row) => row.startsWith(name + '='));
          return match ? match.split('=')[1] : null;
        };

        let visitor_token = getCookie('visitor_token');
        if(!visitor_token) {
          visitor_token = uuidv4();
          setCookie('visitor_token', visitor_token);
        }

        if(
          utm_source ||
          utm_medium ||
          utm_campaign ||
          !getCookie('utm_processed')
        ) {
          if(utm_source) setCookie('utm_source', utm_source);
          if(utm_medium) setCookie('utm_medium', utm_medium);
          if(utm_campaign) setCookie('utm_campaign', utm_campaign);

          const landing_page = window.location.pathname;
          setCookie('landing_page', landing_page);

          console.log('Sending UTM data:', {
            visitor_token,
            utm_source,
            utm_medium,
            utm_campaign,
          });

          const response = await fetch('/api/utm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              visitor_token,
              utm_source,
              utm_medium,
              utm_campaign,
            }),
          });

          console.log('API Response status:', response.status);

          if(!response.ok) {
            const errorText = await response.text();
            console.error('UTM API error response:', errorText);
            try {
              const errorData = JSON.parse(errorText);
              console.error('UTM API error data:', errorData);
            } catch(parseError) {
              console.error('Could not parse error response as JSON', parseError);
            }
          } else {
            const result = await response.json();
            console.log('UTM API response:', result);

            if(result.success) {
              console.log('UTM data captured successfully');

              setCookie('utm_processed', 'true');
            } else {
              console.error('UTM capture failed:', result.error);
            }
          }
        } else {
          console.log('No UTM parameters found and visitor already processed');
        }
      } catch(error) {
        console.error('UTM capture error:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    if(typeof window !== 'undefined') {
      processUTMData();
    }
  },[]);

  return <>{children}</>;
}
