// src/lib/supabase.server.ts (or src/lib/supabase.ts)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a secure Supabase client for use within Next.js Server Actions or Route Handlers.
 * This client correctly handles session cookies for authentication.
 */
export function supabaseServerActionClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
