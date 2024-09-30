import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as DepartmentIcon } from "./components/Icons/department.svg";
import { ReactComponent as OfficeIcon } from "./components/Icons/Office.svg";
import { ReactComponent as ProjectsIcon } from "./components/Icons/Projects.svg";
import { ReactComponent as MachinaryIcon } from "./components/Icons/Machinary.svg";
import { ReactComponent as LogoutIcon } from "./components/Icons/Logout.svg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/counterSlice";
import apiClient from "./api/apiClient";

export const fetchSites = async (setProjects) => {
  try {
    const result = await apiClient.get("/projects");
    if (result.status === 200) {
      setProjects(result.data);
    }
  } catch (error) {
    console.error("Error fetching sites:", error);
  }
};

const Sidebar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation(); // To track route change and reset the state if necessary
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const [openDropdown, setOpenDropdown] = useState(null); // To manage dropdown state
  const [selectedProject, setSelectedProject] = useState(null); // To track the selected project
  const [projects, setProjects] = useState([]); // To store fetched projects
  const [activeProject, setActiveProject] = useState(null); // Track active project

  // Fetch projects when the role changes
  useEffect(() => {
    fetchSites(setProjects);
  }, [role]);

  // Track URL changes to reset the selected project when necessary
  useEffect(() => {
    setSelectedProject(null); // Reset the selected project when the route changes
  }, []);

  // Handle toggling dropdown sections
  const handleToggle = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  // Handle project selection and navigate to the project page
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setActiveProject(project); // Set the clicked project as active
    toggleSidebar(); // Close the sidebar on mobile/tablet views
  };

  // Handle user logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Reusable dropdown icon with rotation animation
  const DropdownIcon = ({ isOpen }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-200 ${
        isOpen ? "transform rotate-180" : ""
      }`}
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
        {role === "owner" ? (
          <div>
            <div
              className="flex items-center cursor-pointer justify-between"
              onClick={() => handleToggle("department")}
            >
              <div className="flex items-center">
                <DepartmentIcon className="!text-orange-500 w-6 h-6" />
                <span className="ml-2">Department</span>
              </div>
              <DropdownIcon isOpen={openDropdown === "department"} />
            </div>
            {openDropdown === "department" && (
              <div className="ml-6 mt-2">
                <NavLink
                  to="/finances"
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    isActive ? "block py-1 !text-orange-500" : "block py-1"
                  }
                >
                  Finances
                </NavLink>
                <NavLink
                  to="/financial-requests"
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    isActive ? "block py-1 !text-orange-500" : "block py-1"
                  }
                >
                  Financial Requests
                </NavLink>
              </div>
            )}
          </div>
        ) : null}

        {/* Office Section */}
        {(role === "owner" ||
          role === "owner_assistant" ||
          role === "office_assistant") && (
          <div>
            <div
              className="flex items-center cursor-pointer justify-between"
              onClick={() => handleToggle("office")}
            >
              <div className="flex items-center">
                <OfficeIcon className="!text-orange-500 w-6 h-6" />
                <span className="ml-2">Office</span>
              </div>
              <DropdownIcon isOpen={openDropdown === "office"} />
            </div>
            {openDropdown === "office" && (
              <div className="ml-6 mt-2">
                <NavLink
                  to="/ipc-tracking"
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    isActive ? "block py-1 !text-orange-500" : "block py-1"
                  }
                >
                  IPC Tracking
                </NavLink>
                <NavLink
                  to="/office-finances"
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    isActive ? "block py-1 !text-orange-500" : "block py-1"
                  }
                >
                  Finances
                </NavLink>
                <NavLink
                  to="/employees"
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    isActive ? "block py-1 !text-orange-500" : "block py-1"
                  }
                >
                  Employees
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* Projects Section */}
        {(role === "owner" ||
          role === "owner_assistant" ||
          role === "site_head" ||
          role === "site_assistant") && (
          <div>
            <div
              className="flex items-center cursor-pointer justify-between"
              onClick={() => handleToggle("projects")}
            >
              <div className="flex items-center">
                <ProjectsIcon className="!text-orange-500 w-6 h-6" />
                <span className="ml-2">Projects</span>
              </div>
              <DropdownIcon isOpen={openDropdown === "projects"} />
            </div>
            {openDropdown === "projects" && (
              <div className="ml-6 mt-2">
                {projects.map((item, index) => (
                  <div key={index}>
                    <NavLink
                      onClick={() => handleProjectClick(item)}
                      className={
                        activeProject && activeProject.name === item.name
                          ? "block py-1 !text-orange-500"
                          : "block py-1"
                      }
                    >
                      {item.name}
                    </NavLink>
                    {selectedProject && selectedProject.name === item.name && (
                      <div className="ml-4">
                        <NavLink
                          to={`/${item._id}/employees`}
                          onClick={toggleSidebar}
                          state={{ data: selectedProject }}
                          className={({ isActive }) =>
                            isActive
                              ? "block py-1 !text-orange-500"
                              : "block py-1"
                          }
                        >
                          Employees
                        </NavLink>
                        <NavLink
                        to={`/${item._id}/pending-finances`}
                          onClick={toggleSidebar}
                          state={{ data: selectedProject }}
                          className={({ isActive }) =>
                            isActive
                              ? "block py-1 !text-orange-500"
                              : "block py-1"
                          }
                        >
                          Pending Finances
                        </NavLink>
                        <NavLink
                          to={`/${item._id}/vendors`}
                          onClick={toggleSidebar}
                          className={({ isActive }) =>
                            isActive
                              ? "block py-1 !text-orange-500"
                              : "block py-1"
                          }
                        >
                          Vendors
                        </NavLink>
                        <NavLink
                          to={`/${item._id}/project-finances`}
                          state={{ data: selectedProject }}
                          onClick={toggleSidebar}
                          className={({ isActive }) =>
                            isActive
                              ? "block py-1 !text-orange-500"
                              : "block py-1"
                          }
                        >
                          Finances
                        </NavLink>
                        <NavLink
                          to={`/${item._id}/project-inventory`}
                          onClick={toggleSidebar}
                          className={({ isActive }) =>
                            isActive
                              ? "block py-1 !text-orange-500"
                              : "block py-1"
                          }
                        >
                          Inventory
                        </NavLink>
                        <NavLink
                          to={`/${item._id}/project-progress`}
                          onClick={toggleSidebar}
                          className={({ isActive }) =>
                            isActive
                              ? "block py-1 !text-orange-500"
                              : "block py-1"
                          }
                        >
                          Progress
                        </NavLink>
                        <NavLink
                          to={`/${item._id}/supply-tracking`}
                          onClick={toggleSidebar}
                          className={({ isActive }) =>
                            isActive
                              ? "block py-1 !text-orange-500"
                              : "block py-1"
                          }
                        >
                          Supply Tracking
                        </NavLink>
                        <NavLink
                          to={`/${item._id}/salaries`}
                          onClick={toggleSidebar}
                          state={{ data: selectedProject }}
                          className={({ isActive }) =>
                            isActive
                              ? "block py-1 !text-orange-500"
                              : "block py-1"
                          }
                        >
                          Salaries
                        </NavLink>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Machinery Section */}
        {(role === "owner" ||
          role === "owner_assistant" ||
          role === "site_head" ||
          role === "site_assistant") && (
          <div>
            <div
              className="flex items-center cursor-pointer justify-between"
              onClick={() => handleToggle("machinery")}
            >
              <div className="flex items-center">
                <MachinaryIcon className="!text-orange-500 w-6 h-6" />
                <span className="ml-2">Machinery</span>
              </div>
              <DropdownIcon isOpen={openDropdown === "machinery"} />
            </div>
            {openDropdown === "machinery" && (
              <div className="ml-6 mt-2">
                <NavLink
                  to="/company-inventory"
                  className={({ isActive }) =>
                    isActive ? "block py-1 !text-orange-500" : "block py-1"
                  }
                >
                  Company Inventory
                </NavLink>
                <NavLink
                  to="/site-inventory"
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    isActive ? "block py-1 !text-orange-500" : "block py-1"
                  }
                >
                  Site Inventory
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Section */}
      <NavLink
        className={({ isActive }) =>
          isActive ? "ml-2 !text-orange-500" : "ml-2"
        }
        onClick={handleLogout}
      >
        <div className="p-4 border-t flex items-center">
          <LogoutIcon className="!text-orange-500 w-6 h-6" />
          <span className="ml-2">Logout</span>
        </div>
      </NavLink>
    </div>
  );
};

export default Sidebar;
