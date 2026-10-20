import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read configuration securely from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;

// Validate configuration
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseKey && 
    !supabaseUrl.includes('your-project-id') && 
    !supabaseKey.includes('your-supabase-publishable')
  );
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  return clientInstance;
};

// Export singleton client
export const supabase = getSupabaseClient();
