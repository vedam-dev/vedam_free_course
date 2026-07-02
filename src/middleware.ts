import { NextRequest, NextResponse } from 'next/server';

import { isAdminPagePath } from '@/lib/adminRoutes';
import { isAdminSessionValid } from '@/lib/adminSessionStore';

export async function middleware(req: NextRequest) {
  if(process.env.NODE_ENV === 'development') {
    const host = req.headers.get('host');
    const isBareLocalhost = host?.startsWith('localhost');

    if(isBareLocalhost) {
      const devHost = process.env.NEXT_PUBLIC_DEV_HOST?.trim() || 'vedam.localhost';
      const redirectUrl = new URL(req.url);

      redirectUrl.hostname = devHost;

      return NextResponse.redirect(redirectUrl);
    }
  }

  console.log('MIDDLEWARE HIT:', req.nextUrl.pathname);
  const { pathname } = req.nextUrl;

  // ── Swagger ──────────────────────────────────────────────────────────────
  if(pathname.startsWith('/api-docs') || pathname.startsWith('/api/swagger')) {
    const authHeader = req.headers.get('authorization');
    const swaggerUsername = process.env.SWAGGER_USERNAME;
    const swaggerPassword = process.env.SWAGGER_PASSWORD;

    if(!swaggerUsername || !swaggerPassword) {
      return new NextResponse('Server misconfiguration', { status: 500 });
    }

    if(!authHeader?.startsWith('Basic ')) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="API Documentation"' },
      });
    }

    const [username, ...rest] = Buffer.from(authHeader.split(' ')[1], 'base64')
      .toString('utf-8')
      .split(':');
    const password = rest.join(':');

    if(username !== swaggerUsername || password !== swaggerPassword) {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="API Documentation"' },
      });
    }

    return NextResponse.next();
  }

  // ── Admin-gated routes ─────────────────────────────────────────────────
  const sessionId = req.cookies.get('admin_session_id')?.value;
  const isAuthenticated = await isAdminSessionValid(sessionId);

  if(pathname === '/login') {
    const AdminUrl = new URL('/admin', req.url);
    if(isAuthenticated) {
      console.log('authenticated');
      return NextResponse.redirect(AdminUrl);
    }
    return NextResponse.next();
  }

  if(pathname === '/admin') {
    if(!isAuthenticated) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('next', '/admin');
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if(pathname.startsWith('/admin/')) {
    console.log('cookies:', req.cookies.getAll());
    console.log('sessionId:', req.cookies.get('admin_session_id')?.value);
    if(!isAuthenticated) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if(isAdminPagePath(pathname)) {
    if(!isAuthenticated) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
    '/login',
    '/admin',
    '/admin/:path*',
    '/analytics',
    '/upload',
    '/upload/:path*',
    '/api-docs/:path*',
    '/api/swagger/:path*',
  ],
};
