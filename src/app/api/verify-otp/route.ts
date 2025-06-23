// // app/api/verify-otp/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     const { phone, otp } = await request.json();
    
//     if (!phone || !otp) {
//       return NextResponse.json(
//         { error: 'Phone number and OTP are required' }, 
//         { status: 400 }
//       );
//     }

//     // Verify OTP using MSG91 API
//     const response = await fetch('https://control.msg91.com/api/v5/otp/verify', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       body: JSON.stringify({
//         authkey: process.env.MSG91_AUTH_KEY,
//         mobile: phone,
//         otp: otp,
//       }),
//     });

//     const data = await response.json();
    
//     if (!response.ok) {
//       return NextResponse.json(
//         { error: data.message || 'OTP verification failed' }, 
//         { status: response.status }
//       );
//     }

//     // If verification is successful
//     if (data.type === 'success') {
//       return NextResponse.json({ 
//         success: true, 
//         message: 'OTP verified successfully',
//         data: data 
//       });
//     } else {
//       return NextResponse.json(
//         { error: 'Invalid OTP' }, 
//         { status: 400 }
//       );
//     }
    
//   } catch (error: any) {
//     console.error('Error verifying OTP:', error);
//     return NextResponse.json(
//       { error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://control.msg91.com/api/v5/widget/verifyAccessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        authkey: process.env.NEXT_PUBLIC_MSG91_AUTH_KEY,
        "access-token": token
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'OTP verification failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}