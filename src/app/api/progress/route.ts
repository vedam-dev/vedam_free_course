import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id');

    if(!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }

    // Fetch user progress with related content information
    const { data, error } = await supabase
      .from('progress')
      .select(`
        *,
        content:content_id (id,shortcode)
      `)
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if(error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch progress data' },
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
    const { user_id, content_id, is_complete } = body;

    if(!user_id || !content_id || typeof is_complete !== 'boolean') {
      return NextResponse.json(
        { error: 'user_id, content_id, and is_complete are required' },
        { status: 400 }
      );
    }

    // First check if the record exists
    const { data: existing, error: selectError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user_id)
      .eq('content_id', content_id)
      .maybeSingle();

    if(selectError) {
      console.error('Supabase select error:', selectError);
      return NextResponse.json(
        { error: 'Failed to check existing progress' },
        { status: 500 }
      );
    }

    let result;
    if(existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('progress')
        .update({
          is_complete,
          timestamp: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if(error) throw error;
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('progress')
        .insert({
          user_id,
          content_id,
          is_complete,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if(error) throw error;
      result = data;
    }

    return NextResponse.json(
      { data: result },
      { status: existing ? 200 : 201 }
    );
  } catch(error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}