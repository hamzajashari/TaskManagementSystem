import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import TaskForm from './ui/TaskForm';
import type { TaskFormData } from './ui/TaskForm';
import { Priority } from '../models/Priority';
import { toast } from 'react-hot-toast';

const getPriorityValue = (priority: Priority): number => {
  switch (priority) {
    case Priority.Low:
      return 0;
    case Priority.Medium:
      return 1;
    case Priority.High:
      return 2;
    default:
      return 0;
  }
};

const CreateTask = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: TaskFormData) => {
    setIsLoading(true);
    try {
      // Format the date properly for SQL Server
      const dueDate = new Date(formData.dueDate);
      dueDate.setHours(23, 59, 59);

      // Create the task data without wrapping
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: getPriorityValue(formData.priority),
        dueDate: dueDate.toISOString(),
        createdAt: new Date().toISOString(),
      };

      console.log('Sending task:', taskData);

      // Send the request
      const response = await axiosClient.post('/api/tasks', taskData);
      console.log('Response:', response);

      toast.success('Task created successfully!');
      navigate('/tasks');
    } catch (error: any) {
      console.error('Full error:', error);
      const errorMessage = error.response?.data?.errors?.Title?.[0] 
        || error.response?.data?.title 
        || 'Failed to create task. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <button
            onClick={() => navigate('/tasks')}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
        <TaskForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CreateTask;
