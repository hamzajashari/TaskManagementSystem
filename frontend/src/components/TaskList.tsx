import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskModel } from '../models/TaskModel';
import axiosClient from '../axiosClient';

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosClient.get('/api/tasks');
        console.log(response.data);
        
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const deleteTask = async (id: number) => {
    try {
      await axiosClient.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Task List</h1>
      <Link to="/create-task">
        <button>Create Task</button>
      </Link>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <div>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <Link to={`/tasks/${task.id}`}>
                <button>View Details</button>
              </Link>
              <Link to={`/edit-task/${task.id}`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
