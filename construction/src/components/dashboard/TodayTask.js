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
      status: 'In review',
      important: true,
    },
    {
      id: 3,
      title: 'Landing page design for Fintech project of Singapore',
      status: 'In review',
      important: false,
    },
    {
      id: 4,
      title: 'Interactive prototype for app screens of deltamine project',
      status: 'On going',
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
    // Add more tab filtering logic if needed
    return true;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Today task</h2>
        <div className="flex space-x-8">
          {['All', 'Important', 'Notes', 'Links'].map((tab) => (
            <div
              key={tab}
              className={`cursor-pointer text-gray-600 ${
                activeTab === tab
                  ? 'font-bold text-blue-500 border-b-2 border-blue-500'
                  : ''
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className="ml-2 text-xs text-gray-500">
                ({tab === 'All' ? tasks.length : tasks.filter((task) => task.important).length})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-gray-200 mb-4"></div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={task.status === 'Approved'}
                className="form-checkbox text-orange-500 rounded-full"
              />
              <span className="text-gray-700">{task.title}</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-white ${
                task.status === 'Approved'
                  ? 'bg-green-500'
                  : task.status === 'In review'
                  ? 'bg-red-500'
                  : task.status === 'On going'
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
