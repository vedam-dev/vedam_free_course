import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('user-data')
      .select('*')
      .order('created_at', { ascending: true });

    if(error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data },
      { status: 200 }
    );
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
    const { name, email, mobile } = body;

    const cookieStore = await cookies();
    const visitorToken = cookieStore.get('visitor_token')?.value;

    if(!name || !email || !mobile || !visitorToken) {
      return NextResponse.json(
        { error: 'Name, email, mobile, and visitor_token are required' },
        { status: 400 }
      );
    }

    // Step 1: Upsert into user-data table
    const { data: userData, error: userError } = await supabase
      .from('user-data')
      .upsert([{
        name,
        email,
        mobile
      }], { onConflict: 'mobile' })
      .select();

    if(userError) {
      console.error('Supabase user-data upsert error:', userError);
      return NextResponse.json(
        { error: 'Failed to save user data' },
        { status: 500 }
      );
    }

    // Step 2: Update utm-data using visitor_token from cookies
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