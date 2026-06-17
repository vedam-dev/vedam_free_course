import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/adminAuth';
import { verifyVerificationToken } from '@/lib/otpVerification';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const authError = requireAdminSession(request);
  if(authError) return authError;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if(error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch(error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, mobile, passout_year, stream, verificationToken } = body;

    const cookieStore = await cookies();
    const visitorToken = cookieStore.get('visitor_token')?.value;

    if(!name || !email || !mobile || !passout_year || !stream || !visitorToken) {
      return NextResponse.json(
        { error: 'Name, email, mobile, year of passing, and visitor_token are required' },
        { status: 400 }
      );
    }

    if(!verificationToken) {
      return NextResponse.json(
        { error: 'OTP verification required. Please verify your phone number.' },
        { status: 400 }
      );
    }

    const verificationResult = verifyVerificationToken(verificationToken);

    if(!verificationResult) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token. Please verify your OTP again.' },
        { status: 400 }
      );
    }

    if(verificationResult.mobile !== mobile) {
      return NextResponse.json(
        { error: 'Mobile number mismatch. Please verify the correct number.' },
        { status: 400 }
      );
    }


    const setAuthCookie = async (userId: string | number) => {
      cookieStore.set('user_id', String(userId), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 1,
        path: '/',
      });
    };

    // Step 1: Check if user with this mobile already exists
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('mobile', mobile)
      .single();

    if(findError && findError.code !== 'PGRST116') {
      console.error('Supabase find user error:', findError);
      return NextResponse.json(
        { error: 'Failed to check existing user' },
        { status: 500 }
      );
    }

    if(existingUser) {
      await setAuthCookie(existingUser.id);

      return NextResponse.json(
        {
          message: 'User already exists',
          user: existingUser,
          utmUpdated: null
        },
        { status: 200 }
      );
    }

    // Step 2: Insert new user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{ name, email, mobile, passout_year, stream }])
      .select();

    if(userError) {
      console.error('Supabase users insert error:', userError);
      return NextResponse.json(
        { error: 'Failed to save user data' },
        { status: 500 }
      );
    }

    const newUser = userData[0];
    await setAuthCookie(newUser.id);

    // Step 3: Update utm-data using visitor_token from cookies
    const { data: updatedUtmData, error: utmError } = await supabase
      .from('utm-data')
      .update({
        phoneNumber: parseInt(mobile.toString()),
        isVerified: true
      })
      .eq('visitor_token', visitorToken)
      .select();

    if(utmError) {
      console.error('Supabase utm-data update error:', utmError);
      return NextResponse.json(
        {
          error: 'User saved but failed to update UTM data',
          details: utmError.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'User data and UTM info saved successfully',
        user: userData,
        utmUpdated: updatedUtmData
      },
      { status: 201 }
    );
  } catch(error) {
    console.error('API error (POST):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}