import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskModel, TaskFilterParams } from '../models/TaskModel';
import { Priority } from '../models/Priority';
import axiosClient from '../axiosClient';
import Button from './ui/Button';
import TaskCard from './ui/TaskCard';
import Loading from './ui/Loading';
import FilterBar from './ui/FilterBar';
import Modal from './ui/Modal';
import { toast } from 'react-hot-toast';

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilterParams>({
    sortDescending: true
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    taskId: number | null;
    taskTitle: string;
  }>({
    isOpen: false,
    taskId: null,
    taskTitle: ''
  });

  const handleFilterChange = (newFilters: TaskFilterParams) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({ sortDescending: true });
  };

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      
      // Basic filters
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.isCompleted !== undefined) params.append('isCompleted', String(filters.isCompleted));
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      
      // Date filters
      if (filters.dueDateFrom) {
        const fromDate = new Date(filters.dueDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        params.append('dueDateFrom', fromDate.toISOString());
      }
      if (filters.dueDateTo) {
        const toDate = new Date(filters.dueDateTo);
        toDate.setHours(23, 59, 59, 999);
        params.append('dueDateTo', toDate.toISOString());
      }

      // Sorting
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
      }
      if (filters.sortDescending !== undefined) {
        params.append('sortDescending', String(filters.sortDescending));
      }

      const response = await axiosClient.get('/api/tasks', { params });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleDeleteClick = (taskId: number, taskTitle: string) => {
    setDeleteModal({
      isOpen: true,
      taskId,
      taskTitle
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.taskId) return;

    try {
      await axiosClient.delete(`/api/tasks/${deleteModal.taskId}`);
      setTasks(tasks.filter((task) => task.id !== deleteModal.taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setDeleteModal({ isOpen: false, taskId: null, taskTitle: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, taskId: null, taskTitle: '' });
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await axiosClient.patch(`/api/tasks/${id}/complete`);
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      ));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Link to="/create-task">
          <Button variant="primary">Create New Task</Button>
        </Link>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={() => handleDeleteClick(task.id, task.title)}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found. Create a new task to get started!</p>
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteModal.taskTitle}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default TaskList;
