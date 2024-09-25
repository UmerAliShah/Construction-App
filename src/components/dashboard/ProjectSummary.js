import React, { useState } from 'react';

const projects = [
  {
    name: 'Nelsa web development',
    manager: 'Om Prakash Sao',
    dueDate: 'May 25, 2023',
    status: 'Completed',
    progress: 100,
  },
  {
    name: 'Datascale AI app',
    manager: 'Neilson Mando',
    dueDate: 'Jun 20, 2023',
    status: 'Delayed',
    progress: 35,
  },
  {
    name: 'Media channel branding',
    manager: 'Tiruvelly Priya',
    dueDate: 'July 13, 2023',
    status: 'At risk',
    progress: 88,
  },
  {
    name: 'Corlax iOS app development',
    manager: 'Matte Hanney',
    dueDate: 'Dec 20, 2023',
    status: 'Completed',
    progress: 100,
  },
  {
    name: 'Website builder development',
    manager: 'Sukumar Rao',
    dueDate: 'Mar 15, 2024',
    status: 'Ongoing',
    progress: 50,
  },
];

const ProjectSummary = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleProjectChange = (e) => setSelectedProject(e.target.value);
  const handleManagerChange = (e) => setSelectedManager(e.target.value);
  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        {/* Heading and selection on separate lines for mobile */}
        <div className="flex flex-wrap justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700 w-full md:w-auto">Project summary</h2>
          <div className="flex flex-wrap w-full md:w-auto mt-2 md:mt-0 space-x-0 md:space-x-4">
            {/* The select elements are stacked on mobile */}
            <select
              className="appearance-none text-gray-600 py-2 px-4 rounded-lg shadow-sm bg-transparent bg-no-repeat bg-right w-full md:w-auto mb-2 md:mb-0"
              style={{
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="gray"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>')`,
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
              }}
              value={selectedProject}
              onChange={handleProjectChange}
            >
              <option value="">Project</option>
              {projects.map((project, index) => (
                <option key={index} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              className="appearance-none text-gray-600 py-2 px-4 rounded-lg shadow-sm bg-transparent bg-no-repeat bg-right w-full md:w-auto mb-2 md:mb-0"
              style={{
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="gray"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>')`,
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
              }}
              value={selectedManager}
              onChange={handleManagerChange}
            >
              <option value="">Project Manager</option>
              {projects.map((project, index) => (
                <option key={index} value={project.manager}>
                  {project.manager}
                </option>
              ))}
            </select>

            <select
              className="appearance-none text-gray-600 py-2 px-4 rounded-lg shadow-sm bg-transparent bg-no-repeat bg-right w-full md:w-auto"
              style={{
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="gray"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>')`,
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
              }}
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="">Status</option>
              {['Completed', 'Delayed', 'At risk', 'Ongoing'].map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table should remain within the box */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Project Manager</th>
              <th className="px-4 py-2">Due Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Progress</th>
            </tr>
          </thead>
          <tbody>
            {projects
              .filter((project) =>
                selectedProject ? project.name.includes(selectedProject) : true
              )
              .filter((project) =>
                selectedManager ? project.manager.includes(selectedManager) : true
              )
              .filter((project) =>
                selectedStatus ? project.status.includes(selectedStatus) : true
              )
              .map((project, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{project.name}</td>
                  <td className="px-4 py-2">{project.manager}</td>
                  <td className="px-4 py-2">{project.dueDate}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        project.status === 'Completed'
                          ? 'bg-green-500'
                          : project.status === 'Delayed'
                          ? 'bg-yellow-500'
                          : project.status === 'At risk'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            {`${project.progress}%`}
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${project.progress}%` }}
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                            project.progress === 100
                              ? 'bg-green-500'
                              : project.progress < 50
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectSummary;
