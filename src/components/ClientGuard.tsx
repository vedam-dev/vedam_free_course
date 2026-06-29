'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ClientGuardProps {
  readonly children: ReactNode;
}

export default function ClientGuard({ children }: Readonly<ClientGuardProps>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if(pathname === '/' || pathname === '/login' || pathname.startsWith('/admin')) return;

    const checkAccess = async () => {
      const userId = localStorage.getItem('userId');
      if(userId) return;

      try {
        const response = await fetch('/api/admin/session');
        if(response.ok) {
          const data = await response.json();
          if(data.authenticated) return;
        }
      } catch{
        // Fall through to user redirect.
      }

      router.push('/');
    };

    checkAccess();
  }, [router, pathname]);

  return <>{children}</>;
}
