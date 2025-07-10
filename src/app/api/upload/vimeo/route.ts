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

export async function POST(request: NextRequest) {



  vimeoUploadClient.upload(
    '/Users/hrb/Downloads/Vimeo/11977315_3840_2160_30fps.mp4',
    {
      name: 'hrishabh',
      description: 'Uploaded via Next.js API',
    },
    function (uri: string) {
      fs.unlinkSync('/Users/hrb/Downloads/Vimeo/11977315_3840_2160_30fps.mp4'); // Clean up temp file
      const videoId = uri.split('/').pop();
      const videoUrl = `https://vimeo.com/${videoId}`;
      (NextResponse.json({ url: videoUrl }));
    },
    function () {
      // Optionally handle progress
    },
    function (error: unknown) {
      fs.unlinkSync('/Users/hrb/Downloads/Vimeo/11977315_3840_2160_30fps.mp4');
      (NextResponse.json({ error: (error as Error).message }, { status: 500 }));
    }
  );

  try {
    // Parse the incoming form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if(!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Save the file temporarily to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tempFilePath = path.join(os.tmpdir(), file.name);
    fs.writeFileSync(tempFilePath, buffer);

    // Upload to Vimeo
    return await new Promise((resolve) => {
      vimeoUploadClient.upload(
        '/Users/hrb/Downloads/Vimeo/11977315_3840_2160_30fps.mp4',
        {
          name: file.name,
          description: 'Uploaded via Next.js API',
        },
        function (uri: string) {
          fs.unlinkSync(tempFilePath); // Clean up temp file
          const videoId = uri.split('/').pop();
          const videoUrl = `https://vimeo.com/${videoId}`;
          resolve(NextResponse.json({ url: videoUrl }));
        },
        function () {
          // Optionally handle progress
        },
        function (error: unknown) {
          fs.unlinkSync(tempFilePath);
          resolve(NextResponse.json({ error: (error as Error).message }, { status: 500 }));
        }
      );
    });
  } catch(error: unknown) {
    return NextResponse.json({ error: (error as Error).message || 'Unknown error' }, { status: 500 });
  }
}