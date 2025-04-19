import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { SquarePen, SendHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as fetchData from "../utils/fetchData"
import CreateTaskPopup from './createTaskPopup';
import TaskCard from './taskCard';

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
      className="bg-white p-3 rounded-xl border-2 border-green-light mb-3 shadow-sm hover:cursor-grab"
    >
      {children}
    </div>
  );
};

const DroppableColumn = ({ id, title, count, color, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-green-light rounded-lg p-3 min-h-[200px]">
      <h4 className={`font-semibold text-sm mb-2 text-${color}-600`}>
        • {title} <span className="text-gray-500">({count})</span>
      </h4>
      {children}
    </div>
  );
};

const ProjectDashboard = ( { project } ) => {
  // store project states below
  const [teamMembers, setTeamMembers] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  // task stored here in lists
  const [columns, setColumns] = React.useState({
    todo: [],
    inprogress: [],
    done: [],
  });

  // fetch members, tasks, chat messages etc here and store in states above
  useEffect(() => {
    const fetchProjectData = async () => {
      // fetch MEMBERS
      const teamMembers = await fetchData.select("Project_members", "*", "project_id", project.project_id)
      const memberProfiles = await Promise.all(teamMembers.map(async (member) => ({
        member: member,
        profile: await fetchData.selectSingle("Users", "*", "profile_id", member.profile_id),
      })))
      console.log(memberProfiles)
      setTeamMembers(memberProfiles)

      // fetch TASKS
      const projectTasksData = await fetchData.select("Project_tasks", "*", "project_id", project.project_id)
      console.log(projectTasksData)
      // Create a copy of the empty columns on component mount
      const updatedColumns = {
        todo: [],
        inprogress: [],
        done: [],
      };
      // Fill the correct arrays
      projectTasksData.forEach(task => {
        if (task.status in updatedColumns) { // prevent errors
          updatedColumns[task.status].push(task);
        }
      });
      // update state once
      setColumns(updatedColumns);
    }
    fetchProjectData()
  }, [])

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const sourceCol = Object.keys(columns).find((colId) =>
      columns[colId].some((task) => task.task_id === active.id)
    );

    const destinationCol = over.id;

    if (sourceCol && destinationCol && sourceCol !== destinationCol) {
      setColumns((prev) => {
        // update local state
        const taskToMove = prev[sourceCol].find((task) => task.task_id === active.id);
        if (!taskToMove) return prev;
      
        const newSource = prev[sourceCol].filter((task) => task.task_id !== active.id);
        const newDestination = [...prev[destinationCol], taskToMove];
      
        return {
          ...prev,
          [sourceCol]: newSource,
          [destinationCol]: newDestination,
        };
      });

      const updateStatus = async () => {
        console.log('status destination: ', destinationCol, 'for task: ', active.id)
        const taskToUpdate = columns[sourceCol].find(task => task.task_id === active.id);
        if (!taskToUpdate) return;
        try {
          // Update the status in Supabase
          await fetchData.update("Project_tasks", { status: destinationCol }, "task_id", active.id);
        } catch (error) {
          console.error("Failed to update task status in Supabase:", error);
        }
      }
      updateStatus()
    }
  };

  // chat scroll to bottom on load
  const chatContainerRef = React.useRef(null);
  useEffect(() => {
  if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
  }, []); // or add messages as dependency if dynamic

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row gap-6 h-screen font-sans">
        {openPopup && <CreateTaskPopup onClose={() => setOpenPopup(false)} teamMembers={teamMembers} project={project} setColumns={setColumns}
          />}
        {/* Left Section */}
        <div className="flex-1 flex flex-col relative">
          {/* Project Info */}
          <button className="absolute top-4 right-4 text-white bg-green-full p-1 rounded-md hover:bg-green-full/75">
                <SquarePen size={16} />
          </button>
          <div className="bg-white p-4 rounded-xl shadow mb-6">
            <h2 className="text-xl font-semibold">
              {project.project_name}
            </h2>
            <p className="text-sm mt-1"><strong>NGO:</strong> {project.project_ngo}</p>
            <p className="mt-2 text-sm text-gray-700">
              <strong>Description:</strong> {project.project_description}
            </p>
            <p className="mt-2 text-sm">
              <strong>Upcoming deadline:</strong> Mid-term presentation <span className="text-green-full font-semibold">due 25/05/25</span>
            </p>
          </div>

          {/* Tasks Section */}
          <div className="bg-white p-4 rounded-xl shadow flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Project Tasks</h3>
              <button className="bg-green-full text-white text-sm px-4 py-1 rounded-full hover:bg-green-full/75" onClick={() => setOpenPopup(true)}>Create Task +</button>
            </div>

            <div className="grid md:grid-cols-3 gap-2 flex-1">
              {['todo', 'inprogress', 'done'].map((columnId) => {
                const columnTitle = {
                  todo: 'To Do',
                  inprogress: 'In Progress',
                  done: 'Done',
                }[columnId];

                const columnColor = {
                  todo: 'blue',
                  inprogress: 'yellow',
                  done: 'green',
                }[columnId];

                return (
                  <DroppableColumn
                    key={columnId}
                    id={columnId}
                    title={columnTitle}
                    count={columns[columnId].length}
                    color={columnColor}
                    className='overflow-y-auto'
                  >
                    {columns[columnId].map((task) => (
                      <TaskCard task={task}/>
                    ))}
                  </DroppableColumn>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Section: Team + Chat */}
        <div className="w-full md:w-[300px] flex flex-col max-h-screen gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Team members</h3>
              <button className="text-sm text-lime-600 font-semibold hover:underline">+ Invite</button>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://randomuser.me/api/portraits/thumb/men/${i}.jpg`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0"
                />
              ))}
              <div className="text-sm bg-lime-100 text-lime-700 rounded-full px-2 py-0.5 ml-2">+1</div>
              <span className="text-sm text-gray-600 ml-1">See all</span>
            </div>
          </div>

          {/* Chat */}
          <div className="bg-white rounded-xl shadow flex flex-col max-h-[75%]">
            <h3 className="p-4 font-semibold mb-1">Team Chat</h3>
            <div className= "p-4 flex-1 overflow-y-auto space-y-3 text-sm text-gray-700" ref={chatContainerRef}>
              <div><strong>Devon</strong> <span className="text-gray-400">11:03 AM</span><br/> Hi! I’m Devon from UWC Maastricht. Nice to meet you all!</div>
              <div><strong>Jamie Ross</strong> <span className="text-gray-400">11:03 AM</span><br/> Hi everyone, I’m Jamie from UWC Maastricht.</div>
              <div><strong>Jessica Summers</strong> <span className="text-gray-400">11:03 AM</span><br/> Hey team, Jess here from St Clare’s.</div>
              <div><strong>Sally McArthur</strong> <span className="text-gray-400">11:05 AM</span><br/> Hey! I’m Sally, also from St. Clare’s. Looking forward to collaborating!</div>
              <div><strong>Jeremy Sallee</strong> <span className="text-gray-400">11:05 AM</span><br/> Hi! I’m Jeremy from FIS. Nice to meet you all!</div>
              <div><strong>Me</strong> <span className="text-gray-400">11:06 AM</span><br/> Hi! I’m Brandon from FIS too. Thanks for picking me as team leader!</div>
              <div><strong>Me</strong> <span className="text-gray-400">11:06 AM</span><br/> We have been tasked to build a comprehensive donor breakdown, and build a newsletter that is sent to each donor weekly.</div>
            </div>
            <div className='mt-2 border-t-2 border-green-med-dark/10 flex px-4 py-3 gap-2'>
                <input
                className="border-none text-sm focus:outline-none flex-1"
                placeholder="Reply..."
                />
                <button onClick={() => console.log("Sending message...")}><SendHorizontal className='opacity-50 hover:opacity-75 transition' size={16}/></button>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default ProjectDashboard;
