import { NextResponse } from 'next/server';

import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('4b7734516ff9'); // Make sure this matches your actual DB
    const collection = db.collection('users');
    const data = await collection.find({}).toArray();
    return NextResponse.json({ success: true, data });
  } catch(error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { success: false, message: 'Database connection failed' },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('4b7734516ff9');
    const collection = db.collection('users');

    const result = await collection.insertOne(body);

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch(error) {
    console.error('POST /api/test error:', error);
    return NextResponse.json({ success: false, message: 'Failed to insert data' }, { status: 500 });
  }
}


// Mongo DB testing. To be added in phase-2 to for alpha testing