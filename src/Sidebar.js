import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as DepartmentIcon } from './components/Icons/department.svg';
import { ReactComponent as OfficeIcon } from './components/Icons/Office.svg';
import { ReactComponent as ProjectsIcon } from './components/Icons/Projects.svg';
import { ReactComponent as MachinaryIcon } from './components/Icons/Machinary.svg';
import { ReactComponent as LogoutIcon } from './components/Icons/Logout.svg';

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleToggle = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const DropdownIcon = ({ isOpen }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
    >
      <path
        d="M7 10l5 5 5-5"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 space-y-4 flex-1">
        <div>
          <div
            className="flex items-center cursor-pointer justify-between"
            onClick={() => handleToggle('department')}
          >
            <div className="flex items-center">
              <DepartmentIcon className="!text-orange-500 w-6 h-6" />
              <span className="ml-2">Department</span>
            </div>
            <DropdownIcon isOpen={openDropdown === 'department'} />
          </div>
          {openDropdown === 'department' && (
            <div className="ml-6 mt-2">
              <NavLink
                to="/finances"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Finances
              </NavLink>
              <NavLink
                to="/financial-requests"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Financial Requests
              </NavLink>
            </div>
          )}
        </div>

        <div>
          <div
            className="flex items-center cursor-pointer justify-between"
            onClick={() => handleToggle('office')}
          >
            <div className="flex items-center">
              <OfficeIcon className="!text-orange-500 w-6 h-6" />
              <span className="ml-2">Office</span>
            </div>
            <DropdownIcon isOpen={openDropdown === 'office'} />
          </div>
          {openDropdown === 'office' && (
            <div className="ml-6 mt-2">
              <NavLink
                to="/ipc-tracking"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                IPC Tracking
              </NavLink>
              <NavLink
                to="/office-finances"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Finances
              </NavLink>
              <NavLink
                to="/office-progress"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Progress
              </NavLink>
            </div>
          )}
        </div>

        <div>
          <div
            className="flex items-center cursor-pointer justify-between"
            onClick={() => handleToggle('projects')}
          >
            <div className="flex items-center">
              <ProjectsIcon className="!text-orange-500 w-6 h-6" />
              <span className="ml-2">Projects</span>
            </div>
            <DropdownIcon isOpen={openDropdown === 'projects'} />
          </div>
          {openDropdown === 'projects' && (
            <div className="ml-6 mt-2">
              <NavLink
                to="/employees"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Employees
              </NavLink>
              <NavLink
                to="/vendors"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Vendors
              </NavLink>
              <NavLink
                to="/project-finances"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Finances
              </NavLink>
              <NavLink
                to="/project-inventory"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Inventory
              </NavLink>
              <NavLink
                to="/project-progress"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Progress
              </NavLink>
              <NavLink
                to="/supply-tracking"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Supply Tracking
              </NavLink>
              <NavLink
                to="/salaries"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Salaries
              </NavLink>
            </div>
          )}
        </div>

        <div>
          <div
            className="flex items-center cursor-pointer justify-between"
            onClick={() => handleToggle('machinery')}
          >
            <div className="flex items-center">
              <MachinaryIcon className="!text-orange-500 w-6 h-6" />
              <span className="ml-2">Machinery</span>
            </div>
            <DropdownIcon isOpen={openDropdown === 'machinery'} />
          </div>
          {openDropdown === 'machinery' && (
            <div className="ml-6 mt-2">
              <NavLink
                to="/company-inventory"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Company Inventory
              </NavLink>
              <NavLink
                to="/site-inventory"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Site Inventory
              </NavLink>
              <NavLink
                to="/machinery-finances"
                className={({ isActive }) => (isActive ? 'block py-1 !text-orange-500' : 'block py-1')}
              >
                Machinery Finances
              </NavLink>
            </div>
          )}
        </div>
      </div>
        <NavLink to="/logout" className={({ isActive }) => (isActive ? 'ml-2 !text-orange-500' : 'ml-2')}>
            <div className="p-4 border-t flex items-center">
                    <LogoutIcon className="!text-orange-500 w-6 h-6" />
                    <span className="ml-2">Logout</span>
            </div>
        </NavLink>
    </div>
  );
};

export default Sidebar;
