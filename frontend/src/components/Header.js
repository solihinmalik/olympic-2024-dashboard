// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
          Welcome to Olympics 2024 Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          This dashboard has been developed by <span className="text-blue-600 font-semibold">Group 2</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">Group 2</p>
          <p className="text-xs text-gray-500">group2@gmail.com</p>
        </div>
        <img
          src="https://i.pravatar.cc/40?img=68"
          alt="Profile"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </header>
  );
};

export default Header;
