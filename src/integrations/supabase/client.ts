// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://flzioxdlsyxapirlbxbt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsemlveGRsc3l4YXBpcmxieGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMTU0OTUsImV4cCI6MjA1NTg5MTQ5NX0.Pxph-3FpWdEgSKSoJedoCPh6LSMaxDmbTpubEuW89nM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);