import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '../../../../utils/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = createClient();
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
  //  for future reference
  }
  // Insert into Supabase via pgSQL
  const insertSQL = `
    insert into utm_data (
      visitor_token, name, phone,
      utm_source, utm_medium, utm_campaign, 
      landing_page
    ) values (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    )
    returning id;
  `;
  const values = [
    visitor_token,
    name,
    phone,
    utm_source ?? null,
    utm_medium ?? null,
    utm_campaign ?? null,
    utm_term ?? null,
    utm_content ?? null,
    landing_page ?? null,
    referrer ?? null,
  ];
  const { data, error } = await supabase.rpc('run_sql', {
    sql: insertSQL,
    params: values,
  });
  // Note: Supabase PostgREST doesn’t directly support raw SQL via rpc; instead, you can create a Postgres function:
  // create function insert_utm(
  //   _visitor_token text, _name text, _phone text,
  //   _utm_source text, _utm_medium text, _utm_campaign text,
  //   _utm_term text, _utm_content text, _landing_page text, _referrer text
  // ) returns bigint as $$
  // declare new_id bigint;
  // begin
  //   insert into utm_data (...) values (...)
  //   returning id into new_id;
  //   return new_id;
  // end;
  // $$ language plpgsql;
  // Then call via supabase.rpc('insert_utm', { ... });
  if(error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // Optionally: send server-side event to GA via Measurement Protocol
  try {
    const measurementPayload = {
      client_id: visitor_token, // or a generated client_id
      events: [
        {
          name: 'sign_up', // or resource_access
          params: {
            method: 'free_access',
            utm_source: utm_source,
            utm_medium: utm_medium,
            utm_campaign: utm_campaign,
            // include other params as needed
          },
        },
      ],
    };
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurementPayload),
      }
    );
  } catch(gaError) {
    console.error('GA Measurement Protocol error:', gaError);
  }
  return NextResponse.json({ success: true, id: data });
}
