import { NextResponse } from 'next/server';

import {
  StreamableResponse,
  ToStreamable,
} from '../../../lib/streamableClient';
import { VideoData } from '../../../lib/streamableDB/streamableTypes';
import { createSupabaseServerClient } from '../../../lib/streamableDB/supabaseServerClient';


interface PollConfig {
  maxAttempts?: number;
  interval?: number;
}

const DEFAULT_POLL_CONFIG: PollConfig = {
  maxAttempts: 20,
  interval: 3000,
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const username = formData.get('username') as string | null;
    const password = formData.get('password') as string | null;
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const topic = formData.get('topic') as string | null;

    const validationError = validateFormData(username, password, file, title);
    if(validationError) return validationError;


    try {
      const upload = new ToStreamable({
        file: file!,
        auth: {
          username: username!,
          password: password!,
        },
        params: [],
      });

      console.log('Starting Streamable upload...');
      const uploadResult = await upload.upload();
      console.log('Upload successful, shortcode:', uploadResult.shortcode);


      const finalResult = await pollProcessingStatus(upload, title, topic);
      return NextResponse.json(finalResult);
    } catch(uploadError) {
      console.error('Upload error:', uploadError);

      return NextResponse.json(
        {
          error: `Streamable upload failed: ${(uploadError as Error).message}`,
        },
        { status: 500 }
      );
    }

  } catch(error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

function validateFormData(
  username: string | null,
  password: string | null,
  file: File | null,
  title: string | null
) {
  if(!username || !password || !file || !title) {
    return NextResponse.json(
      {
        error:
          'Missing or invalid required fields: username, password, file, and title are required',
      },
      { status: 400 }
    );
  }

  const maxSize = 500 * 1024 * 1024;
  if(file.size > maxSize) {
    return NextResponse.json(
      { error: 'File size too large. Maximum size is 500MB.' },
      { status: 400 }
    );
  }

  const allowedTypes = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
  ];
  if(
    !allowedTypes.includes(file.type) &&
    // FIX: Use RegExp.exec() method instead of RegExp.test() as recommended by SonarLint.
    !(/\.(mp4|avi|mov|wmv|flv|webm)$/i).exec(file.name)
  ) {
    return NextResponse.json(
      {
        error:
          'Please upload a valid video file (MP4, AVI, MOV, WMV, FLV, WebM).',
      },
      { status: 400 }
    );
  }

  return null;
}

// Updated function signature: removed tempFilePath
async function pollProcessingStatus(
  upload: ToStreamable,
  title: string | null,
  topic: string | null,
  config: PollConfig = DEFAULT_POLL_CONFIG
) {
  let attempts = 0;

  while(attempts < (config.maxAttempts ?? DEFAULT_POLL_CONFIG.maxAttempts!)) {
    try {
      const statusData = await upload.status();
      console.log('Status check:', statusData);

      // Updated function signature: removed tempFilePath
      const result = await handleStatusResult(
        statusData,
        upload,
        title,
        topic
      );
      if(result) return result;

      attempts++;
      await new Promise((resolve) =>
        setTimeout(resolve, config.interval ?? DEFAULT_POLL_CONFIG.interval!)
      );
    } catch(error) {
      console.error('Status check error:', error);
      // No temp file to clean up here
      throw new Error(
        `Failed to check processing status: ${(error as Error).message}`
      );
    }
  }

  // No temp file to clean up here
  throw new Error('Processing timed out. Please try again later.');
}

// Updated function signature: removed tempFilePath
async function handleStatusResult(
  statusData: StreamableResponse,
  upload: ToStreamable,
  title: string | null,
  topic: string | null
) {
  if(statusData.status === 2 && statusData.embed_code) {
    // Updated function signature: removed tempFilePath
    return await processSuccessfulUpload(
      statusData,
      upload,
      title,
      topic
    );
  } else if(statusData.status === 3) {
    // No temp file to clean up here
    throw new Error('Video processing failed on Streamable.');
  }
  return null;
}

// Updated function signature: removed tempFilePath
async function processSuccessfulUpload(
  statusData: StreamableResponse,
  upload: ToStreamable,
  title: string | null,
  topic: string | null
) {
  const streamableUrl = `https://streamable.com/${upload.shortcode}`;
  const embedCode = `${statusData.embed_code}`;

  const videoData: VideoData = {
    shortcode: upload.shortcode ?? '',
    // FIX: Prefer using nullish coalescing operator (??) instead of a logical or (||) for safer operation.
    topic: topic ?? 'default',
    // FIX: Prefer using nullish coalescing operator (??) instead of a logical or (||) for safer operation.
    title: title ?? 'Untitled Video',
    streamableUrl: streamableUrl,
    videoCdnUrl: statusData.files?.mp4?.url ?? '',
    embedCode: embedCode,
    thumbnailUrl: statusData.thumbnail_url ?? ''
  };

  try {
    console.log(
      'Attempting to save to Supabase:',
      JSON.stringify(videoData, null, 2)
    );
    const savedData = await saveToSupabase(videoData);
    console.log('Successfully saved to Supabase:', savedData);

    // No temp file to clean up here
    return {
      id: upload.shortcode,
      status: 'processed',
      url: streamableUrl,
      message: 'Video uploaded and data saved to database',
      savedData,
    };
  } catch(supabaseError) {
    console.error('Supabase save error:', {
      message: (supabaseError as Error).message,
      stack: (supabaseError as Error).stack,
      videoData,
    });
    // No temp file to clean up here
    throw new Error(
      `Video processed but failed to save to database: ${
        (supabaseError as Error).message
      }`
    );
  }
}

async function saveToSupabase(videoData: VideoData) {
  try {
    const supabase = createSupabaseServerClient();
    console.log(
      'Supabase client created, attempting insert:',
      JSON.stringify(videoData, null, 2)
    );

    const { data, error } = await supabase
      .from('content') // Table name of supabase
      .insert([videoData])
      .select()
      .single();

    if(error) {
      console.error('Insert error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        videoData,
      });
      throw new Error(
        `Database insert failed: ${error.message ?? 'Unknown database error'}`
      );
    }

    console.log('Insert successful:', data);
    return data as VideoData;
  } catch(err) {
    console.error('saveToSupabase error:', {
      message: (err as Error).message,
      stack: (err as Error).stack,
      videoData,
    });
    throw new Error(`Supabase operation failed: ${(err as Error).message}`);
  }
}