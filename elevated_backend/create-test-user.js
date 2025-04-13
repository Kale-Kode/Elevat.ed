import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Below is the Supabase project URL and Service Role Key.
// Note: The Service Role Key should NEVER be exposed on the client side.
const supabaseUrl = 'https://txgfvqffljglhgfwrwxn.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function createTestUser() {
    const email = 'testuser@example.com';
    const password = 'qWiEan821n_12ujAc';

    // // Delete existing test user
    // const { delete_data, delete_error } = await supabaseAdmin.auth.admin.deleteUser('9bb60364-f879-4f69-895c-3b7effe1e2ad');
    // if (delete_error) {
    // console.error('Error deleting user:', delete_error);
    // } else {
    // console.log('User deleted successfully:', delete_data);
    // }
    // const { delete_User_data, delete_User_error } = await supabaseAdmin
    // .from('Users') // specify the table name
    // .delete()
    // .eq('profile_id', '1');
    // if (delete_User_error) {
    //     console.error('Error deleting from users table:', delete_User_error);
    // } else {
    //     console.log('Profile deleted successfully:', delete_User_data);
    // }

    // Create a new user in Auth.users
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true // Set to "true" to mark the email as confirmed.
    });

    if (error) {
        console.error('Error creating user:', error);
    } else {
        console.log('Test user created:', data);
    }

    // Get the new user's ID from the created auth user record.
    const newUserId = data?.user?.id;
    if (!newUserId) {
        console.error('No user ID returned');
        return;
    }
    console.log('new id: ', newUserId);

    // Insert a corresponding row into Users table.
    const { data: profileData, error: profileError } = await supabaseAdmin
    .from('Users')
    .insert([
    {
    user_id: newUserId,
    name: 'Test User',
    role: 'Student',
    created_at: new Date()
    },
    ]);
    if (profileError) {
        console.error('Error inserting into custom users table:', profileError);
    } else {
        console.log('User profile created successfully:', profileData);
    }

    // get profile_id from new User record
    const { data: profileIdData, error: profileIdError } = await supabase
          .from("Users")
          .select("profile_id")
          .eq("user_id", newUserId)
          .single();
        // error handling
        if (profileIdError) {
            console.error('Error fetching profile_id from Users table into custom users table:', profileIdError);
        } else {
          console.log('User profile_id fetched successfully:', profileIdData);
        }

    // Insert a corresponding row into CAS_progress table.
    const { data: casProgressData, error: casProgressError } = await supabaseAdmin
    .from('CAS_progress')
    .insert([   
    {
    profile_id: profileIdData.profile_id,
    },
    ]);
    if (casProgressError) {
        console.error('Error inserting into custom users table:', casProgressError);
    } else {
        console.log('User profile created successfully:', casProgressData);
    }

}

createTestUser();