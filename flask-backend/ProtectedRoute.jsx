// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Login from "../mockme/src/components/login/login";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
