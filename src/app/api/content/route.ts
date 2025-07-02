import { NextResponse } from 'next/server';

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

// Explicitly declare other HTTP methods as not allowed
export const POST = () => new NextResponse('Method Not Allowed', { status: 405 });
export const PUT = () => new NextResponse('Method Not Allowed', { status: 405 });
export const DELETE = () => new NextResponse('Method Not Allowed', { status: 405 });
export const PATCH = () => new NextResponse('Method Not Allowed', { status: 405 });