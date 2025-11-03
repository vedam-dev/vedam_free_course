import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get all unique topics from content table
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('topic')
      .not('topic', 'is', null);

    if(contentError) {
      console.error('Error fetching topics:', contentError);
      return NextResponse.json(
        { error: 'Failed to fetch topics' },
        { status: 500 }
      );
    }

    // Extract unique topics
    const uniqueTopics = [...new Set(content?.map(item => item.topic).filter(Boolean))].sort();

    return NextResponse.json({
      data: {
        topics: uniqueTopics
      }
    });

  } catch(error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

