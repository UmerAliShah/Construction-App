import React from 'react';
import GaugeChart from 'react-gauge-chart';

const OverallProgress = () => {
  const data = {
    totalProjects: 95,
    completed: 26,
    delayed: 35,
    ongoing: 35,
  };

  const completedPercentage = (data.completed / data.totalProjects) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Overall Progress</h2>
        <select
          className="appearance-none text-gray-600 py-2 px-4 rounded-lg shadow-sm bg-transparent bg-no-repeat bg-right"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="gray"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>')`,
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.5em 1.5em',
          }}
        >
          <option value="all">All</option>
          {/* You can add more filter options here */}
        </select>
      </div>

      <div className="flex flex-col items-center mb-4">
        <GaugeChart
          id="overall-progress-gauge"
          nrOfLevels={30}
          percent={completedPercentage / 100}
          colors={['#00c853', '#ffeb3b', '#ff5722']}
          arcWidth={0.3}
          arcPadding={0.02}
          cornerRadius={3}
          textColor="#000000"
        />
        <div className="text-center mt-2">
          <h3 className="text-3xl font-bold text-gray-700">{`${Math.round(completedPercentage)}%`}</h3>
          <p className="text-gray-500">Completed</p>
        </div>
      </div>

      <div className="grid grid-cols-4 text-center">
        <div>
          <h4 className="text-xl font-semibold text-gray-700">{data.totalProjects}</h4>
          <p className="text-gray-500">Total projects</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-green-500">{data.completed}</h4>
          <p className="text-gray-500">Completed</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-yellow-500">{data.delayed}</h4>
          <p className="text-gray-500">Delayed</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-orange-500">{data.ongoing}</h4>
          <p className="text-gray-500">Ongoing</p>
        </div>
      </div>
    </div>
  );
};

export default OverallProgress;
