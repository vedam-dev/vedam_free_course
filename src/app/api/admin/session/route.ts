import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { isAdminSessionValid } from '@/lib/adminSessionStore';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session_id')?.value;
  const authenticated = await isAdminSessionValid(token);

  return NextResponse.json({ authenticated });
}
