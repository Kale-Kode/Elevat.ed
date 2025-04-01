import React from 'react'

const Bar = ({percentage}) => {
  return (
    <div className='h-full w-[6%] rounded-full flex flex-col justify-end bg-black/10'>
        <div className={`w-full bg-green-full rounded-full`} style={{ height: `${percentage}%` }}></div>
    </div>
  )
}

export default Bar