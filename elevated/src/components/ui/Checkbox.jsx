import React from 'react'

const Checkbox = ({ id, onCheckedChange }) => {
  return (
    <input 
      type="checkbox" 
      id={id} 
      className="mr-2" 
      onChange={(e) => onCheckedChange(e.target.checked)} 
    />
  )
}

export default Checkbox;