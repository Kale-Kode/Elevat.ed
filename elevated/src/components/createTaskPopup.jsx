import React, { useState } from 'react'
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { supabase } from "../integrations/supabase/client"; 

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreateTaskPopup = ({ onClose, teamMembers, project, setColumns }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Low');
    const [assignees, setAssignees] = useState([]);
    const [assigneeName, setAssigneeName] = useState([]);
    const [dueDate, setDueDate] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const newTask = { title, description, priority, assignees, dueDate };
      console.log('New Task:', newTask);
      // then insert to DB
      const { data: taskData, error } = await supabase
          .from('Project_tasks')
          .upsert({ 
              project_id: project.project_id,
              task_title: title,
              task_description: description,
              status: 'todo',
              priority: priority,
              due_date: dueDate,
              created_at: new Date()
          })
          .select()
      if (error) throw error;
      else console.log('new task added to table: ', taskData)
      // and render on screen
      setColumns((prevColumns) => {
        return {
          ...prevColumns,
          ['todo']: [...prevColumns['todo'], taskData[0]], // Append new task
        };
      })

      const newTaskId = taskData?.[0]?.task_id;
      assignees.forEach(async (assignee) => {
          const { data: assigneeData, error } = await supabase
            .from('Project_task_assignees')
            .upsert({ 
                task_id: newTaskId,
                project_member_id: assignee,
            })
            .select()
          if (error) throw error;
          else console.log('new task assignee added: ', assigneeData)
      })
      onClose(); // Close modal after submit
    };
  
    return (
      <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-xl max-h-[80vh] overflow-auto shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input
                className="w-full p-3 bg-green-light shadow-sm border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-full"
                value={title}
                placeholder='e.g. brainstorming'
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-3 bg-green-light shadow-sm resize-none border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-full"
                rows={3}
                value={description}
                placeholder='e.g. come up with ideas for social campaign'
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="w-full p-3 bg-green-light shadow-sm border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-full"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Assignees</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={assignees}
                    onChange={(event) => {
                        const {target: { value },} = event;
                        setAssignees(
                          // On autofill we get a stringified value.
                          typeof value === 'string' ? value.split(',') : value,
                        );
                      }}
                    input={<OutlinedInput id="select-multiple-chip" label="Assignees" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((id) => {
                            const member = teamMembers.find(m => m.member.project_member_id === id);
                            return (
                              <Chip key={id} label={member?.profile?.name || 'Unknown'} />
                            );
                          })}
                        </Box>
                      )}
                       
                    MenuProps={MenuProps}
                >
                {teamMembers.map((member) => (
                    <MenuItem
                        key={member.member.project_member_id}
                        value={member.member.project_member_id}
                        >
                        {member.profile.name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                className="w-full p-3 bg-green-light shadow-sm border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-full"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
  
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-1 text-sm border-none rounded-md hover:bg-gray-100"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 text-sm bg-green-full text-white rounded-md hover:bg-green-full/75"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
export default CreateTaskPopup