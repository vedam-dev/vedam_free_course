import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try{
    
    // Parse request body
    const body = await req.json();
    const { visitor_token, utm_source, utm_medium, utm_campaign } = body;
    
    console.log('Received UTM data:', { visitor_token, utm_source, utm_medium, utm_campaign });
    
    // Validate required fields
    if (!visitor_token) {
      return NextResponse.json(
        { success: false, error: 'visitor_token is required' }, 
        { status: 400 }
      );
    }
    
    // Insert data into Supabase
    const { data, error } = await supabase
      .from('utm-data')
      .insert({
        utm: visitor_token,
        source: utm_source || null,
        medium: utm_medium || null,
        campaign: utm_campaign || null,
      })
      .select();
    
    if (error) {
      console.error('Supabase error details:', error);
      return NextResponse.json(
        { success: false, error: error.message, details: error }, 
        { status: 500 }
      );
    }
    
    console.log('UTM data inserted successfully:', data);
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}