import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Priority } from '../../models/Priority';
import Button from './Button';

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
}

interface TaskFormProps {
  initialData?: TaskFormData;
  onSubmit: (data: TaskFormData) => void;
  isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    defaultValues: initialData || {
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: Priority.Medium,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="form-label">Title</label>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="form-input"
              placeholder="Enter task title"
            />
          )}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="form-label">Description</label>
        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description is required' }}
          render={({ field }) => (
            <textarea
              {...field}
              rows={4}
              className="form-input"
              placeholder="Enter task description"
            />
          )}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="dueDate" className="form-label">Due Date</label>
          <Controller
            name="dueDate"
            control={control}
            rules={{ required: 'Due date is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className="form-input"
              />
            )}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="form-label">Priority</label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <select {...field} className="form-input">
                {Object.values(Priority).map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm; 