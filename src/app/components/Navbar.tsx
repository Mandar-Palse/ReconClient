'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  return (
    <div className="bg-red shadow flex items-center justify-between p-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="flex items-center gap-4">
        <span>Welcome, Admin</span>
        <img
          src="/avator.png"
          alt="avatar"
          className="w-8 h-8 rounded-full border"
        />
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 ml-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors shadow-sm"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;