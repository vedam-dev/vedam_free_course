import fs from 'fs';
import os from 'os';
import path from 'path';

import { Download } from '@mui/icons-material';
import { NextRequest, NextResponse } from 'next/server';
import { Vimeo } from 'vimeo';

const vimeoClientId = process.env.VIMEO_CLIENT_ID;
const vimeoClientSecret = process.env.VIMEO_CLIENT_SECRET;
const vimeoAccessToken = process.env.VIMEO_ACCESS_TOKEN;

console.log('vimeoClientId:', vimeoClientId, 'vimeoClientSecret:', vimeoClientSecret, 'vimeoAccessToken:', vimeoAccessToken);
if(!vimeoClientId || !vimeoClientSecret || !vimeoAccessToken) {
  throw new Error('Missing Vimeo environment variables');
}

const vimeoUploadClient = new Vimeo(vimeoClientId, vimeoClientSecret, vimeoAccessToken);

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if(!file) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Save the file temporarily to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tempFilePath = path.join(os.tmpdir(), file.name);

    try {
      fs.writeFileSync(tempFilePath, buffer);
    } catch(err) {
      console.error('Failed to write file to temp:', err);
      return NextResponse.json({ error: 'Failed to write file to temp' }, { status: 500 });
    }

    // Upload to Vimeo
    return await new Promise((resolve) => {
      vimeoUploadClient.upload(
        tempFilePath,
        {
          name: file.name,
          description: 'Uploaded using following options (view:anybody; embed:public)',
          privacy: {
            view: 'anybody',
            embed: 'public',
          },
        },
        function (uri: string) {
          fs.unlinkSync(tempFilePath); // Clean up temp file
          const videoId = uri.split('/').pop();
          const videoUrl = `https://vimeo.com/${videoId}`;
          console.log('Upload successful:', videoUrl);
          resolve(NextResponse.json({ url: videoUrl }));
        },
        function (bytesUploaded: number, bytesTotal: number) {
          // Optionally log progress
          const percent = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(`Uploading: ${percent}%`);
        },
        function (error: unknown) {
          fs.unlinkSync(tempFilePath);
          console.error('Vimeo upload error:', error);
          resolve(NextResponse.json({ error: (error as Error).message }, { status: 500 }));
        }
      );
    });
  } catch(error: unknown) {
    console.error('API route error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Unknown error' }, { status: 500 });
  }
}