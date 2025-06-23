
import { createClient as createSupabaseClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE env variables');
}

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    // Will add some setting if needed once i get the database access
  });
}
