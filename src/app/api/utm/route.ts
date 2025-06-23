import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const { visitor_token, utm_source, utm_medium, utm_campaign } = body;

    console.log('Received UTM data:', { visitor_token, utm_source, utm_medium, utm_campaign });


    if(!visitor_token) {
      return NextResponse.json(
        { success: false, error: 'visitor_token is required' },
        { status: 400 }
      );
    }


    const { data: existingData } = await supabase
      .from('utm-data')
      .select('visitor_token')
      .eq('visitor_token', visitor_token)
      .single();

    if(existingData) {
      console.log('Visitor token already exists, skipping insert');
      return NextResponse.json({
        success: true,
        message: 'Visitor token already exists',
        data: existingData
      });
    }


    const { data, error } = await supabase
      .from('utm-data')
      .insert({
        visitor_token: visitor_token,
        utm: `${utm_source || 'direct'}_${utm_medium || 'none'}_${utm_campaign || 'none'}`, // Combined UTM string
        source: utm_source || null,
        medium: utm_medium || null,
        campaign: utm_campaign || null,
        isVerified: false,
        phoneNumber: null
      })
      .select();

    if(error) {
      if(error.code === '23505') {
        console.log('Duplicate visitor_token detected');
        return NextResponse.json({
          success: true,
          message: 'Visitor token already exists'
        });
      }

      console.error('Supabase error details:', error);
      return NextResponse.json(
        { success: false, error: error.message, details: error },
        { status: 500 }
      );
    }

    console.log('UTM data inserted successfully:', data);
    return NextResponse.json({ success: true, data });

  } catch(error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}