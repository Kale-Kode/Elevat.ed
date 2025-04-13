import React, { useState, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'
import { supabase } from "../integrations/supabase/client"; // Supabase client
import * as fetchData from "../utils/fetchData"
import CasSessionCard from './casSessionCard';

const Timer = ({ user }) => {
  // get isRunning bool state from local storage
  const [isRunning, setIsRunning] = useState(() => {
    return localStorage.getItem("timerRunning") === "true";
  });

  // get timer state from local storage
  const [time, setTime] = useState(() => {
    //return parseInt(localStorage.getItem("timerTime")) || 0

    // Retrieve stored timer and the last timestamp
    const storedTime = parseInt(localStorage.getItem("timerTime")) || 0;
    const lastTimestamp = parseInt(localStorage.getItem("lastTimestamp"));
    // if there is a last timestamp in localstorage AND timer is still running:
    if (lastTimestamp && isRunning) {
      // Calculate the time elapsed since last visit and add to stored time
      const elapsedTime = Math.floor((Date.now() - lastTimestamp) / 1000);
      console.log(`before: ${storedTime}\nelapsed: ${elapsedTime}\nnew: ${storedTime + elapsedTime}`)
      return storedTime + elapsedTime;
    }
    return storedTime;
  });

  const [openModal, setOpenModal] = useState(false);
  const [sessionDesc, setSessionDesc] = useState("");
  const [casSessions, setCasSessions] = useState([])

  useEffect(() => { // on time and isRunning state change
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem("timerTime", time);
     localStorage.setItem("timerRunning", isRunning);
  }, [time, isRunning]);

  // Store last timestamp when the user leaves the page
  useEffect(() => { // on component mount
    const handleUnload = () => {
      localStorage.setItem("lastTimestamp", Date.now());
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  const startPauseHandler = () => {
    setIsRunning(prev => !prev);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const saveSession = async () => {
    const userId = await fetchData.getUserId()
    const profileId = await fetchData.getProfileId(userId) // get profile_id from User record
    const casId = await fetchData.getCasId(profileId) // get the cas_id from the CAS_progress table
    console.log(userId, profileId, casId)

    const { error: casSessionError } = await supabase
    .from('CAS_sessions')
    .insert({ 
      cas_id: casId,
      session_date: new Date(), 
      session_minutes: time, 
      session_desc: sessionDesc 
    })

    if (casSessionError) {
      console.error('Error storing CAS session in database:', casSessionError);
    } 
    
    else {
      // update CAS_progress hours_completed
      const { data: fetchCasProgressData, error: fetchCasProgressError } = await supabase
        .from('CAS_progress')
        .select("hours_completed")
        .eq('cas_id', user.casId)
        .single();
      if (fetchCasProgressError) {
        console.error("error fetching CAS_progress hours: ", fetchCasProgressError);
      }
      else {
        console.log('cas progress fetched: ', fetchCasProgressData)
        console.log('session time: ', time)
        const { error: updateCasProgressError } = await supabase
          .from('CAS_progress')
          .update({ hours_completed: fetchCasProgressData.hours_completed + time })
          .eq('cas_id', user.casId);
        if (updateCasProgressError) console.error("error updating CAS_progress hours: ", updateCasProgressError);
      }
    }

    setOpenModal(false)
    setTime(0)
    
  }

  useEffect(() => { // on component mount
    const changes = supabase // Subscribe to real-time changes in CAS_sessions table
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "CAS_sessions",
        },
        (payload) => {
          console.log("Received change:", payload)
          setCasSessions(prev => [...prev, payload.new])
        }
      )
      .subscribe();

    // Cleanup function to unsubscribe on unmount
    return () => {
      supabase.removeChannel(changes.channel);
    };
  }, []); 

  useEffect(() => {
    const fetchCasSessions = async () => {
      if (!user.casId) return;  // Prevents running if casId is not yet defined
      try {
        const sessions = await fetchData.getCasSessions(user.casId);
        setCasSessions(sessions.reverse());
      } catch (error) {
        console.error("Error fetching CAS sessions:", error);
      } 
    }
    fetchCasSessions();
  }, [user])

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-1 p-4  rounded-2xl">
        
        <div className='flex flex-col items-center justify-center bg-white rounded-2xl px-8 py-4 mb-10'>
          <h2 className='text-lg font-medium text-green-dark mb-2'>CAS Timer</h2>
          <p className="text-5xl">{formatTime(time)}</p>
          <p onClick={() => setTime(0)} className="text-sm text-gray-300 hover:text-red-400 transition-all mb-2">reset</p>
          <div className='flex items-center justify-start gap-4 mb-2'>
            <button onClick={startPauseHandler} className="p-4 bg-green-light rounded-2xl text-green-dark">
              {isRunning ? <Pause fill/> : <Play fill/>}
            </button>
            <button onClick={() => setOpenModal(true)} className={`text-white px-8 py-4 w-full shadow-md rounded-2xl ${time == 0 || isRunning ? 'bg-gray-300' : 'bg-green-full'}`}>Log task</button>
          </div>
        </div>

        {openModal && <div className='fixed flex justify-center items-center inset-0 w-screen h-screen bg-black/50 z-0' onClick={() => setOpenModal(false)}>
                  <div className='flex flex-col items-start p-12 bg-white rounded-2xl w-[30vw] h-fit overflow-auto scrollbar-hide z-10'  onClick={(e) => e.stopPropagation()}>
                      <h1 className='text-2xl font-bold text-green-dark mb-2'>Log Your Session</h1>
                      <p className='text-md font-normal text-green-med-dark mb-4'>Total time spent: {formatTime(time)}</p>
                      <textarea className='text-sm font-normal p-4 w-full h-[20vh] mb-4 text-green-med-dark border-2 border-gray-200 focus:outline-none focus:border-green-full/50 resize-none' placeholder='What did you do this session?' onChange={e => setSessionDesc(e.target.value)}></textarea>
                      <button onClick={() => saveSession()} className='text-white self-end px-8 py-4 shadow-md rounded-2xl bg-green-full'>Save</button>
                  </div>
              </div>}

        <h2 className='text-lg font-medium text-green-dark mb-2'>Recent Sessions</h2>
        <div className='h-50 overflow-auto scrollbar-hidden p-2'>  
          {casSessions.map((session, key) => <CasSessionCard session={session} key={key}/>)}
        </div>
        
      </div>
      
    </div>
  );
} 

export default Timer