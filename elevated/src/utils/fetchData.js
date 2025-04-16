import { supabase } from "../integrations/supabase/client"; // Supabase client

export const select = async (table, field, eq, eqVal) => {
    const { data, error } = await supabase
        .from(table)
        .select(field)
        .eq(eq, eqVal);

    if (error) throw error;
    return data;
}

export const selectSingle = async (table, field, eq, eqVal) => {
    const { data, error } = await supabase
        .from(table)
        .select(field)
        .eq(eq, eqVal)
        .single();

    if (error) throw error;
    return data;
}

export const selectLike = async (table, field, like, likeVal) => {
    const { data, error } = await supabase
        .from(table)
        .select(field)
        .ilike(like, `%${likeVal}%`)

    if (error) throw error;
    return data;
}

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