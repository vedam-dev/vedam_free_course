import { NextRequest, NextResponse } from 'next/server';

import { sendCertificateEmail } from '../../../services/sendCertificateEmail';

export async function POST(req: NextRequest) {
  try {
    const { studentName, subjectName, studentEmail } = await req.json();

    // Validate required fields
    if(!studentName || !subjectName || !studentEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: studentName, subjectName, studentEmail' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(studentEmail)) {
      return NextResponse.json(
        { error: 'Invalid student email format' },
        { status: 400 }
      );
    }

    console.log('Sending certificate to:', studentEmail);

    await sendCertificateEmail({
      studentName,
      subjectName,
      studentEmail
    });

    return NextResponse.json({
      success: true,
      message: 'Certificate sent successfully'
    });

  } catch(error) {
    console.error('Certificate send error:', error);
    return NextResponse.json({
      error: 'Failed to send certificate',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}