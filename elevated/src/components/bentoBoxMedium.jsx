import React from 'react'

const BentoBoxMedium = ({ heading, children, variant }) => {
  return (
    <div className='col-span-4 bg-green-light rounded-2xl p-8 h-auto'>
        {variant ? variant : <div>
            <h1 className='text-2xl font-bold mb-4'>{heading}</h1>
            {children}
            </div>}
    </div>
  )
}

export default BentoBoxMedium