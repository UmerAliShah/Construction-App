import React, { useState } from 'react';

const TodayTask = () => {
  const tasks = [
    {
      id: 1,
      title: 'Create a user flow of social application design',
      status: 'Approved',
      important: true,
    },
    {
      id: 2,
      title: 'Create a user flow of social application design',
      status: 'InReview',
      important: true,
    },
    {
      id: 3,
      title: 'Landing page design for Fintech project of Singapore',
      status: 'InReview',
      important: false,
    },
    {
      id: 4,
      title: 'Interactive prototype for app screens of deltamine project',
      status: 'OnGoing',
      important: false,
    },
    {
      id: 5,
      title: 'Interactive prototype for app screens of deltamine project',
      status: 'Approved',
      important: true,
    },
  ];

  const [activeTab, setActiveTab] = useState('All');

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Important') return task.important;
    return true;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Heading and Tabs */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700 w-full md:w-auto mb-2 md:mb-0">
          Today task
        </h2>
        <div className="flex flex-wrap w-full md:w-auto space-x-4 md:space-x-8">
          {['All', 'Important', 'Notes', 'Links'].map((tab) => (
            <div
              key={tab}
              className={`cursor-pointer text-gray-600 w-auto mb-2 md:mb-0 ${
                activeTab === tab
                  ? 'font-bold text-blue-500 border-b-2 border-blue-500'
                  : ''
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className="ml-1 text-xs text-gray-500">
                ({tab === 'All' ? tasks.length : tasks.filter((task) => task.important).length})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-gray-200 mb-4"></div>

      {/* Task List */}
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-4 w-full">
              <input
                type="checkbox"
                checked={task.status === 'Approved'}
                className="form-checkbox text-orange-500 rounded-full"
              />
              {/* Remove 'truncate' and apply 'w-full' to allow text wrapping */}
              <span className="text-gray-700 w-full break-words">
                {task.title}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-white ${
                task.status === 'Approved'
                  ? 'bg-green-500'
                  : task.status === 'InReview'
                  ? 'bg-red-500'
                  : task.status === 'OnGoing'
                  ? 'bg-orange-500'
                  : 'bg-gray-500'
              }`}
            >
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodayTask;
