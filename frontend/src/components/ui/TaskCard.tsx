import React from 'react';
import { Link } from 'react-router-dom';
import { TaskModel } from '../../models/TaskModel';
import Button from './Button';

interface TaskCardProps {
  task: TaskModel;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onToggleComplete }) => {
  const priorityColors = {
    Low: 'bg-blue-100 text-blue-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onToggleComplete(task.id)}
          >
            {task.isCompleted ? '✓ Done' : 'Mark Done'}
          </Button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{task.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <Link to={`/edit-task/${task.id}`}>
            <Button variant="secondary" size="sm">Edit</Button>
          </Link>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 