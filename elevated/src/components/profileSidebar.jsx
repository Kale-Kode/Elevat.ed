import React, { useEffect, useState } from 'react'
import { supabase } from "../integrations/supabase/client"
import * as fetchData from "../utils/fetchData"

const ProfileSidebar = () => {
  const [profilePic, setProfilePic] = useState('/profile.png')
  useEffect(() => {
    const fetchProfilePicture = async () => {
      const userId = await fetchData.getUserId()
      const { data, error } = await supabase
        .from('Users')
        .select('pfp')
        .eq('user_id', userId)
        .single()
      if (error) {
        console.error('Fetch error:', error)
        return
      }
      setProfilePic(data.pfp)
      console.log(data)
    }
    fetchProfilePicture()
  }, [])

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error){
    console.log('error signing out: ', error)
    }
  }

  return (
    <div className='col-span-2 flex flex-col justify-start items-center gap-4 h-full p-8 pt-10 bg-[#FDFFFB]'>
      
      <div>
        <img src={profilePic} className="w-24 mx-auto rounded-full"></img>
        <div className='flex -mt-4'>
          <img src='/research-badge.png' className='w-10 h-10'></img>
          <img src='/team-mvp-badge.png' className='w-10 h-10 -ml-3'></img>
          <img src='/presentation-badge.png' className='w-10 h-10 -ml-3'></img>
        </div>
      </div>

      <p className='font-medium text-green-dark'>Brandon James</p>

      <div className='flex w-full justify-evenly'>
        <div className='flex gap-1 items-center'>
          <img src='/leaderboard-position.png' className='w-6'></img>
          <p className='text-md text-green-dark/85 font-medium'>11th</p>
        </div>
        <div className='flex gap-1 items-center'>
          <img src='/endorsements.png' className='w-6'></img>
          <p className='text-md text-green-dark/85 font-medium'>3</p>
        </div>
        <div className='flex gap-1 items-center'>
          <img src='/points.png' className='w-6'></img>
          <p className='text-md text-green-dark/85 font-medium'>240</p>
        </div>
      </div>

      <div className='flex w-full justify-evenly py-2 border-2 border-green-med-dark/10 rounded-lg'>
        <img src='/notifications.png' className='w-5'></img>
        <img src='/messages.png' className='w-5'></img>
        <img src='/settings.png' className='w-5'></img>
        <img src='/sign-out.png' className='w-5' onClick={signOut}></img>
      </div>

      <div className='flex flex-col w-full items-center gap-2 p-2 border-2 border-green-med-dark/10 rounded-lg'>
        <p className='font-normal text-green-dark'>Your Team</p>
        <div className='w-full flex justify-between items-center text-sm font-normal text-green-dark/85'>
          <div className='flex items-center gap-2'>
            <img src='profile.png' className='w-10'></img>
            <p>Devon Johnson</p>
          </div>
          <p className='text-green-full'>Endorse</p>
        </div>
        <div className='w-full flex justify-between items-center text-sm font-normal text-green-dark/85'>
          <div className='flex items-center gap-2'>
            <img src='profile.png' className='w-10'></img>
            <p>Sally McArthur</p>
          </div>
          <p className='text-green-full'>Endorse</p>
        </div>
        <div className='w-full flex justify-between items-center text-sm font-normal text-green-dark/85'>
          <div className='flex items-center gap-2'>
            <img src='profile.png' className='w-10'></img>
            <p>Jessica Summers</p>
          </div>
          <p className='text-green-full'>Endorse</p>
        </div>
        <div className='w-full flex justify-between items-center text-sm font-normal text-green-dark/85'>
          <div className='flex items-center gap-2'>
            <img src='profile.png' className='w-10'></img>
            <p>Jamie Ross</p>
          </div>
          <p className='text-green-full'>Endorse</p>
        </div>
        
      </div>

    </div>
  )
}

export default ProfileSidebar