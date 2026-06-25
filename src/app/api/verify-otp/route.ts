import { NextRequest, NextResponse } from 'next/server';

import { generateVerificationToken } from '@/lib/otpVerification';

/**
 * Server-side OTP verification using MSG91 API
 * This endpoint verifies the OTP with MSG91's servers before allowing user registration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, otp } = body;

    if(!mobile || !otp) {
      return NextResponse.json(
        { error: 'Mobile number and OTP are required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    if(!/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 400 }
      );
    }

    // Validate OTP format
    if(!/^\d{4,6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
        { status: 400 }
      );
    }

    const bypassOtp = process.env.NEXT_PUBLIC_BYPASS_OTP === 'true';
    if(bypassOtp && (request.nextUrl.hostname === 'localhost')) {
      if(otp !== '1234') {
        return NextResponse.json(
          { error: 'Invalid OTP', success: false },
          { status: 400 }
        );
      }

      const verificationToken = generateVerificationToken(mobile);

      return NextResponse.json(
        {
          success: true,
          message: 'OTP verified successfully',
          verificationToken,
          mobile,
          bypass: true,
        },
        { status: 200 }
      );
    }

    const authKey = process.env.NEXT_PUBLIC_MSG91_AUTH_KEY;

    if(!authKey) {
      console.error('MSG91_AUTH_KEY not configured');
      return NextResponse.json(
        { error: 'OTP verification service not configured' },
        { status: 500 }
      );
    }

    // Verify OTP with MSG91 API
    // MSG91 OTP Verification API endpoint
    const verificationUrl = 'https://control.msg91.com/api/v5/otp/verify';

    const verificationResponse = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': authKey,
      },
      body: JSON.stringify({
        mobile: `91${mobile}`, // Add country code
        otp: otp,
      }),
    });

    const verificationData = await verificationResponse.json();

    // Check if verification was successful
    if(verificationResponse.ok && verificationData.type === 'success') {
      // Generate a verification token to bind the verified phone number
      const verificationToken = generateVerificationToken(mobile);

      return NextResponse.json(
        {
          success: true,
          message: 'OTP verified successfully',
          verificationToken,
          mobile,
        },
        { status: 200 }
      );
    } else {
      // OTP verification failed
      return NextResponse.json(
        {
          error: verificationData.message || 'Invalid OTP',
          success: false,
        },
        { status: 400 }
      );
    }
  } catch(error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
}
