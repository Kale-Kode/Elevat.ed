import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Below is the Supabase project URL and Service Role Key.
// Note: The Service Role Key should NEVER be exposed on the client side.
const supabaseUrl = 'https://txgfvqffljglhgfwrwxn.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

const { error: updateCasProgressError } = await supabaseAdmin
    .from('CAS_progress')
    .update({ hours_completed: 267 })
    .eq('cas_id', 1);
if (updateCasProgressError) console.error("error updating CAS_progress hours: ", updateCasProgressError);