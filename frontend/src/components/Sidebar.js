import React from 'react';

export default function Sidebar() {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: '220px' }}>
      <h4 className="text-center">🏅 Olympics</h4>
      <ul className="nav flex-column mt-4">
        <li className="nav-item">
          <a className="nav-link text-white" href="#">Dashboard</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#">Athletes</a>
        </li>
      </ul>
    </div>
  );
}
