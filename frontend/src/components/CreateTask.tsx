import React, { useState } from 'react';
import { CreateTaskDTO } from '../models/TaskModel';
import { Priority } from '../models/Priority';

const CreateTaskForm: React.FC = () => {
  const [task, setTask] = useState<CreateTaskDTO>({
    title: '',
    description: '',
    dueDate: new Date(),
    createdAt: new Date(),
    priority: Priority.Low,
  });

  // Generic change handler for input, textarea, and select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Special handling for date input to convert the string to a Date object
    if (type === 'date') {
      setTask((prevTask) => ({ ...prevTask, [name]: new Date(value) }));
    } else if (type === 'select-one') {
      setTask((prevTask) => ({ ...prevTask, [name]: Number(value) })); // Convert string to number for priority
    } else {
      setTask((prevTask) => ({ ...prevTask, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call API to create task using the CreateTaskDTO model
    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      console.log('Task created');
    } else {
      console.error('Error creating task');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Task Title"
      />
      <textarea
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Task Description"
      />
      <input
        type="date"
        name="dueDate"
        value={task.dueDate.toISOString().split('T')[0]} // Handle date formatting
        onChange={handleChange}
      />
      <select
        name="priority"
        value={task.priority}
        onChange={handleChange}
      >
        <option value={Priority.Low}>Low</option>
        <option value={Priority.Medium}>Medium</option>
        <option value={Priority.High}>High</option>
      </select>
      <button type="submit">Create Task</button>
    </form>
  );
};

export default CreateTaskForm;
