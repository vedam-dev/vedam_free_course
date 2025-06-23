import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definition for your user data
export interface UserData {
  id?: number
  name: string
  email: string
  mobile: string
  created_at?: string
}