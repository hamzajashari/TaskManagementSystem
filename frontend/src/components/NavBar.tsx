import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/tasks">Task List</Link>
        </li>
        <li>
          <Link to="/create-task">Create Task</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
