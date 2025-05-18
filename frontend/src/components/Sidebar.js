// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Medal,
  Dribbble,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar({ onToggle }) {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: 'Landing Page', path: '/', icon: <Home size={20} /> },
    { label: 'Athletes Analysis', path: '/dashboard/athletes', icon: <Users size={20} /> },
    { label: 'Medals Analysis', path: '/dashboard/medals', icon: <Medal size={20} /> },
    { label: 'Sports Analysis', path: '/dashboard/sports', icon: <Dribbble size={20} /> },
];

  const handleToggle = () => {
    setCollapsed(!collapsed);
    onToggle(!collapsed);
  };

  return (
    <div
      className={`h-screen bg-gray-900 text-white transition-all duration-300 p-4 shadow-lg flex flex-col fixed top-0 left-0 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        {!collapsed && <h2 className="text-xl font-bold">🏅 Olympics</h2>}
        <button onClick={handleToggle} className="text-gray-400 hover:text-white">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <ul className="space-y-2 flex-1">
        {navItems.map(({ label, path, icon }) => (
          <li
            key={path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group ${
              pathname === path
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Link to={path} className="flex items-center gap-3 w-full">
              {icon}
              {!collapsed && <span>{label}</span>}
            </Link>
            {/* Tooltip */}
            {collapsed && (
              <span className="absolute left-14 z-50 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
