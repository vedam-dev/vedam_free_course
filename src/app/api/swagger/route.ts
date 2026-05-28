import { NextRequest, NextResponse } from 'next/server';

import { requireAdminAuth } from '@/lib/adminAuth';
import { generateAutoSwagger } from '@/lib/auto-swagger';

export async function GET(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if(authError) {
    return authError;
  }

  try {
    const spec = generateAutoSwagger();
    return NextResponse.json(spec);
  } catch(error) {
    console.error('Error generating swagger spec:', error);
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}