// import React from 'react'
// import { useState, useEffect } from "react";
// // import { Input } from "../components/Input";
// // import { Button } from "../components/Button";
// // import { Checkbox } from "../components/Checkbox";
// import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";
// import { supabase } from "../integrations/supabase/client";
// import { useNavigate } from "react-router-dom";
// //import { Alert, AlertDescription } from "../components/ui/alert";
// import Alert from '@mui/material/Alert';
// import { AuthError, AuthApiError } from "@supabase/supabase-js";

// const Login = () => {
//     const navigate = useNavigate();
//     const [errorMessage, setErrorMessage] = useState("");

//     useEffect(() => {
//         // Check if user is already logged in
//         const checkUser = async () => {
//         const { data: { session } } = await supabase.auth.getSession();
//         if (session) {
//             navigate("/dashboard");
//         }
//         };
//         checkUser();

//         const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
//         console.log("Auth state changed:", event);
        
//         if (event === "SIGNED_IN") {
//             console.log("User signed in successfully");
//             navigate("/dashboard");
//         }
//         if (event === "USER_UPDATED") {
//             console.log("User updated, checking session");
//             const { error } = await supabase.auth.getSession();
//             if (error) {
//             console.error("Session error:", error);
//             setErrorMessage(getErrorMessage(error));
//             }
//         }
//         if (event === "SIGNED_OUT") {
//             console.log("User signed out");
//             setErrorMessage("");
//         }
//         });

//         return () => subscription.unsubscribe();
//     }, [navigate]);

//     const getErrorMessage = (error) => {
//         console.error("Authentication error:", error);
        
//         if (error instanceof AuthApiError) {
//         switch (error.code) {
//             case "invalid_credentials":
//             return "Invalid email or password. Please check your credentials and try again.";
//             case "email_not_confirmed":
//             return "Please verify your email address before signing in.";
//             case "user_not_found":
//             return "No user found with these credentials.";
//             case "invalid_grant":
//             return "Invalid login credentials.";
//             default:
//             return `Authentication error: ${error.message}`;
//         }
//         }
//         return `Unexpected error: ${error.message}`;
//     };

//     return (
//         <div className="min-h-screen w-screen bg-[url(/login-bg.png)] bg-center bg-cover flex items-center justify-center bg-background p-4">
//             <div className='bg-white p-12 rounded-3xl flex items-center gap-12'>
//                 <div className='text-black'>
//                     <div className="text-center space-y-2">
//                     <h1 className="text-2xl font-bold">Sign in to Elevat.ed</h1>
//                     </div>
                    
//                     {errorMessage && (
//                     <Alert severity="error">{errorMessage}</Alert>
//                     )}

//                     <SupabaseAuth 
//                         view="sign_in"
//                         supabaseClient={supabase}
//                         appearance={{
//                             theme: ThemeSupa,
//                             className: {
//                                 anchor: 'text-white hover:text-white/80',
//                                 button: 'text-white',
//                                 label: 'text-white',
//                                 input: 'text-white bg-background border-white/20',
//                             },
//                             style: {
//                                 button: { background: '#6CB0FD', color: 'white', width: 'fit-content', padding: '12px 60px', borderRadius: '99px' },
//                                 anchor: {marginRight: 'auto'},
//                             },
//                         }}
//                         providers={[]}
//                         localization={{
//                             variables: {
//                                 sign_in: {
//                                     email_input_placeholder: "Your school email address",
//                                     link_text: ''
//                                 },  
//                             },
//                         }}
//                     />
//                 </div>
//                 <img src='/elevated_earth.png' className='object-cover'></img>
//             </div>

//         </div>
//     );
// }

// export default Login

import React, { useState, useEffect } from "react"; // Import React and the hooks we need
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"; // Import the Supabase Auth UI component
import { ThemeSupa } from "@supabase/auth-ui-shared"; // Import the default Supabase theme
import { supabase } from "../integrations/supabase/client"; // Import our Supabase client instance
import { Navigate, useNavigate, useLocation } from "react-router-dom"; // Import hooks for navigation and locating the current route
import Alert from "@mui/material/Alert"; // Import an alert component from Material UI for error display
import { AuthApiError } from "@supabase/supabase-js"; // Import error handling classes from Supabase

// Define our Login component
const Login = () => {
  // useNavigate allows us to programmatically redirect the user
  const navigate = useNavigate();
  // useLocation gives us the current location (URL path) so we can check before redirecting
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // errorMessage state to store any authentication error messages for the user
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect runs when the component mounts and when the dependencies (navigate, location.pathname) change
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard", { replace: true }); 
      }
    };
    checkUser();
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          navigate("/dashboard", { replace: true });
        }
      }
    );
  
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Function to produce a user-friendly error message based on a given error from Supabase
  const getErrorMessage = (error) => {
    console.error("Authentication error:", error); // Log the error for debugging purposes
    // If the error is an instance of AuthApiError, process the error code
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
    // For any other errors, return a default error message.
    return `Unexpected error: ${error.message}`;
  };

  // The UI for the login page: background image, form container, and the SupabaseAuth component render the login UI.
  return (
    <div className="min-h-screen w-screen bg-[url(/login-bg.png)] bg-center bg-cover flex items-center justify-center bg-background p-4">
      <div className="bg-white p-12 rounded-3xl flex items-center gap-12">
        {/* Left side: text and login form */}
        <div className="text-black">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Sign in to Elevat.ed</h1>
          </div>

          {/* Show error alert if there is an error message */}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          {/* SupabaseAuth component renders the built-in authentication form */}
          <SupabaseAuth
            view="sign_in" // Render the sign_in view
            supabaseClient={supabase} // Provide the Supabase client
            appearance={{
              theme: ThemeSupa, // Use the default Supabase theme
              className: {
                anchor: "text-white hover:text-white/80", // Style for link/anchor elements
                button: "text-white", // Style for buttons
                label: "text-white", // Style for labels
                input: "text-white bg-background border-white/20", // Style for input fields
              },
              style: {
                button: {
                  background: "#6CB0FD", // Custom background color for button
                  color: "white", // Button text color
                  width: "fit-content", // Button width adjusts to content
                  padding: "12px 60px", // Padding around the button text
                  borderRadius: "99px", // Fully rounded button corners
                },
                anchor: { marginRight: "auto" }, // Custom styling for anchor elements
              },
            }}
            providers={[]} // No external OAuth providers
            localization={{
              variables: {
                sign_in: {
                  email_input_placeholder: "Your school email address", // Custom placeholder text
                  link_text: "", // Empty link text to remove the sign-up link if desired
                },
              },
            }}
          />
        </div>
        {/* Right side: Display an image */}
        <img src="/elevated_earth.png" className="object-cover" alt="Elevated Earth" />
      </div>
    </div>
  );
};

// Export the Login component as the default export
export default Login;