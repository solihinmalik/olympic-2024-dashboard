// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: '220px' }}>
      <h4 className="text-center">🏅 Olympics</h4>
      <ul className="nav flex-column mt-4">
        <li className="nav-item">
          <Link className="nav-link text-white" to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/athletes">Athletes Analysis</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/medals">Medals Analysis</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/sports">Sports Analysis</Link>
        </li>
      </ul>
    </div>
  );
}
