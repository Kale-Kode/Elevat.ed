import React from 'react'
import { Link } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import  Sidebar from '../components/sidebar';
import { useState } from 'react';

const Dashboard = () => {
  const [selected, setSelected] = useState('home');

  const renderView = () => {
    switch (selected) {
      case 'home':
        return <div>Home View</div>;
      case 'learn':
        return <div>Profile View</div>;
      case 'project':
        return <div>Settings View</div>;
      case 'cas':
        return <div>About View</div>;
      case 'trackr':
        return <div>About View</div>;
      case 'mentors':
        return <div>About View</div>;
      case 'settings':
        return <div>About View</div>;
    }
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden">

      <Sidebar selected={selected} setSelected={setSelected}/>
      
      <div className='w-full h-full px-12 py-6'>
        {renderView()}
      </div>
        
    </div>
  ) 

}

export default Dashboard