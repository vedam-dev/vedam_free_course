import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
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

  // ── Admin-gated routes ───────────────────────────────────────────────────
  const adminRoutes = [
    '/admin',
    '/upload',
    '/analytics',
    '/api/admin',
    '/api/users',     
    '/api/analytics', 
  ];
  const publicRoutes = ['/admin/login', '/api/admin/login'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  if(isAdminRoute && !publicRoutes.includes(pathname)) {
    const isAuthenticated = req.cookies.get('admin_session')?.value === 'true';
    if(!isAuthenticated) {
      return pathname.startsWith('/api/')
        ? NextResponse.json({ error: 'Unauthorized – admin login required' }, { status: 401 })
        : NextResponse.redirect(new URL(`/admin/login?next=${pathname}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/upload/:path*',
    '/analytics/:path*',
    '/api/admin/:path*',
    '/api/users',       // protect user PII endpoint
    '/api/analytics',   // protect analytics/UTM endpoint
    '/api-docs/:path*',
    '/api/swagger/:path*',
  ],
};