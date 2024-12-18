
import { Priority } from './Priority';

export interface TaskModel {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: Date;
  priority: Priority;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TaskDTO {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    dueDate: Date;
    priority: Priority;
    userId: string;
    createdAt: Date;
    updatedAt?: Date;
  }
  export interface CreateTaskDTO {
    title: string;
    description: string;
    dueDate: Date;
    createdAt: Date;
    priority: Priority;
  }
  export interface UpdateTaskDTO {
    title: string;
    description: string;
    dueDate: Date;
    priority: Priority;
  }

  export interface TaskFilterParams {
    isCompleted?: boolean;
    priority?: Priority;
    dueDateFrom?: Date;
    dueDateTo?: Date;
    searchTerm?: string;
    sortBy?: string;
    sortDescending: boolean;
  }