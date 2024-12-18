import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../axiosClient';

const EditTask = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState({ title: '', description: '', status: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const response = await axiosClient.get(`/api/tasks/${id}`);
          setTask(response.data);
        } catch (error) {
          console.error('Error fetching task:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (id) {
        await axiosClient.put(`/api/tasks/${id}`, task);
      } else {
        await axiosClient.post('/api/tasks', task);
      }
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{id ? 'Edit Task' : 'Create Task'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            required
          />
        </label>
        <label>
          Status:
          <select
            value={task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditTask;
