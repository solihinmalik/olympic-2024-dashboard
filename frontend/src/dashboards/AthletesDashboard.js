import AthleteGenderAgeChart from '../features/AthleteGenderAgeChart';
import TopAthletesGrid from '../features/TopAthleteGrid';
import CountryChart from '../features/CountryChart';

export default function AthletesDashboard() {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-gray-800">Athletes Analysis Dashboard</h1>

      {/* 🥇 Top 10 Countries with Most Athletes */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Top 10 Countries Athlete</h2>
        <CountryChart />
      </div>

      {/* 🥇 Top Medal-Winning Athletes */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Top Medal-Winning Athletes</h2>
        <TopAthletesGrid />
      </div>

      {/* Gender by Age Chart - Full Width */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Athlete Distribution by Gender and Age</h2>
        <AthleteGenderAgeChart />
      </div>


    </div>
  );
}
