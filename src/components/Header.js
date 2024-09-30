import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";
import logo from "../assets/logo.png";
import apiClient from "../api/apiClient";
import { useSelector } from "react-redux";
import Sidebar from "../Sidebar"; // Import the Sidebar component here

const Header = () => {
  const [userDetails, setUserDetails] = useState();
  const { userId } = useSelector((state) => state.auth);

  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      if (userId) {
        const res = await apiClient.get(`/users/${userId}`);
        if (res.status === 200) {
          setUserDetails(res.data);
        }
      } else {
        console.log("User ID not found");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <>
      {/* Navbar with Hamburger Menu */}
      <Navbar className="bg-white shadow-md py-2" expand="lg">
        <Container fluid className="flex items-center justify-between">
          {/* Hamburger Menu for mobile screens */}
          <div className="flex md:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-700 focus:outline-none"
            >
              {/* Hamburger Icon */}
              {isSidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-auto md:h-12" // Adjust height for mobile (h-10) and for larger screens (md:h-12)
              />
            </Link>
          </div>

          {/* Search bar for larger screens */}
          <div className="hidden md:flex flex-1 mx-4">
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* User Info Section */}
          <div className="flex items-center space-x-4">
            <div className="text-gray-700 flex flex-col items-end">
              <span className="mr-2">{userDetails?.name}</span>
              <span className="text-sm text-gray-500">{userDetails?.role}</span>
            </div>
            <img
              src={userDetails?.profileImage} // Replace with the actual path to the profile picture
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
          </div>
        </Container>
      </Navbar>

      {/* Sidebar with background overlay */}
      <div className="flex">
        <div
          className={`fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-20 bg-white shadow-md`}
        >
          <Sidebar toggleSidebar={toggleSidebar} />
        </div>

        {/* Background overlay for mobile when the sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10"
            onClick={toggleSidebar} // Clicking on the background should close the sidebar
          ></div>
        )}
      </div>
    </>
  );
};

export default Header;
