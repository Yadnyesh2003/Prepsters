// pages/Admin.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Admin = () => {
  const { logoutUser } = useAuth();
  return (
    <div className="min-h-screen flex">
      {/* Sidebar, navbar or layout components can go here */}

      <div className="flex-1 p-6">
        <Outlet /> {/* 👈 This renders the nested route (like add-pyqs) */}
        <button onClick={logoutUser}>Logout</button>
      </div>
    </div>
  );
};

export default Admin;
