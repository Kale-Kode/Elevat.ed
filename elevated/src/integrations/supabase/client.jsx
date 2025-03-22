import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://txgfvqffljglhgfwrwxn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4Z2Z2cWZmbGpnbGhnZndyd3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NjY2OTMsImV4cCI6MjA1ODA0MjY5M30.-gPQ-23KblZI07tkSek0FkoyES519jIOVrd6_QPgiw8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);