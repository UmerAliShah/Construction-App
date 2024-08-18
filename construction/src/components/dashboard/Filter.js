import React from 'react';

const Filter = () => {
  return (
    <div className="flex justify-end mb-4">
      <div className="relative">
        <button className="bg-white border border-gray-300 text-gray-600 py-2 px-4 rounded-lg shadow-md hover:bg-gray-100">
          Last 30 days
        </button>
      </div>
    </div>
  );
};

export default Filter;
