import React, { useState } from 'react'
import { supabase } from "../integrations/supabase/client"; 
import { ExternalLink, Tags } from "lucide-react";

const OpportunityCard = ({ data }) => {
    const { opportunity_id, category, title, description, focus_tags, requirements, age_range, eligibility, application_instructions, application_deadline, url, logo } = data

    const [openModal, setOpenModal] = useState(false);

    const ModalInfoCard = ({ heading, text}) => {
        return (
            <div className='px-6 py-4 bg-white rounded-2xl mb-2 border-2 border-gray-200'>
                <p className='font-medium'>{heading}</p>
                <p className='text-black/75'>{text}</p>
            </div>
        )
    }

    return (
    <div className='p-8 rounded-2xl shadow-md shadow-green-med-dark/8 mb-4'>
        
        <div className='flex items-center gap-4 mb-4'>
            <img src={`https://txgfvqffljglhgfwrwxn.supabase.co/storage/v1/object/public/opportunity-logos/${logo}`} className='w-14 overflow-visible object-cover'></img>
            <div className=''>
                <h1 className='text-2xl font-bold text-green-dark mb-1'>{title}</h1>
                <p className='text-sm font-normal text-green-med-dark'>{category}</p>
            </div>
        </div>
            
        <div className='flex items-center justify-between'>
            <p className='text-md font-normal w-full text-green-med-dark'><span><Tags width={24} className="text-green-full inline mr-2"/></span> {focus_tags}</p>
            <div className='flex items-center w-full justify-end gap-2'>
                <button className='bg-green-full text-white rounded-lg px-4 py-2' onClick={() => setOpenModal(true)}>Details</button>
                <a href={url} target="_blank"><button className='bg-green-full text-white rounded-lg px-4 py-2 flex items-center gap-2'>Website <ExternalLink size={20} className='text-white'/></button></a>
            </div>
        </div>

        {openModal && <div className='fixed flex justify-center items-center inset-0 w-screen h-screen bg-black/50' onClick={() => setOpenModal(false)}>
                <div className='p-12 bg-gray-50 w-[40vw] h-[70vh] overflow-auto scrollbar-hide relative z-10'>
                    <p className='text-sm font-normal text-green-med-dark mb-2'>{category}</p>
                    <h1 className='text-2xl font-bold text-green-dark'>{title}</h1>
                    <p className='text-md font-normal w-full text-green-med-dark mb-4'><span><Tags width={24} className="text-green-full inline mr-2"/></span> {focus_tags}</p>
                    {description && <ModalInfoCard heading={'Description'} text={description}/>}
                    {requirements && <ModalInfoCard heading={'Requirements'} text={requirements}/>}
                    {age_range && <ModalInfoCard heading={'Age range'} text={age_range}/>}
                    {eligibility && <ModalInfoCard heading={'Eligibility'} text={eligibility}/>}
                    {application_instructions && <ModalInfoCard heading={'Application instructions'} text={application_instructions}/>}
                    {application_deadline && <ModalInfoCard heading={'Application deadline'} text={application_deadline}/>}
                    <a href={url} target="_blank"><button className='bg-green-full text-white rounded-lg p-2 flex items-center gap-2 absolute top-6 right-6'><ExternalLink size={20} className='text-white'/></button></a>
                </div>
            </div>}
    </div>
  )
}

export default OpportunityCard