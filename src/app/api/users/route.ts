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

    // Validate required fields
    if(!name || !email || !mobile) {
      return NextResponse.json(
        { error: 'Name, email, and mobile are required' },
        { status: 400 }
      );
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('user-data')
      .insert([
        {
          name: name,
          email: email,
          mobile: mobile // Change this to match your actual column name if different
        }
      ])
      .select();

    if(error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save user data' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'User data saved successfully', data },
      { status: 201 }
    );
  } catch(error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}