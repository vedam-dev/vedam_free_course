import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/streamableDB/supabaseServerClient';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .not('topic', 'is', null)
      .order('topic', { ascending: true })
      .order('created_at', { ascending: false });

    if(error) throw error;

    // Group manually in JavaScript
    const groupedContent = data.reduce((acc, item) => {
      if(!acc[item.topic]) {
        acc[item.topic] = [];
      }
      acc[item.topic].push(item);
      return acc;
    }, {});

    return NextResponse.json(
      { data: groupedContent },
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, topic, streamableUrl, embedCode, shortcode } = body;
    if(!title && !topic && !streamableUrl && !shortcode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const supabase = createSupabaseServerClient();
    const videoData = {
      title: title || null,
      topic: topic || null,
      streamableUrl: streamableUrl || null,
      embedCode: embedCode || null,
      shortcode: shortcode || null,
      videoCdnUrl: null,
      thumbnailUrl: null,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('content')
      .insert([videoData])
      .select()
      .single();
    if(error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 201 });
  } catch(error) {
    console.error('API error (POST /content):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Explicitly declare other HTTP methods as not allowed
export const PUT = () => new NextResponse('Method Not Allowed', { status: 405 });
export const DELETE = () => new NextResponse('Method Not Allowed', { status: 405 });
export const PATCH = () => new NextResponse('Method Not Allowed', { status: 405 });