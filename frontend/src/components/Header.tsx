import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Admin</span>
            <Link 
              to="/logout" 
              className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
