import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import TaskForm from './ui/TaskForm';
import Loading from './ui/Loading';
import { UpdateTaskDTO } from '../models/TaskModel';
import type { TaskFormData } from './ui/TaskForm';

const EditTask = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axiosClient.get(`/api/tasks/${id}`);
        const taskData = response.data;
        setTask({
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString().split('T')[0],
        });
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleSubmit = async (formData: TaskFormData) => {
    setIsSaving(true);
    try {
      const taskData: UpdateTaskDTO = {
        ...formData,
        dueDate: new Date(formData.dueDate)
      };
      await axiosClient.put(`/api/tasks/${id}`, taskData);
      navigate('/tasks');
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
        <TaskForm
          initialData={task}
          onSubmit={handleSubmit}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
};

export default EditTask;
