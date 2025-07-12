import { NextRequest, NextResponse } from 'next/server';

import { sendEmailService } from '../../../services/sendEmailService';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, message } = await req.json();
    if(!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await sendEmailService(to, subject, message);
    return NextResponse.json({ success: true });
  } catch(error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
