import React from 'react'
import { Link } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

const Dashboard = () => {
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error){
      console.log('error signing out: ', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Dashboard Page</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  ) 
}

export default Dashboard