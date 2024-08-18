import React from 'react';
import { ReactComponent as RevenueIcon } from '../../components/Icons/revenue.svg';
import { ReactComponent as TimeSpentIcon } from '../../components/Icons/timeSpent.svg';
import { ReactComponent as ProjectDashboardIcon } from '../../components/Icons/projectDashboard.svg';
import { ReactComponent as ResourcesIcon } from '../../components/Icons/resources.svg';

const Overview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#f9faff] p-6 rounded-lg shadow-md text-left">
        <div className="flex mb-4">
          <RevenueIcon className="h-8 w-8 text-[#c89dd5]" />
        </div>
        <h2 className="text-lg font-semibold text-gray-600">Total revenue</h2>
        <p className="text-2xl font-bold text-black">$53,00989</p>
        <p className="text-sm text-green-500">12% increase from last month</p>
      </div>
      <div className="bg-[#f9faff] p-6 rounded-lg shadow-md text-left">
        <div className="flex mb-4">
          <ProjectDashboardIcon className="h-8 w-8 text-[#f4b183]" />
        </div>
        <h2 className="text-lg font-semibold text-gray-600">Projects</h2>
        <p className="text-2xl font-bold text-black">95 / 100</p>
        <p className="text-sm text-red-500">10% decrease from last month</p>
      </div>
      <div className="bg-[#f9faff] p-6 rounded-lg shadow-md text-left">
        <div className="flex mb-4">
          <TimeSpentIcon className="h-8 w-8 text-[#9fc5e8]" />
        </div>
        <h2 className="text-lg font-semibold text-gray-600">Time spent</h2>
        <p className="text-2xl font-bold text-black">1022 / 1300 Hrs</p>
        <p className="text-sm text-green-500">8% increase from last month</p>
      </div>
      <div className="bg-[#f9faff] p-6 rounded-lg shadow-md text-left">
        <div className="flex mb-4">
          <ResourcesIcon className="h-8 w-8 text-[#f6b26b]" />
        </div>
        <h2 className="text-lg font-semibold text-gray-600">Resources</h2>
        <p className="text-2xl font-bold text-black">101 / 120</p>
        <p className="text-sm text-green-500">2% increase from last month</p>
      </div>
    </div>
  );
};

export default Overview;
