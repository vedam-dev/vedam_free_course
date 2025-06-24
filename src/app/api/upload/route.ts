import fs from "fs";
import { NextResponse } from "next/server";
import { ToStreamable } from "../../../lib/streamableClient";
import { VideoData } from "../../../lib/streamableDB/streamableTypes";
import { createSupabaseServerClient } from "../../../lib/streamableDB/supabaseServerClient";
import saveUploadedFile from "./saveUploadedFile";

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
    const username = formData.get("username");
    const password = formData.get("password");
    const file = formData.get("file");

    console.log("POST request received", {
      username,
      fileName: file?.name,
      fileSize: file?.size,
    });

    const validationError = validateFormData(username, password, file);
    if (validationError) return validationError;

    const tempFilePath = await saveUploadedFile(file);
    console.log("Temp file saved:", tempFilePath);

    try {
      const stream = fs.createReadStream(tempFilePath);
      const upload = new ToStreamable({
        file: stream,
        auth: { username: username.toString(), password: password.toString() },
        params: [],
      });

      const uploadResult = await upload.upload();
      console.log("Upload successful, shortcode:", uploadResult.shortcode);

      const finalResult = await pollProcessingStatus(upload, tempFilePath);
      return NextResponse.json(finalResult);
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      cleanupTempFile(tempFilePath);
      return NextResponse.json(
        {
          error: `Streamable upload failed: ${(uploadError as Error).message}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

function validateFormData(
  username: FormDataEntryValue | null,
  password: FormDataEntryValue | null,
  file: FormDataEntryValue | null
) {
  if (!username || !password || !file) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: username, password, and file are required",
      },
      { status: 400 }
    );
  }

  const maxSize = 500 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "File size too large. Maximum size is 500MB." },
      { status: 400 }
    );
  }

  const allowedTypes = [
    "video/mp4",
    "video/avi",
    "video/mov",
    "video/wmv",
    "video/flv",
    "video/webm",
  ];
  if (
    !allowedTypes.includes(file.type) &&
    !file.name.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i)
  ) {
    return NextResponse.json(
      {
        error:
          "Please upload a valid video file (MP4, AVI, MOV, WMV, FLV, WebM).",
      },
      { status: 400 }
    );
  }

  return null;
}

async function pollProcessingStatus(
  upload: ToStreamable,
  tempFilePath: string,
  config: PollConfig = DEFAULT_POLL_CONFIG
) {
  let attempts = 0;

  while (attempts < (config.maxAttempts ?? DEFAULT_POLL_CONFIG.maxAttempts!)) {
    try {
      const statusData = await upload.status();
      console.log("Status check:", statusData);

      const result = await handleStatusResult(statusData, upload, tempFilePath);
      if (result) return result;

      attempts++;
      await new Promise((resolve) =>
        setTimeout(resolve, config.interval ?? DEFAULT_POLL_CONFIG.interval!)
      );
    } catch (error) {
      console.error("Status check error:", error);
      cleanupTempFile(tempFilePath);
      throw new Error(
        `Failed to check processing status: ${(error as Error).message}`
      );
    }
  }

  cleanupTempFile(tempFilePath);
  throw new Error("Processing timed out. Please try again later.");
}

async function handleStatusResult(
  statusData: any,
  upload: ToStreamable,
  tempFilePath: string
) {
  if (statusData.status === 2 && statusData.embed_code) {
    return await processSuccessfulUpload(statusData, upload, tempFilePath);
  } else if (statusData.status === 3) {
    cleanupTempFile(tempFilePath);
    throw new Error("Video processing failed on Streamable.");
  }
  return null;
}

async function processSuccessfulUpload(
  statusData: any,
  upload: ToStreamable,
  tempFilePath: string
) {
  const streamableUrl = `https://streamable.com/${upload.shortcode}`;
  const thumbnailUrl = statusData.thumbnail_url ?? "";
  const embedCode = `<iframe src="https://streamable.com/e/${upload.shortcode}" frameborder="0" allowfullscreen></iframe>`;

  // Assuming the Supabase table uses 'id' instead of 'shortcode' based on the error
  const videoData: VideoData = {
    shortcode: upload.shortcode ?? "", // Changed from 'shortcode' to 'id'
    category: "default",
    title: statusData.title ?? "Untitled Video",
    streamableUrl: statusData.url,
    videoCdnUrl:
      statusData.files?.mp4?.url ?? statusData.files["mp4-mobile"].url ?? "",
    embedCode: statusData.embed_code ?? embedCode,
    thumbnailUrl: statusData.thumbnailUrl,
  };

  try {
    console.log(
      "Attempting to save to Supabase:",
      JSON.stringify(videoData, null, 2)
    );
    const savedData = await saveToSupabase(videoData);
    console.log("Successfully saved to Supabase:", savedData);

    cleanupTempFile(tempFilePath);
    return {
      id: upload.shortcode, // Changed from 'shortcode' to 'id'
      status: "processed",
      url: streamableUrl,
      message: "Video uploaded and data saved to database",
      savedData,
    };
  } catch (supabaseError) {
    console.error("Supabase save error:", {
      message: (supabaseError as Error).message,
      stack: (supabaseError as Error).stack,
      videoData,
    });
    cleanupTempFile(tempFilePath);
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
      "Supabase client created, attempting insert:",
      JSON.stringify(videoData, null, 2)
    );

    const { data, error } = await supabase
      .from("streamable")
      .insert([videoData])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        videoData,
      });
      throw new Error(
        `Database insert failed: ${error.message ?? "Unknown database error"}`
      );
    }

    console.log("Insert successful:", data);
    return data;
  } catch (err) {
    console.error("saveToSupabase error:", {
      message: (err as Error).message,
      stack: (err as Error).stack,
      videoData,
    });
    throw new Error(`Supabase operation failed: ${(err as Error).message}`);
  }
}

function cleanupTempFile(tempFilePath: string) {
  try {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log("Temp file cleaned up:", tempFilePath);
    }
  } catch (cleanupErr) {
    console.error("Error cleaning up temp file:", cleanupErr);
  }
}
