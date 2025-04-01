import React, { useEffect, useState } from 'react'
import { supabase } from "../../integrations/supabase/client"; 
import OpportunityCard from '../opportunityCard';
import { Search } from "lucide-react";

const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([])
    const [filteredOpportunities, setFilteredOpportunities] = useState([])
    const [filter, setFilter] = useState({});
    const [search, setSearch] = useState('')
    const tagsList = ['Entrepreneruship', 'Business', 'AI', 'Leadership', 'STEM', 'Charity', 'Community', 'Research'];
    const [selectedTags, setSelectedTags] = useState([]);

    const fetchOpportunities = async () => {
        const { data, error } = await supabase
            .from('Opportunities')
            .select()
        if (error){
            console.log("error fetching from Opportunties table: ", error)
        } else {
            setOpportunities(data)
            setFilteredOpportunities(data)
        }
    }

    useEffect(() => {
        fetchOpportunities();
    }, [])


    const handleSearch = (e) => {
        e.preventDefault();
        setFilter((prevFilter) => ({
            ...prevFilter,
            search, 
        }));
        filterResults()
    }   
    
    useEffect(() => {
        if (search == "") {
            filterResults();
        }
    }, [search])

    const handleTagChange = (tag) => {
        setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
        filterResults()
    };
    const removeTag = (tag) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
        filterResults()
    };

    
    // filter opportunities
    const filterResults = () => {
        setFilteredOpportunities(opportunities.filter(opportunity => {
            let matchingTags = selectedTags.filter(tag => opportunity.focus_tags.toLowerCase().includes(tag.toLowerCase()))
            return opportunity.title.toLowerCase().includes(search) && matchingTags.length > 0
        }
        ))
    }

    
    return (
    <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-1 h-fit bg-green-light px-4 py-6 rounded-2xl'>
            <p className='text-xl font-medium mb-4'>Filter opportunities</p>
            <form onSubmit={e => handleSearch(e)} className="flex items-center w-full max-w-md bg-white px-4 py-2 rounded-full mb-4">
                <input
                    type="text"
                    placeholder='Search for opportunities'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full outline-none"
                />
                <button type="submit" className="px-4 py-2 bg-transparent text-green-full">
                    <Search w={20}/>
                </button>
             </form>

             <div className="relative w-full">
                
                <div className="bg-white w-full mt-2 rounded-lg p-2">
                {tagsList.map((tag) => (
                    <label key={tag} className="flex items-center space-x-2 py-1">
                    <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                    />
                    <span>{tag}</span>
                    </label>
                ))}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                    <div key={tag} className="bg-green-full text-white px-3 py-1 rounded-full flex items-center">
                        <span>{tag}</span>
                        <button onClick={() => removeTag(tag)} className="ml-2 text-white">&times;</button>
                    </div>
                    ))}
                </div>
                </div>

        </div>
        <div className='col-span-3'>
            {filteredOpportunities.length == 0 && <p className='text-green-med-dark font-medium'>No opportunities match your search.</p>}
            {filteredOpportunities.map((opportunity, index) => (
                <OpportunityCard  data={opportunity} key={index}/>
            ))}
        </div>
    </div>
  )
}

export default Opportunities