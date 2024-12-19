import { useState, useCallback } from 'react';
import { TaskModel, TaskFilterParams } from '../models/TaskModel';
import { taskService } from '../services/taskService';
import { toast } from 'react-hot-toast';

export const useTask = () => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async (filters: TaskFilterParams) => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(filters);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  }, []);

  const toggleTaskComplete = useCallback(async (id: number) => {
    try {
      await taskService.toggleComplete(id);
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      ));
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
      console.error('Error toggling task completion:', error);
    }
  }, []);

  return {
    tasks,
    loading,
    fetchTasks,
    deleteTask,
    toggleTaskComplete
  };
}; 