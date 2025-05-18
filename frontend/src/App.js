// src/App.js
import React, { useState } from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import SummaryCards from './features/SummaryCards';
import AthleteTable from './features/AthleteTable';
import NextStepsTable from './features/NextStepTable';
import WorldMapMedals from './features/WorldMapMedals';

import AthletesDashboard from './dashboards/AthletesDashboard';
import MedalsDashboard from './dashboards/MedalsDashboard';
import SportsDashboard from './dashboards/SportsDashboard';

import LandingPage from './components/LandingPage'; 

function DashboardLayout({ isSidebarCollapsed, setIsSidebarCollapsed }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onToggle={setIsSidebarCollapsed} />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Header />
        <main className="p-6 space-y-6">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SummaryCards />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <div className="bg-white p-4 rounded shadow h-full overflow-auto">
                      <WorldMapMedals />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <div className="bg-white p-4 rounded shadow">
                      <AthleteTable />
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                      <NextStepsTable />
                    </div>
                  </div>
                </>
              }
            />
            <Route path="/athletes" element={<AthletesDashboard />} />
            <Route path="/medals" element={<MedalsDashboard />} />
            <Route path="/sports" element={<SportsDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Landing page at root */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard layout and routes */}
        <Route
          path="/dashboard/*"
          element={
            <DashboardLayout
              isSidebarCollapsed={isSidebarCollapsed}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
