import Timer from '../timer'
import React, { useState, useEffect } from 'react'

const Cas = () => {
    const [sessions, setSessions] = useState([]);

    return ( 
    <div className='grid grid-cols-12'>
        <div>

        </div>       
        <div className='col-span-4'>
            <Timer />
            {sessions.map(session => <div></div>)}
        </div>

    </div>
  )
}

export default Cas