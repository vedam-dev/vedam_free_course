
import { NextResponse } from 'next/server';

import { destroyAdminSession } from '@/lib/adminSessionStore';

export async function POST(request: Request) {
  const sessionId = request.headers.get('cookie')?.match(/(?:^|;\s*)admin_session_id=([^;]+)/)?.[1];
  destroyAdminSession(sessionId);

  const response = NextResponse.json({ success: true });

  response.cookies.delete('admin_session_id');

  return response;
}
