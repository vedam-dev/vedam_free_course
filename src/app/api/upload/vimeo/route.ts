import { randomUUID } from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';
import { Vimeo } from 'vimeo';

const vimeoClientId = process.env.VIMEO_CLIENT_ID;
const vimeoClientSecret = process.env.VIMEO_CLIENT_SECRET;
const vimeoAccessToken = process.env.VIMEO_ACCESS_TOKEN;


if(!vimeoClientId || !vimeoClientSecret || !vimeoAccessToken) {
  throw new Error('Missing Vimeo environment variables');
}

const vimeoUploadClient = new Vimeo(vimeoClientId, vimeoClientSecret, vimeoAccessToken);

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Parse the incoming form data
    const adminCookie = request.cookies.get('admin_session');

    if(!adminCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if(!file) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const allowedTypes = [
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ];

    if(!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 1000 * 1024 * 1024; // 1000 MB

    if(file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      );
    }

    // Save the file temporarily to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = path.extname(file.name);
    const safeFileName = `${randomUUID()}${extension}`;
    const tempFilePath = path.join(os.tmpdir(), safeFileName);

    try {
      fs.writeFileSync(tempFilePath, buffer);
    } catch(err) {
      console.error('Failed to write file to temp:', err);
      return NextResponse.json({ error: 'Failed to write file to temp' }, { status: 500 });
    }

    // Upload to Vimeo
    return await new Promise<Response>((resolve) => {
      vimeoUploadClient.upload(
        tempFilePath,
        {
          name: file.name,
          description: 'Uploaded using following options (view:anybody; embed:public)',
          privacy: {
            view: 'unlisted',
            embed: 'private',
          },
        },
        function (uri: string) {
          if(fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
          const videoId = uri.split('/').pop();
          const videoUrl = `https://vimeo.com/${videoId}`;
          console.log('Upload successful:', videoUrl);
          resolve(NextResponse.json({ url: videoUrl }));
        },
        function (bytesUploaded: number, bytesTotal: number) {
          const percent = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(`Uploading: ${percent}%`);
        },
        function (error: unknown) {
          if(fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
          console.error('Vimeo upload error:', error);
          resolve(
            NextResponse.json(
              { error: (error as Error).message },
              { status: 500 }
            )
          );
        }
      );
    });
  } catch(error: unknown) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Unknown error' },
      { status: 500 }
    );
  }
}