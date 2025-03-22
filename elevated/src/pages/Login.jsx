import React from 'react'
import { useState, useEffect } from "react";
// import { Input } from "../components/Input";
// import { Button } from "../components/Button";
// import { Checkbox } from "../components/Checkbox";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../integrations/supabase/client";
import { useNavigate } from "react-router-dom";
//import { Alert, AlertDescription } from "../components/ui/alert";
import Alert from '@mui/material/Alert';
import { AuthError, AuthApiError } from "@supabase/supabase-js";

const Login = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Check if user is already logged in
        const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            navigate("/dashboard");
        }
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === "SIGNED_IN") {
            console.log("User signed in successfully");
            navigate("/dashboard");
        }
        if (event === "USER_UPDATED") {
            console.log("User updated, checking session");
            const { error } = await supabase.auth.getSession();
            if (error) {
            console.error("Session error:", error);
            setErrorMessage(getErrorMessage(error));
            }
        }
        if (event === "SIGNED_OUT") {
            console.log("User signed out");
            setErrorMessage("");
        }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const getErrorMessage = (error) => {
        console.error("Authentication error:", error);
        
        if (error instanceof AuthApiError) {
        switch (error.code) {
            case "invalid_credentials":
            return "Invalid email or password. Please check your credentials and try again.";
            case "email_not_confirmed":
            return "Please verify your email address before signing in.";
            case "user_not_found":
            return "No user found with these credentials.";
            case "invalid_grant":
            return "Invalid login credentials.";
            default:
            return `Authentication error: ${error.message}`;
        }
        }
        return `Unexpected error: ${error.message}`;
    };

    return (
        <div className="min-h-screen w-screen bg-[url(/login-bg.png)] bg-center bg-cover flex items-center justify-center bg-background p-4">
            <div className='bg-white p-12 rounded-3xl flex items-center gap-12'>
                <div className='text-black'>
                    <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">Sign in to Elevat.ed</h1>
                    </div>
                    
                    {errorMessage && (
                    <Alert severity="error">{errorMessage}</Alert>
                    )}

                    <SupabaseAuth 
                        view="sign_in"
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: 'rgb(var(--primary))',
                                        brandAccent: 'rgb(var(--primary))',
                                    },
                                },
                            },
                            className: {
                                anchor: 'text-white hover:text-white/80',
                                button: 'text-white',
                                label: 'text-white',
                                input: 'text-white bg-background border-white/20',
                            },
                            style: {
                                button: { background: '#6CB0FD', color: 'white', width: 'fit-content', padding: '12px 60px', borderRadius: '99px' },
                                anchor: {marginRight: 'auto'},
                            },
                        }}
                        providers={[]}
                        localization={{
                            variables: {
                                sign_in: {
                                    email_input_placeholder: "Your school email address",
                                    link_text: ''
                                },  
                            },
                        }}
                    />
                </div>
                <img src='/elevated_earth.png' className='object-cover'></img>
            </div>

        </div>
    );
}

export default Login