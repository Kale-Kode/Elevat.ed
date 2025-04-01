import React, { useState, useEffect } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"; // Supabase Auth UI component
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../integrations/supabase/client"; // Supabase client
import { Navigate, useNavigate, useLocation } from "react-router-dom"; // Import hooks for navigation
import Alert from "@mui/material/Alert";
import { AuthApiError } from "@supabase/supabase-js"; // Import error handling classes from Supabase

// Define our Login component
const Login = () => {
  // useNavigate allows us to programmatically redirect the user
  const navigate = useNavigate();
  // // useLocation gives us the current location (URL path) so we can check before redirecting
  // const location = useLocation();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // errorMessage state to store any authentication error messages for the user
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect runs when the component mounts, and when navigation changes
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        validateRole(session.user.id);
        //navigate("/dashboard", { replace: true }); // redirect to dashboard if there's an existing session
      }
    };
    checkUser();
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          validateRole(session.user.id);
          //navigate("/dashboard", { replace: true }); // redirect to dashboard upon successful sign in
        }
      }
    );
  
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Validate user role from the database
  const validateRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("Users")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        setErrorMessage("Unable to fetch user role. Please contact support.");
        return;
      }

      console.log('student role data: ', data)

      // Redirect based on role
      switch (data.role) {
        case "Student":
          navigate("/student", { replace: true });
          break;
        case "Mentor":
          navigate("/mentor", { replace: true });
          break;
        case "Cas_advisor":
          navigate("/cas-advisor", { replace: true });
          break;
        case "Admin":
          navigate("/admin", { replace: true });
          break;
        default:
          setErrorMessage("Role not recognized. Contact support.");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred during validation.");
    }
  };

  // Function to produce a user-friendly error message based on a given error from Supabase
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
      <div className="bg-white p-12 rounded-3xl w-[80vw] flex flex-col md:flex-row items-center justify-evenly gap-12">

        {/* Left side: text and login form */}
        <div className="w-full">
          <div className="text-black/90 text-left space-y-2">
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
                  padding: "12px 40px", // Padding around the button text
                  borderRadius: "99px", // Fully rounded button corners
                },
                container: {
                  width: "100%",
                  flex: '1'
                },
                anchor: { marginRight: "auto" }, // Custom styling for anchor elements
              },
            }}
            providers={[]} // No external OAuth providers
            localization={{
              variables: {
                log_in: {
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