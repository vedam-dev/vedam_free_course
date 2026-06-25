import { NextRequest, NextResponse } from 'next/server';

import { createAdminSession } from '@/lib/adminSessionStore';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  const normalizedUsername = typeof username === 'string' ? username.trim() : '';
  const normalizedPassword = typeof password === 'string' ? password.trim() : '';

  const validUsername = process.env.ADMIN_USERNAME?.trim();
  const validPassword = process.env.ADMIN_PASSWORD?.trim();

  if(!validUsername || !validPassword) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if(normalizedUsername !== validUsername || normalizedPassword !== validPassword) {
    return NextResponse.json(
      { error: 'Invalid credentials.' },
      { status: 401 },
    );
  }

  const sessionId = createAdminSession(normalizedUsername);
  const response = NextResponse.json({ ok: true, sessionId });

  response.cookies.set('admin_session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return response;
}
