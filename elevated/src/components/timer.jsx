import React, { useState, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'
import { supabase } from "../integrations/supabase/client"; // Supabase client

const Timer = () => {
  const [time, setTime] = useState(() => {
    return parseInt(localStorage.getItem("timerTime")) || 0
  });
  const [isRunning, setIsRunning] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [sessionDesc, setSessionDesc] = useState("");

  useEffect(() => {
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
  }, [time]);

  const startPauseHandler = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const saveSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session.user.id;

    // get the cas_id from the CAS_progress table
    const { data, error } = await supabase
    .from('CAS_progress')
    .select('cas_id')
    .eq('profile_id', userId)
    .single();
    if (error || !data) {
      console.error('Error fetching cas_id:', error);
      return;
    }

    const { error_ } = await supabase
    .from('CAS_sessions')
    .insert({ cas_id: data.cas_id, session_date: new Date(), session_minutes: time, session_desc: sessionDesc })

    setOpenModal(false)
  }

  return (
    <div className=" flex flex-col items-center justify-center gap-1 p-4  rounded-2xl">
      <p className="text-5xl">{formatTime(time)}</p>
      <p onClick={() => setTime(0)} className="text-sm text-gray-300 hover:text-red-400 transition-all mb-2">reset</p>
      <div className='flex items-center justify-start gap-4'>
        <button onClick={startPauseHandler} className="p-4 bg-green-light rounded-2xl text-green-dark">
          {isRunning ? <Pause fill/> : <Play fill/>}
        </button>
        <button onClick={() => setOpenModal(true)} className={`text-white px-8 py-4 w-full shadow-md rounded-2xl ${time == 0 || isRunning ? 'bg-gray-300' : 'bg-green-full'}`}>Log task</button>
      </div>

      {openModal && <div className='fixed flex justify-center items-center inset-0 w-screen h-screen bg-black/50 z-0' onClick={() => setOpenModal(false)}>
                <div className='flex flex-col items-start p-12 bg-green-light rounded-2xl w-[30vw] h-fit overflow-auto scrollbar-hide z-10'  onClick={(e) => e.stopPropagation()}>
                    <h1 className='text-2xl font-bold text-green-dark mb-2'>Log Your Session</h1>
                    <p className='text-md font-normal text-green-med-dark mb-4'>Total time spent: {formatTime(time)}</p>
                    <textarea className='text-sm font-normal p-4 w-full h-[20vh] mb-4 text-green-med-dark border-2 border-gray-200' placeholder='What did you do this session?' onChange={e => setSessionDesc(e.target.value)}></textarea>
                    <button onClick={() => saveSession()} className={`text-white self-end px-8 py-4 shadow-md rounded-2xl ${time == 0 || isRunning ? 'bg-gray-300' : 'bg-green-full'}`}>Save</button>
                </div>
            </div>}

    </div>
  );
} 

export default Timer