import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dhwtumzkroveaijsrarg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRod3R1bXprcm92ZWFpanNyYXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzAwOTEsImV4cCI6MjA4NDk0NjA5MX0.n3D0Gb1iwoHBtP7JtyqG9xQLDbE7clJ0C5tjgNHRCUc'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// For React:
// import { supabase } from "@/integrations/supabase/client";
// For React Native:
// import { supabase } from "@/src/integrations/supabase/client";
