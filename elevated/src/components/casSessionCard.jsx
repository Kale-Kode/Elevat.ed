import React, { useEffect } from 'react'

const CasSessionCard = ({ session }) => {
  useEffect(() => {
    console.log(session)
  }, [])

  const calculateTimeAgo = () => {
    const date = new Date(session.session_date);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays == 0) return 'Today'

    return diffDays < 7 ? `${diffDays}d ago` : `${Math.floor(diffDays / 7)}w ago`
  };

  return (
    <div className='flex items-center justify-start gap-4 px-6 py-4 w-full rounded-2xl bg-green-light text-sm mb-2'>
      <p className='text-green-full text-3xl'>•</p>
      <div>
        <p className='w-full truncate mb-1'>{session.session_desc}</p>
        <p className='text-gray-500'>{calculateTimeAgo()} • {Math.floor((session.session_minutes % 3600) / 60)} mins logged</p>
      </div>
    </div>
  )
}

export default CasSessionCard