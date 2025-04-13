import { supabase } from "../integrations/supabase/client"; // Supabase client


// Auth.User
export const getUserId = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session.user.id;
}


// Users
export const getProfileId = async (userId) => {
    const { data, error } = await supabase
        .from("Users")
        .select("profile_id")
        .eq("user_id", userId)
        .single();

    if (error) throw error;
    return data.profile_id;
  };
  

// CAS
export const getCasId = async (profileId) => {
    const { data, error } = await supabase
        .from("CAS_progress")
        .select("cas_id")
        .eq("profile_id", profileId)
        .single();

    if (error) throw error;
    return data.cas_id;
};

export const getCasSessions = async (casId) => {
    const { data, error } = await supabase
        .from("CAS_sessions")
        .select("*")
        .eq("cas_id", casId)

    if (error) throw error;
    return data;
};


// Project


// Learn


// Mentor chat