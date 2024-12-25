import React from "react";
import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useTokenStore } from "../stores/store";

interface JwtPayload {
  exp: number;
}

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = useTokenStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
