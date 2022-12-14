import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../hooks/UseUserAuth";
const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();
    return user? children : <Navigate to="/login" />
}

export default ProtectedRoute;