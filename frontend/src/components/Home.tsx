import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Task Management</h1>
      <p>Manage your tasks effectively.</p>
      <Link to="/tasks">View Tasks</Link> {/* Link to TaskList */}
    </div>
  );
};

export default Home;
