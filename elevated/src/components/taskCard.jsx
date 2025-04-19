import React from 'react'
import { useEffect, useState } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import * as fetchData from "../utils/fetchData"

const priorityColours = { // predefined colours for task priorities
    'High': 'red-500',
    'Medium': 'orange-500',
    'Low': 'yellow-600'
  }

const DraggableCard = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="relative bg-white p-3 rounded-xl border-2 border-green-light mb-3 shadow-sm hover:cursor-grab"
    >
      {children}
    </div>
  );
};

const TaskCard = ({ task }) => {
    const [assignees, setAssignees] = useState([]);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const fetchAssigneeData = async () => {
        try {
            const assigneesData = await fetchData.select("Project_task_assignees", "*", "task_id", task.task_id);
            setAssignees(assigneesData);
            console.log(assigneesData)

            // Fetch all profiles in parallel
            const profilePromises = assigneesData.map(async (assignee) => {
                const profile_id = await fetchData.selectSingle("Project_members", "profile_id", "project_member_id", assignee.project_member_id);
                const profile = await fetchData.selectSingle("Users", "*", "profile_id", profile_id.profile_id);
                return profile;
            });
            const resolvedProfiles = await Promise.all(profilePromises);
            setProfiles(resolvedProfiles);
        } catch (error) {
            console.error("Failed to fetch assignees:", error);
        }
        };

        fetchAssigneeData();
    }, []);
        
    return (
        <DraggableCard id={task.task_id} key={task.task_id}>
            <div className={`text-xs text-${priorityColours[task.priority]} bg-${priorityColours[task.priority]}/10 w-fit px-2 py-1 rounded-md font-semibold mb-1`}>
                {task.priority}
            </div>
            <p className="font-semibold text-sm">{task.task_title}</p>
            <p className="text-xs text-gray-500 line-clamp-5">{task.task_description}</p>
            <div className='absolute top-2 right-1 flex gap-0.5'>
                {profiles.map((profile) => (
                <div key={profile.profile_id} className='relative group'>
                    <p className='absolute whitespace-nowrap -top-8 left-1/2 -translate-x-1/2 bg-white/90 text-xs text-black px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition'>{profile.name}</p>
                    <img src={profile.pfp} alt={profile.name} className={`object-cover w-6 h-6 rounded-full`}/>
                </div>
                ))}
            </div>
        </DraggableCard>
    )
}

export default TaskCard