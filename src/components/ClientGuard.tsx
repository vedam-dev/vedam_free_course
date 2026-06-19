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
    const userId = localStorage.getItem('userId');
    if(!userId) {
      router.push('/');
    }
  }, [router, pathname]);

  return <>{children}</>;
}
