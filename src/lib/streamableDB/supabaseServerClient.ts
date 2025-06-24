import { createClient } from '@supabase/supabase-js';

import { VideoData } from './streamableTypes'; // Assuming you have a generated types file

// Environment variables type safety
interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

// Create server client with service role for server-side operations
export const createSupabaseServerClient = () => {
  const env: Env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  };

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient<VideoData>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

// Example usage for writing data
// export async function writeData<T>(table: string, data: T): Promise<T | null> {
//   try {
//     const supabase = createSupabaseServerClient();

//     const { data: insertedData, error } = await supabase
//       .from(table)
//       .insert(data)
//       .select()
//       .single();

//     if (error) {
//       console.error(`Error writing to ${table}:`, error);
//       throw new Error(`Failed to write to ${table}: ${error.message}`);
//     }

//     return insertedData;
//   } catch (error) {
//     console.error("Write operation failed:", error);
//     return null;
//   }
// }

// Example usage in a server component or API route
// export async function exampleUsage(userData: { name: string; email: string }) {
//   try {
//     const result = await writeData("users", userData);
//     return result;
//   } catch (error) {
//     console.error("Failed to save user data:", error);
//     return null;
//   }
// }
