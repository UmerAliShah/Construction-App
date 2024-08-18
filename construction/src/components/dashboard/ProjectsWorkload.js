import React from 'react';

const ProjectsWorkload = () => {
  const workloadData = [
    { name: 'Sam', workload: 7 },
    { name: 'Meldy', workload: 8 },
    { name: 'Ken', workload: 2 },
    { name: 'Dmitry', workload: 10 },
    { name: 'Vego', workload: 8 },
    { name: 'Kadin', workload: 2 },
    { name: 'Melm', workload: 4 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Projects Workload</h2>
        <select
          className="appearance-none text-gray-600 py-2 px-4 rounded-lg shadow-sm bg-transparent bg-no-repeat bg-right"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="gray"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>')`,
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.5em 1.5em',
          }}
        >
          <option value="last-3-months">Last 3 months</option>
          {/* Add more filter options here */}
        </select>
      </div>

      <div className="flex justify-around items-end">
        {workloadData.map((person, index) => {
          const circleCount = Math.ceil(person.workload / 2);

          return (
            <div key={index} className="flex flex-col items-center">
              <div className="flex flex-col items-center space-y-1">
                {[...Array(circleCount)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                      i === 0
                        ? person.workload === 10
                          ? 'bg-orange-500 text-white'
                          : 'bg-black text-white'
                        : 'text-black'
                    }`}
                  >
                    {i === 0 && (
                      <span className="text-sm">{person.workload}</span>
                    )}
                  </div>
                ))}
              </div>
              <span className="mt-2 text-gray-600">{person.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsWorkload;
