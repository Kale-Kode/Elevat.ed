import React from 'react'

const BentoBoxLarge = ({ smallHeading, heading, subtext, button, image}) => {
  return (
    <div className='col-span-8 flex justify-evenly gap-8 items-center bg-green-light rounded-2xl p-8 h-auto'>
        <div className='flex flex-col items-start'>
            <p className='text-sm font-normal text-green-med-dark mb-2'>{smallHeading}</p>
            <h1 className='text-2xl font-bold mb-4'>{heading}</h1>
            <p className='text-green-med-dark mb-2'>{subtext}</p>
            {button && button}
        </div>
        <img className='w-64' src={image} alt={heading}></img>
    </div>
  )
}

export default BentoBoxLarge