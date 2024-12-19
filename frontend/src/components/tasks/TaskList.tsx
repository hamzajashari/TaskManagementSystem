import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskFilterParams } from '../../models/TaskModel';
import { useTask } from '../../hooks/useTask';
import Button from '../ui/Button';
import TaskCard from '../ui/TaskCard';
import Loading from '../ui/Loading';
import FilterBar from '../ui/FilterBar';
import Modal from '../ui/Modal';

const TaskList = () => {
  const { tasks, loading, fetchTasks, deleteTask, toggleTaskComplete } = useTask();
  const [filters, setFilters] = useState<TaskFilterParams>({ sortDescending: true });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    taskId: null as number | null,
    taskTitle: ''
  });

  useEffect(() => {
    fetchTasks(filters);
  }, [filters, fetchTasks]);

  const handleDeleteClick = (taskId: number, taskTitle: string) => {
    setDeleteModal({ isOpen: true, taskId, taskTitle });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.taskId) {
      await deleteTask(deleteModal.taskId);
      setDeleteModal({ isOpen: false, taskId: null, taskTitle: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, taskId: null, taskTitle: '' });
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
        onFilterChange={setFilters}
        onResetFilters={() => setFilters({ sortDescending: true })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={() => handleDeleteClick(task.id, task.title)}
            onToggleComplete={() => toggleTaskComplete(task.id)}
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