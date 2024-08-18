import React from 'react';
import Overview from './Overview';
import Filter from './Filter';
import ProjectSummary from './ProjectSummary';
import OverallProgress from './OverallProgress';
import TodayTask from './TodayTask';
import ProjectsWorkload from './ProjectsWorkload';

const Dashboard = () => {
  return (
    <div className="min-h-screen p-8">
        <div className='flex justify-between'>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>
            <Filter />
        </div>

      {/* Filter and Overview */}
      <div className="items-center mb-6">
        <Overview />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <ProjectSummary />
        </div>

        {/* Right Column */}
        <div>
          <OverallProgress />
        </div>

        {/* Full Width Row */}
        <div className="lg:col-span-2">
          <TodayTask />
        </div>

        {/* Right Column */}
        <div>
          <ProjectsWorkload />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
