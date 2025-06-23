// app/api/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' }, 
        { status: 400 }
      );
    }

    // Send OTP using MSG91 API
    const response = await fetch('https://control.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID, // Your MSG91 template ID
        mobile: phone,
        authkey: process.env.MSG91_AUTH_KEY,
        // You can add more parameters like OTP length, expiry, etc.
        otp_length: 4,
        otp_expiry: 5, // 5 minutes
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to send OTP' }, 
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully',
      requestId: data.request_id 
    });
    
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}