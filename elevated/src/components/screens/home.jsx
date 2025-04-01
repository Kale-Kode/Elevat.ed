import React from 'react'
import BentoBoxSmall from '../bentoBoxSmall'
import BentoBoxLarge from '../bentoBoxLarge'
import BentoBoxMedium from '../bentoBoxMedium'
import Bar from '../bar'

const Event = ({event, date, start, end}) => {
    return (
      <div className='flex flex-col items-start border-l-4 border-green-full px-4 mb-4'>
          <h1 className='font-medium text-lg'>{event}</h1>
          <p className='text-sm text-green-med-dark'>{date}  {start} - {end}</p>
      </div>
    )
  }

const Task = ({task, deadline}) => {
    return (
        <div className='flex justify-start items-center gap-4 mb-4'>
            <div className='w-4 h-4 border-2 border-green-full'></div>
            <div>
                <h1 className='font-medium text-lg'>{task}</h1>
                <p className='text-sm text-green-med-dark'>{deadline}</p>
            </div>
        </div>
    )
}

const Message = ({message, date, username, userpfp}) => {
    return (
        <div className='flex justify-start items-center gap-4 mb-4'>
            <img className='w-8 h-8' src={userpfp}></img>
            <div>
                <h1 className='font-medium text-sm'>{username} <span className='font-normal text-green-med-dark'>{date}</span></h1>
                <p className='text-sm text-green-med-dark max-w-full line-clamp-1'>{message}</p>
            </div>
        </div>
    )
}

const Home = () => {
    const renderBars = () => {
        // dummy testing data
        const progress = [50, 30, 60, 75, 0, 0, 0, 0]
        return (
            <div className="w-full flex-1 flex gap-2 justify-evenly">
              {progress.map((percentage, week) => (
                <Bar percentage={percentage} key={week}/>
              ))}
            </div>
          );
    }

  return (
    <div className='flex gap-4 overflow-auto scrollbar-hide min-h-screen'>
        <div className="flex flex-col text-green-dark">
            <p className='text-sm font-medium text-green-med-dark'>Hi User</p>
            <h1 className="text-4xl font-bold mb-12">Welcome back,</h1>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

                {/* CAS Hours and Task Completed */}
                <BentoBoxSmall upperText={"CAS hours this week"} lowerTextStat={"9.7"} lowerTextSub={"hours"} rightIcon={'/clock.png'}/>
                <BentoBoxSmall upperText={"Tasks completed"} lowerTextStat={"4"} lowerTextSub={"this week"} leftIcon={'/bar_chart.png'}/>
                <BentoBoxSmall upperText={"New opportunities"} lowerTextStat={"3"} leftIcon={'/opportunities.png'}/>
                <BentoBoxSmall upperText={"Project Cycle"} lowerTextStat={"10%"} lowerTextSub={"complete"} rightIcon={'/graph_curve.png'} hasGradient={true}/>
        
                {/* Opportunity Tracker */}
                <BentoBoxLarge smallHeading={"Opportunity Tracker"} heading={"Explore New Paths"} subtext={<span><p>🚪 3 New Internships Match your interests</p><p>🎯 2 Applications In Progress</p><p>⏳ 1 Pending Interview</p></span>} button={<button className="mt-4 bg-green-full text-white py-2 px-6 rounded-full">Explore Opportunities</button>} image={'/trackr_screenshot.png'} />
        
                {/* CAS progress */}
                <BentoBoxMedium variant={<div className='relative flex flex-col h-full'>
                    <div className='flex items-center justify-center gap-1 absolute right-0 top-0'>
                        <img className='w-4' src='/tick.png'></img>
                        <p className='text-[#05CD99] font-medium'>On track</p>
                    </div>
                    <p className='text-sm text-green-med-dark mb-2'>CAS Progress</p>
                    <h1 className='font-bold text-3xl mb-4'>12/50 <span className='font-medium text-sm text-green-med-dark'>hours</span></h1>
                    {renderBars()}
                </div>}/>

                {/* What's next */}
                <BentoBoxMedium heading={"What's next"} children={<div className="mt-2">
                        <Task task={"Start the training"} deadline={"before 25/05/25"}/>
                        <Task task={"Say hi to your mentors"} deadline={"as soon as possible"}/>
                        <Task task={"Log your CAS hours"} deadline={"before 28/06/25"}/>
                    </div>}/>

                {/* Upcoming Events */}
                <BentoBoxMedium heading={"Upcoming Events"} children={<div className="mt-2">
                        <Event event={"Group call w/ mentors"} date={"26/05/25"} start={"01:00 PM"} end={"02:00 PM"}/>
                        <Event event={"Weekly client meeting"} date={"30/05/25"} start={"02:00 PM"} end={"03:00 PM"}/>
                    </div>}/>
        
                {/* New Messages */}
                <BentoBoxMedium heading={"New Messages"} children={<div className="mt-2">
                        <Message message={"Lorem ipsum dolor sit amet, consectetur ali..."} date={"Today, 16:36"} username={"Username"} userpfp={'/profile.png'}/>
                        <Message message={"Lorem ipsum dolor sit amet, consectetur ali..."} date={"Today, 16:36"} username={"Username"} userpfp={'/profile.png'}/>
                        <Message message={"Lorem ipsum dolor sit amet, consectetur ali..."} date={"Today, 16:36"} username={"Username"} userpfp={'/profile.png'}/>
                    </div>}/>

            </div>
        </div>
        
        {/* Project Cycle */}
        <div className="bg-white p-4 rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold">Project Cycle</h2>
            <div className="mt-2">
                <p>Training Phase</p>
                <ul className="list-disc pl-5">
                <li>Week 1</li>
                <li>Week 2</li>
                <li>Week 3</li>
                <li>Week 4</li>
                </ul>
                <p>Project Phase</p>
                <ul className="list-disc pl-5">
                <li>Create a team</li>
                <li>Begin your project</li>
                <li>Mid-term presentation</li>
                <li>Final presentation</li>
                <li>Final report</li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Home