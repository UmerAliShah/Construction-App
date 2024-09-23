import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Wrapper for protecting routes
const ProtectedRoutes = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
