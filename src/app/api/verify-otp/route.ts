import { NextRequest, NextResponse } from 'next/server';

import { generateVerificationToken } from '@/lib/otpVerification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, otp, reqId } = body;

    if (!mobile || !otp || !reqId) {
      return NextResponse.json(
        { error: 'Mobile number, OTP, and reqId are required' },
        { status: 400 },
      );
    }

    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 400 },
      );
    }

    if (!/^\d{4,6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
        { status: 400 },
      );
    }

    const authKey = process.env.MSG91_AUTH_KEY?.trim();
    const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID?.trim();

    if (!authKey || !widgetId) {
      console.error('MSG91 widget credentials not configured');
      return NextResponse.json(
        { error: 'OTP verification service not configured' },
        { status: 500 },
      );
    }

    const verificationUrl = 'https://api.msg91.com/api/v5/widget/verifyOtp';

    const verificationResponse = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        widgetId,
        otp,
        reqId,
        tokenAuth: authKey,
      }),
    });

    const verificationData = await verificationResponse.json();

    if (
      verificationResponse.ok &&
      (verificationData.type === 'success' ||
        verificationData.success === true ||
        verificationData.status === 'success' ||
        verificationData['access-token'])
    ) {
      const verificationToken = generateVerificationToken(mobile);

      return NextResponse.json(
        {
          success: true,
          message: 'OTP verified successfully',
          verificationToken,
          mobile,
        },
        { status: 200 },
      );
    }
    console.log({
      status: verificationResponse.status,
      body: verificationData,
    });
    return NextResponse.json(
      {
        error: verificationData.message || verificationData.error || 'Invalid OTP',
        success: false,
      },
      { status: 400 },
    );
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 },
    );
  }
}
