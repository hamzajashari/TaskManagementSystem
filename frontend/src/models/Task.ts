import { Priority } from './enums/Priority';

export interface TaskModel {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: Date;
  priority: Priority;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
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
  updatedAt: Date | null;
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
  sortDescending?: boolean;
} 