import { NextResponse } from 'next/server';

import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('VedamMongoDB');
    const collection = db.collection('students info');

    const data = await collection.find({}).toArray();

    return NextResponse.json({ success: true, data });
  } catch(error) {
    console.error('GET /api/test error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('VedamMongoDB');
    const collection = db.collection('students info');

    const result = await collection.insertOne(body);

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch(error) {
    console.error('POST /api/test error:', error);
    return NextResponse.json({ success: false, message: 'Failed to insert data' }, { status: 500 });
  }
}
