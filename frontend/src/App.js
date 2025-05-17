// src/App.js
import React from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SummaryCards from './features/SummaryCards';
import StageChart from './features/StageChart';
import CountryChart from './features/CountryChart';
import AthleteTable from './features/AthleteTable';
import WinConversionChart from './features/WinConversionChart';
import NextStepsTable from './features/NextStepTable';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 space-y-6">
          <SummaryCards />
          
          
          {/* Athlete Count by Countries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="bg-white p-4 rounded shadow h-full">
              <CountryChart />
            </div>
            <div className="bg-white p-4 rounded shadow h-full">
              <WinConversionChart />
            </div>
          </div>

          {/* List of Athletes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="bg-white p-4 rounded shadow">
              <AthleteTable />
            </div>
            <div className="bg-white p-4 rounded shadow">
              <NextStepsTable />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;
