/* eslint-disable quotes */
/* eslint-disable keyword-spacing */
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";

interface FileWithName {
  name?: string;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export default async function saveUploadedFile(
  file: FileWithName
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create temp directory if it doesn't exist
  const tempDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const originalName = file.name ?? "video";
  const fileName = `${timestamp}-${originalName}`;
  const filePath = path.join(tempDir, fileName);

  // Write file to temp directory
  await writeFile(filePath, buffer);

  return filePath;
}

// Also export as named export for flexibility
export { saveUploadedFile };
