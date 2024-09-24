import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Container, Navbar } from "react-bootstrap";
import logo from '../assets/logo.png';
import apiClient from "../api/apiClient";
import { useSelector } from "react-redux";

const Header = () => {
    const [userDetails, setUserDetails] = useState();
    const { userId } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchUserDetails();
      }, [userId]);
      
      const fetchUserDetails = async () => {
        try {
          if (userId) {
            const res = await apiClient.get(`/users/${userId}`);
            console.log(res, userId);
            if (res.status === 200) {
              setUserDetails(res.data);
            }
          } else {
            console.log('User ID not found');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

  return (
    <Navbar className="bg-white shadow-md py-2" expand="lg">
      <Container fluid className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="flex-1 mx-4">
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            {/* Notification Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-orange-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405 1.405A2.032 2.032 0 0117.5 19H16a2 2 0 01-2-2v-.5M9 17H4l1.405 1.405A2.032 2.032 0 006.5 19H8a2 2 0 002-2v-.5m-2.667-8.193c.524-1.166 1.599-2.014 2.951-2.2a5.003 5.003 0 011.732-.034M7.5 12V8a4.5 4.5 0 119 0v4m.5 4v.5a2 2 0 002 2h1.5a2 2 0 001.405-3.595L19 17h-1.5M12 7.5h.008v.008H12V7.5z" />
            </svg>
          </div>
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
  );
};

export default Header;
