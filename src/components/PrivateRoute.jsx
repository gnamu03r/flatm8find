import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Custom hook to check auth status

const PrivateRoute = () => {
  const { currentUser } = useAuth(); // Access the current user from the auth context

  if (currentUser === null) {
    // If the auth state is still loading (currentUser is null), you might want to show a loading screen
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    // If no user is logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If user is logged in, render the child routes (using Outlet)
  return <Outlet />;
};

export default PrivateRoute;
