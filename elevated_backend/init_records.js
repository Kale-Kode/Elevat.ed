import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Below is the Supabase project URL and Service Role Key.
// Note: The Service Role Key should NEVER be exposed on the client side.
const supabaseUrl = 'https://txgfvqffljglhgfwrwxn.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

// Insert a corresponding row into CAS_progress table.
const { data: casProgressData, error: casProgressError } = await supabaseAdmin
.from('CAS_progress')
.insert([
{
profile_id: 2,
},
]);
if (casProgressError) {
    console.error('Error inserting into CAS_progress table:', casProgressError);
} else {
    console.log('CAS_progress record created successfully:', casProgressData);
}