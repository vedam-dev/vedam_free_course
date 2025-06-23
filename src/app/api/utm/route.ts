import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, phone } = await request.json();

    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((c) => {
        const [k, v] = c.split('=');
        return [k, decodeURIComponent(v)];
      })
    );

    const {
      visitor_token,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      landing_page,
      referrer,
    } = cookies;

    if(!visitor_token) {
      return NextResponse.json(
        { error: 'visitor_token cookie missing' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc('insert_utm', {
      _visitor_token: visitor_token,
      _name: name,
      _phone: phone,
      _utm_source: utm_source || null,
      _utm_medium: utm_medium || null,
      _utm_campaign: utm_campaign || null,
      _utm_term: utm_term || null,
      _utm_content: utm_content || null,
      _landing_page: landing_page || null,
      _referrer: referrer || null,
    });

    if(error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data });
  } catch(err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
