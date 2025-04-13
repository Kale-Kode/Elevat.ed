import Timer from '../timer'
import React, { useState, useEffect } from 'react'
import * as fetchData from "../../utils/fetchData"
import { BarChart, LineChart } from '@mui/x-charts';
import { supabase } from "../../integrations/supabase/client";

const Cas = () => {
    const [user, setUser] = useState({});
    const [hoursCompleted, setHoursCompleted] = useState(0)
    const percentageCompleted = Math.floor((hoursCompleted % 3600) / 60) / 50 * 100
    const last7Days = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
    const [last7dHours, setLast7dHours] = useState([0, 1, 0, 2, 0, 1    , 0])
    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10']
    const [weekHours, setWeekHours] = useState([4, 13, 2, 4, 0, 0, 0, 0, 0, 0])
    const [weeklyGoal, setWeeklyGoal] = useState(null)

    useEffect(() => {
        const toISOStringDate = (date) => date.toISOString().split("T")[0];
        const fetchUser = async () => {
            const userId = await fetchData.getUserId()
            const profileId = await fetchData.getProfileId(userId)
            const casId = await fetchData.getCasId(profileId)
            console.log(userId, profileId, casId)
            setUser({userId, profileId, casId})

            const { data: progressData, error: progressError } = await supabase
            .from('CAS_progress')
            .select('hours_completed')
            .eq('cas_id', casId)
            .single()
            if (progressError) {
                console.log(progressError)
            } else {
                console.log('cas progress fetched: ', progressData)
                setHoursCompleted(progressData.hours_completed)
            }

            const currentDate = new Date()
            currentDate.setHours(0, 0, 0, 0) // start of toda
            for (let i = 0; i < 7; i++) {
                let prevDate = new Date(currentDate.getTime() - (i * 24 * 60 * 60 * 1000))
                let nextDate = new Date(prevDate.getTime() + (24 * 60 * 60 * 1000));
                const { data: sessionData, error: sessionError } = await supabase
                .from('CAS_sessions')
                .select("*")
                .eq('cas_id', casId)
                .gte('session_date', toISOStringDate(prevDate))
                .lt('session_date', toISOStringDate(nextDate));
                if (sessionError) {
                    console.log(sessionError)
                } else {
                    console.log('cas sessions fetched: ', sessionData)
                    // get total hours, then add to the current day
                    // setItems(prevItems =>
                    //     prevItems.map((item, index) =>
                    //         index === i ? totalHours : item
                    //     )
                    // );
                }
            }

        }
        fetchUser();
    }, [])

    return ( 
    <div className='grid grid-cols-3'>
        <div className='col-span-2 p-4 grid grid-cols-2 gap-4'>
            <div className='col-span-2 flex justify-evenly items-center gap-8 w-full'>
                <p className='font-medium text-green-full/75'>{Math.floor((hoursCompleted % 3600) / 60)}/50 hours</p>
                <div className='flex-1 h-4 overflow-hidden rounded-full bg-green-full/15 relative'>
                    <div className='absolute left-0 h-full bg-green-full rounded-full' style={{width: percentageCompleted}}></div>
                </div>
                <p className='font-medium text-green-full/75'>{percentageCompleted}% complete</p>
            </div>

            <div className='col-span-1 border-3 border-green-full/15 rounded-2xl'>
                <h2 className='font-semibold text-green-dark pl-6 pt-6'>Your Peers</h2>
            </div>

            {weeklyGoal ? <div className='col-span-1 border-3 h-60 border-green-full/15 rounded-2xl'>
                    <h2 className='font-semibold text-green-dark pl-6 pt-6'>Weekly Goal</h2>
                    <BarChart
                        sx={{
                            '--my-custom-gradient': 'url(#GlobalGradient)',
                        }}
                        slotProps={{
                            popper: {
                            sx: {
                                '--my-custom-gradient': 'linear-gradient(0deg, #9FCA45, #BAF146);',
                            },
                            },
                        }}
                        xAxis={[{ data: last7Days, scaleType: 'band' }]}
                        yAxis={[{ showGrid: false }]}
                        series={[{ data: last7dHours, color: 'var(--my-custom-gradient, #9FCA45)' }]}
                        className="w-full"
                        height={240}
                        borderRadius={8}
                    >
                        <linearGradient id="GlobalGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0" stopColor="#9FCA45" />
                        <stop offset="1" stopColor="#BAF146" />
                        </linearGradient>
                    </BarChart>
                </div> : <div className='col-span-1 h-60 flex flex-col items-center justify-center gap-2 border-3 border-green-full/15 rounded-2xl'>
                    <p className='text-center'>Students with goals are <span className='text-green-full font-medium'>4.2x</span> more likely to complete their CAS.</p>
                    <button className='text-white px-6 py-3 rounded-2xl bg-green-full'>Set Goal</button>
            </div>}

            <div className='col-span-2 border-3 border-green-full/15 rounded-2xl'>
                <h2 className='font-semibold text-green-dark pl-6 pt-6'>Hours Logged</h2>
                <BarChart
                    sx={{
                        '--my-custom-gradient': 'url(#GlobalGradient)',
                    }}
                    slotProps={{
                        popper: {
                        sx: {
                            '--my-custom-gradient': 'linear-gradient(0deg, #9FCA45, #BAF146);',
                        },
                        },
                    }}
                    xAxis={[{ scaleType: 'band', data: weeks, categoryGapRatio: 0.6 }]}
                    series={[{ data: weekHours,  color: 'var(--my-custom-gradient, #9FCA45)'}]}    
                    className='w-full'
                    height={240}
                    borderRadius={8}
                >
                    <linearGradient id="GlobalGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0" stopColor="#9FCA45" />
                    <stop offset="1" stopColor="#BAF146" />
                    </linearGradient>
                </BarChart>
            </div>
        </div>       
        <div className='col-span-1'>
            <Timer user={user}/>
        </div>

    </div>
  )
}

export default Cas