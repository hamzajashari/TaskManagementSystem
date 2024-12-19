import axiosClient from '../axiosClient';
import { TaskModel, CreateTaskDTO, UpdateTaskDTO, TaskFilterParams } from '../models/TaskModel';

export const taskService = {
  getTasks: async (filters: TaskFilterParams) => {
    const params = new URLSearchParams();
    
    // Basic filters
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.isCompleted !== undefined) params.append('isCompleted', String(filters.isCompleted));
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    
    // Date filters
    if (filters.dueDateFrom) {
      params.append('dueDateFrom', filters.dueDateFrom.toISOString());
    }
    if (filters.dueDateTo) {
      params.append('dueDateTo', filters.dueDateTo.toISOString());
    }
    
    // Sorting
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDescending !== undefined) {
      params.append('sortDescending', String(filters.sortDescending));
    }
    
    const response = await axiosClient.get('/api/tasks', { params });
    return response.data;
  },

  createTask: async (taskData: CreateTaskDTO) => {
    const response = await axiosClient.post('/api/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: number, taskData: UpdateTaskDTO) => {
    const response = await axiosClient.put(`/api/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: number) => {
    await axiosClient.delete(`/api/tasks/${id}`);
  },

  toggleComplete: async (id: number) => {
    const response = await axiosClient.patch(`/api/tasks/${id}/complete`);
    return response.data;
  }
}; 