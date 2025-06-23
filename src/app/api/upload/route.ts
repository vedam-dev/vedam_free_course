/* eslint-disable keyword-spacing */
/* eslint-disable quotes */
import fs from "fs";

import { NextResponse } from "next/server";

// Import the server-side Supabase client
// import { createClient } from "@/lib/supabase/server"; // Update this import path

import { ToStreamable } from "../../../lib/streamableClient";

import saveUploadedFile from "./saveUploadedFile";

// Named export for POST method (required for App Router)
export async function POST(request) {
  try {
    console.log("POST request received");

    // Parse form data using native FormData API
    const formData = await request.formData();

    const username = formData.get("username");
    const password = formData.get("password");
    const file = formData.get("file");

    console.log("Username:", username);
    console.log("File:", file?.name, file?.size, "bytes");

    // Validate required fields
    if (!username || !password || !file) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: username, password, and file are required",
        },
        { status: 400 }
      );
    }

    // Validate file size (500MB limit)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 500MB." },
        { status: 400 }
      );
    }

    // Validate file type
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

    // Save uploaded file temporarily
    const tempFilePath = await saveUploadedFile(file);
    console.log("Temp file saved:", tempFilePath);

    // Create read stream for the uploaded file
    const stream = fs.createReadStream(tempFilePath);

    // Create ToStreamable instance
    const upload = new ToStreamable({
      file: stream,
      auth: {
        username: username.toString(),
        password: password.toString(),
      },
      params: [],
    });

    // Use Promise-based approach instead of callback
    try {
      const uploadResult = await upload.upload();
      console.log("Upload successful, shortcode:", upload.shortcode);
      console.log(uploadResult);
      // Poll for processing status
      const finalResult = await pollProcessingStatus({
        upload,
        tempFilePath,
      });

      return NextResponse.json(finalResult);
    } catch (uploadError) {
      console.error("Upload error:", uploadError);

      // Clean up temp file on error
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (cleanupErr) {
        console.error("Error cleaning up temp file:", cleanupErr);
      }

      return NextResponse.json(
        { error: "Streamable upload failed: " + uploadError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

// Helper function to poll processing status of the uploaded video
async function pollProcessingStatus({
  upload,
  tempFilePath,
  maxAttempts = 20,
  interval = 3000,
}) {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    async function checkStatus() {
      try {
        const statusData = await upload.status();
        console.log(
          "Status check: => => => => => => => => => => => =>",
          statusData
        );

        // Check if processing is done
        if (statusData && statusData.status === 2 && statusData.embed_code) {
          // Success - video is processed
          const streamableUrl = `https://streamable.com/${upload.shortcode}`;
          const thumbnailUrl = statusData.thumbnail_url || "";
          const embedCode = `<iframe src="https://streamable.com/e/${upload.shortcode}" frameborder="0" allowfullscreen></iframe>`;
          const embed_code = statusData.embed_code;

          // Prepare data for Supabase
          const videoData = {
            category: "default",
            title: statusData.title || "Untitled Video",
            streamableUrl: streamableUrl,
            mobileCdnUrl: statusData.files?.mobile?.url || "",
            videoCdnUrl: statusData.files?.mp4?.url || "",
            embedeCode: embed_code || embedCode,
            thumbnailUrl: thumbnailUrl,
          };

          try {
            // Save to Supabase
            console.log("Attempting to save to Supabase:", videoData);
            const savedData = await saveToSupabase(videoData);
            console.log("Successfully saved to Supabase:", savedData);

            // Cleanup temp file
            cleanupTempFile(tempFilePath);

            resolve({
              shortcode: upload.shortcode,
              status: "processed",
              url: streamableUrl,
              message: "Video uploaded and data saved to database",
              savedData: savedData,
            });
          } catch (supabaseError) {
            console.error("Supabase save error details:", {
              error: supabaseError,
              message: supabaseError?.message,
              details: supabaseError?.details,
              hint: supabaseError?.hint,
              code: supabaseError?.code,
            });
            cleanupTempFile(tempFilePath);
            reject(
              new Error(
                `Video processed but failed to save to database: ${
                  supabaseError?.message || "Unknown error"
                }`
              )
            );
          }
          return;
        } else if (statusData && statusData.status === 3) {
          // Failed
          cleanupTempFile(tempFilePath);
          reject(new Error("Video processing failed on Streamable."));
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, interval);
        } else {
          cleanupTempFile(tempFilePath);
          reject(new Error("Processing timed out. Please try again later."));
        }
      } catch (error) {
        console.error("Status check error:", error);
        cleanupTempFile(tempFilePath);
        reject(
          new Error("Failed to check processing status: " + error.message)
        );
      }
    }

    checkStatus();
  });
}

async function saveToSupabase(videoData) {
  try {
    // Create server-side Supabase client (await since createClient is async)
    const supabase = await createClient();

    console.log("Supabase client created, attempting insert...");
    console.log("Data to insert:", JSON.stringify(videoData, null, 2));

    // First, let's get the table schema to understand the structure
    const { data: schemaData, error: schemaError } = await supabase
      .from("streamable")
      .select("*")
      .limit(1);

    console.log("Table schema check:", { schemaData, schemaError });

    // Try to insert with minimal data first to test
    const minimalData = {
      category: videoData.category,
      title: videoData.title,
      streamableUrl: videoData.streamableUrl,
    };

    console.log("Attempting insert with minimal data:", minimalData);

    const { data: minimalResult, error: minimalError } = await supabase
      .from("streamable")
      .insert([minimalData])
      .select();

    if (minimalError) {
      console.error(
        "Minimal insert error:",
        JSON.stringify(minimalError, null, 2)
      );
      // Try to get more details about the error
      console.error("Error details:", {
        message: minimalError.message,
        details: minimalError.details,
        hint: minimalError.hint,
        code: minimalError.code,
        description: minimalError.description,
      });
      throw new Error(
        `Database insert failed: ${
          minimalError.message ||
          minimalError.details ||
          "Unknown database error"
        }`
      );
    }

    console.log("Minimal insert successful:", minimalResult);

    // If minimal insert worked, try with full data
    const { data, error } = await supabase
      .from("streamable")
      .insert([videoData])
      .select();

    if (error) {
      console.error("Full insert error:", JSON.stringify(error, null, 2));
      console.error("Full error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        description: error.description,
      });
      throw new Error(
        `Database insert failed: ${
          error.message || error.details || "Unknown database error"
        }`
      );
    }

    console.log("Full insert successful:", data);
    return data;
  } catch (err) {
    console.error("saveToSupabase error:", err);
    console.error("Error type:", typeof err);
    console.error("Error constructor:", err.constructor.name);
    throw err;
  }
}

function cleanupTempFile(tempFilePath) {
  try {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log("Temp file cleaned up:", tempFilePath);
    }
  } catch (cleanupErr) {
    console.error("Error cleaning up temp file:", cleanupErr);
  }
}
