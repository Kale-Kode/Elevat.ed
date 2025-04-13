import React from 'react'
import Alert from "@mui/material/Alert"; 
import { supabase } from "../integrations/supabase/client"; // Supabase client
import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import ProfileSidebar from '../components/profileSidebar';
import Home from '../components/screens/home';
import Cas from '../components/screens/cas'
import Opportunities from '../components/screens/opportunities';

const Dashboard = () => {
  const [selected, setSelected] = useState('home');
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // fetch data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session.user.id;
        // Fetch user data from the Users profiles table
        const { data, error } = await supabase
          .from("Users")
          .select("profile_id, name, role")
          .eq("user_id", userId)
          .single();
        // error handling
        if (error) {
          setErrorMessage("Error fetching user data. Please try again.");
        } else {
          setUserData(data);
        }
      } catch (error) {
        setErrorMessage("Unexpected error: " + error.message);
      }
    };

    fetchUserData();
  }, []);

  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  if (!userData) {
    return <div className='w-[100vw] h-[100vh] flex justify-center items-center'>Loading...</div>;
  }

  // render screen view
  const renderView = () => {
    switch (selected) {
      case 'home':
        return <Home />;
      case 'learn':
        return <div>learn View</div>;
      case 'project':
        return <div>project View</div>;
      case 'cas':
        return <Cas />;
      case 'trackr':
        return <Opportunities />;
      case 'mentors':
        return <div>mentors View</div>;
      case 'settings':
        return <div>settings View</div>;
    }
  }

  return (
    <div className="grid grid-cols-10 w-screen h-screen relative">

      <Sidebar selected={selected} setSelected={setSelected}/>
      
      <div className='col-span-7 flex justify-start items-start w-full h-full p-10'>
        {renderView()}
      </div>

      <ProfileSidebar />
        
    </div>
  ) 

}

export default Dashboard