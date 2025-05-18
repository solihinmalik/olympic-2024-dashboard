import AthleteGenderAgeChart from '../features/AthleteGenderAgeChart';
import TopAthletesGrid from '../features/TopAthleteGrid';
import AthleteNationalityMap from '../features/AthleteNationalityMap';
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

      {/* Chart + Overview Side-by-Side */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Main Chart Area */}
        <div className="xl:col-span-2 bg-white p-4 rounded shadow">
          <AthleteGenderAgeChart />
        </div>

        {/* Side Panel */}
        <div className="bg-white p-4 rounded shadow">
          <AthleteNationalityMap />
        </div>

      </div>

    </div>
  );
}
