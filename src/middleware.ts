import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api-docs') || pathname.startsWith('/api/swagger')) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Swagger Documentation"',
        },
      });
    }

    try {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');

      const validUsername = process.env.ADMIN_USERNAME;
      const validPassword = process.env.ADMIN_PASSWORD;
      if (!validUsername || !validPassword) {
        return new NextResponse('Server misconfiguration', { status: 500 });
      }

      if (username !== validUsername || password !== validPassword) {
        return new NextResponse('Invalid credentials', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Swagger Documentation"',
          },
        });
      }
    } catch (error) {
      return new NextResponse(`Invalid authorization header, ${error}`, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Swagger Documentation"',
        },
      });
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api-docs/:path*',
    '/api/swagger/:path*',
  ],
};