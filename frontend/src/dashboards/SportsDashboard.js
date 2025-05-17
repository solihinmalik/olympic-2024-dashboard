// src/dashboards/AthletesDashboard.js
import React from 'react';

import AthleteTable from '../features/AthleteTable';
import NextStepsTable from '../features/NextStepTable';

export default function SportsDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      

      <div className="bg-white p-4 rounded shadow">
        <AthleteTable />
      </div>


      <div className="bg-white p-4 rounded shadow">
        <NextStepsTable />
      </div>

    </div>
    
  );
}
