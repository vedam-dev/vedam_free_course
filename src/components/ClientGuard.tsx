'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ClientGuardProps {
  readonly children: ReactNode;
}
export default function ClientGuard({ children }: Readonly<ClientGuardProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if(!isMounted) return;
    if(typeof window === 'undefined') return;

    if(pathname === '/') return;
    try {
      const userId = localStorage.getItem('userId');
      if(!userId) {
        router.push('/');
      }
    } catch(error) {
      // Silently handle localStorage errors
      console.error('ClientGuard error:', error);
    }
  }, [router, pathname, isMounted]);

  return <>{children}</>;
}