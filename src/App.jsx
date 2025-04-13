import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MatchPage from './pages/MatchPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component
import EditProfilePage from './pages/EditProfilePage'; 

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-blue-500 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white font-bold text-2xl">FlatMate Finder</h1>
            <div className="space-x-4">
              <a href="/" className="text-white hover:text-gray-200">Home</a>
              <a href="/profile" className="text-white hover:text-gray-200">Profile</a>
              <a href="/matches" className="text-white hover:text-gray-200">Matches</a>
              <a href="/login" className="text-white hover:text-gray-200">Login</a>
              <a href="/signup" className="text-white hover:text-gray-200">Signup</a>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* PrivateRoute wrapper for protected pages */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/matches" element={<MatchPage />} />
          </Route>

          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
