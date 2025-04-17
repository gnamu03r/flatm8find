import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import PostListing from './pages/PostListing';
import ListingDetails from './pages/ListingDetails';
import EditListing from './pages/EditListing';
import SignOutButton from './components/SignOutButton'; // Move this to components ideally
import AuthPage from './pages/AuthPage'; // Assuming you have an AuthPage component
import EmailAuthPage from './pages/EmailAuthPage';
import PhoneAuthPage from './pages/PhoneAuthPage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-blue-500 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white font-bold text-2xl">FlatMate Finder</h1>
            <div className="space-x-4">
              <Link to="/" className="text-white hover:text-gray-200">Home</Link>
              {user && (
                <>
                  <Link to="/profile" className="text-white hover:text-gray-200">Profile</Link>
                  <Link to="/post-listing" className="text-white hover:text-gray-200">Post a Listing</Link>
                  <SignOutButton />
                </>
              )}
              {!user && (
                <Link to="/auth" className="text-white hover:text-gray-200">
                  Login/Signup
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listing/:id" element={<ListingDetails />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-listing/:id" element={<EditListing />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/post-listing" element={<PostListing />} />
          </Route>

          {/* Public Routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/email" element={<EmailAuthPage />} />
          <Route path="/auth/phone" element={<PhoneAuthPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
