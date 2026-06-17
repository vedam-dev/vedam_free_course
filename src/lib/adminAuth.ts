import { NextRequest, NextResponse } from 'next/server';

const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

export function validateAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if(!adminUsername || !adminPassword) return false;
  if(!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  return username === adminUsername && password === adminPassword;
}

export function requireAdminAuth(request: NextRequest) {
  if(!validateAdminAuth(request)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Swagger Documentation"',
      },
    });
  }
  return null;
}