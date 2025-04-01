import React from 'react'

const BentoBoxSmall = ({upperText, lowerTextStat, lowerTextSub, leftIcon, rightIcon, hasGradient=false, classList}) => {
  return (
    <div className={`col-span-3 flex items-center justify-evenly rounded-2xl p-4 h-auto gap-1 ${hasGradient ? 'bg-gradient-to-br from-green-med to-green-full text-white' : 'bg-green-light'} ${classList}`}>
      
      {leftIcon && <img className='w-12' src={leftIcon} alt={upperText}></img>}

      <div className='flex flex-col items-start justify-center gap-1'>
        <p className={`text-sm font-normal ${hasGradient ? 'text-white' : 'text-green-med-dark'}`}>{upperText}</p>
        <p className="text-2xl font-bold">{lowerTextStat} <span className={`text-sm font-medium ${hasGradient ? 'text-white' : 'text-green-med-dark'}`}>{lowerTextSub}</span></p>
      </div>
      
      {rightIcon && <img className='w-12' src={rightIcon} alt={upperText}></img>}

    </div>
  )
}

export default BentoBoxSmall