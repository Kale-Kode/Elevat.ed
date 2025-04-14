import { useEffect, useState } from "react"
import React from 'react'
import ProjectDashboard from "../projectDashboard"

const Project = () => {
    // screen states
    const [isLocked, setIsLocked] = useState(false)
    const [projectExists, setProjectExists] = useState(false)
    // create project popup states
    const [openPopup, setOpenPopup] = useState(false)
    const [description, setDescription] = useState('');
    const [ngoName, setNgoName] = useState('');
    const [projectTitle, setProjectTitle] = useState('');
    const [members, setMembers] = useState([]);
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log({ description, ngoName, projectTitle, members });
        setOpenPopup(false) // close popup
        setProjectExists(true) // show the new project display
    };
    // invite members popup states
    const [showInvitePopup, setShowInvitePopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [invited, setInvited] = useState([]);
    const mockUsers = [ // dummy test user data
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
        { id: 3, name: 'Clara Lee', email: 'clara@example.com' },
        { id: 4, name: 'David Chen', email: 'david@example.com' },
        { id: 5, name: 'Emily Green', email: 'emily@example.com' },
        { id: 6, name: 'John Sachs', email: 'john@example.com' },
        { id: 7, name: 'Anna Nachuta', email: 'anna@example.com' }
      ];
    const filteredUsers = mockUsers.filter(
        (user) =>
          ( user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.name.toLowerCase().includes(searchTerm.toLowerCase()) ) && !invited.includes(user.id)
      );
      const handleInvite = (userId, name) => {
        setInvited([...invited, userId]);
        setMembers([...members, { id: userId, name: name, accepted: false}]);   
      };

    return (
        <div className="w-full min-h-full flex items-center justify-center">
            {projectExists ? <div className="w-full h-full self-start">
                <ProjectDashboard />
            </div>
            : isLocked 
            ? <div className="max-w-[40vw] h-full flex flex-col items-center justify-center gap-2">
                <h1 className='text-2xl font-bold'>You’re almost there</h1>
                <p className='text-green-med-dark text-center'>Please complete the training phase before you move onto your project. Once you’ve done that, the fun part starts!</p>
                <button className="mt-4 bg-gray-400 text-white py-2 px-6 rounded-full">Create Project 🔒</button>
            </div> 
            : <div className="max-w-[40vw] h-full flex flex-col items-center justify-center gap-2">
                <h1 className='text-2xl font-bold'>Get started</h1>
                <p className='text-green-med-dark text-center'>If you've been chosen as team leader, click the button below to create your project and invite your teammates. If you're not the team leader, then your team invite will be displayed below.</p>
                <button className="mt-4 bg-green-full text-white py-2 px-6 rounded-full" onClick={() => setOpenPopup(true)}>Create Project</button>
                <p className='text-green-med-dark text-center mt-4 bg-green-light px-8 py-4 rounded-2xl'>Name invited you to join their project. <button className="ml-2 bg-green-light border-2 border-green-full text-green-full py-1 px-6 rounded-full">Accept</button></p>
                {openPopup && <div className='fixed flex justify-center items-center inset-0 w-screen h-screen bg-black/25'>
                    <div className='w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
                    <h2 className="text-center text-lg font-medium mb-6">Create Your Project</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="w-full p-3 bg-green-light shadow-sm resize-none border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-full"
                                placeholder="What are the project's goals, tasks etc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                NGO Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 bg-green-light shadow-sm border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-full"
                                placeholder="E.g. Macmillan Cancer Support"
                                value={ngoName}
                                onChange={(e) => setNgoName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 bg-green-light shadow-sm border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-full"
                                placeholder="Project title"
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                className="flex items-center gap-2 text-green-full font-medium hover:underline"
                                onClick={() => setShowInvitePopup(true)}
                            >
                                <span className="bg-green-full text-white rounded-full w-5 h-5 flex justify-center items-center text-sm font-normal">+</span>
                                Invite Members
                            </button>

                            <div className="flex items-center mt-3 space-x-[-10px]">
                                {members.length == 0 ? <p className="text-gray-500 text-sm text-center">No invitees to show</p> 
                                : members.map((member) => (
                                <img
                                    key={member.id}
                                    src={`https://randomuser.me/api/portraits/${member.id % 2 === 0 ? 'men' : 'women'}/${member.id + 10}.jpg`}
                                    alt={member.name}
                                    className="w-8 h-8 rounded-full border-2 border-white"
                                />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setOpenPopup(false)}>Cancel</button>
                            <button type="submit" className="bg-green-full text-white py-2 px-4 rounded-lg hover:bg-green-full/75 transition">Create Project</button>
                        </div>
                    </form>
                    </div>
                    {showInvitePopup && (
                        <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                                <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setShowInvitePopup(false);
                                }}
                                className="absolute top-2 right-3 text-gray-600 text-2xl hover:text-green-med-dark"
                                >
                                &times;
                                </button>

                                <h3 className="text-lg font-medium mb-4 text-green-dark">Search by Name or Email</h3>
                                <input
                                type="text"
                                placeholder="Search for users..."
                                className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                <ul className="space-y-2 max-h-60 overflow-y-auto">
                                {searchTerm.length == 0 ? <p className="text-gray-500 text-sm text-center">Please enter an email</p>
                                : filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                    <li
                                        key={user.id}
                                        className="flex justify-between items-center p-2 border border-gray-200 rounded-md"
                                    >
                                        <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                        <button
                                        onClick={() => handleInvite(user.id, user.name)}
                                        className="bg-green-full text-white px-3 py-1 rounded-md hover:bg-green-full"
                                        >
                                        Invite
                                        </button>
                                    </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm text-center">No users found</p>
                                )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>}
            </div>}
            
        </div>
    )
}

export default Project