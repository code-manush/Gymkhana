import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Spinner from "../common/Spinner";

/**
 * PrivateRoute – wraps a component and redirects unauthenticated users to login.
 *
 * Usage:
 *   <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While auth state is being restored from localStorage, show a spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not logged in → go to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
