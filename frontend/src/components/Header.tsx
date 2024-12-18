import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="header">
      <h1>Task Management</h1>
      <Link to="/logout">
        <button>Logout</button>
      </Link>
    </div>
  );
};

export default Header;
