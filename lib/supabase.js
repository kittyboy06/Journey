// src/lib/supabase.js (Simplified Client Setup)
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
// You'll need a separate function for server components/actions 
// using 'cookies()' for secure, server-side data fetching.
