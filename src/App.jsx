import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import PostListing from './pages/PostListing';
import ListingDetails from './pages/ListingDetails';
import EditListing from './pages/EditListing';
import SignOutButton from './components/SignOutButton';
import AuthPage from './pages/AuthPage';
import EmailAuthPage from './pages/EmailAuthPage';
import PhoneAuthPage from './pages/PhoneAuthPage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import logoimage from './assets/logo.png';

const App = () => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // ✅ New flag

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true); // ✅ Ensure auth state is known
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="nav_window">
        {/* Navigation Bar */}
        <nav className="nav_bar">
          <div className="nav_header">
            <h1 className="nav_title">
              <Link to="/" className="logo_link">
                <img className="logo" src={logoimage} alt="logo" />
              <p className='logo_text1'>Flatmate</p><p className='logo_text2'>Finder</p>
              </Link>
            </h1>
            <div className="nav_menu">
              <Link to="/" className="nav_item">Home</Link>
              {user ? (
                <>
                  <Link to="/profile" className="nav_item">Profile</Link>
                  <Link to="/post-listing" className="nav_item">Post a Listing</Link>
                  <SignOutButton />
                </>
              ) : (
                <Link to="/auth" className="nav_item nav_login">Login/Signup</Link>
              )}
            </div>
          </div>
        </nav>

        {/* Routes - only show after Firebase has determined auth state */}
        {authChecked ? (
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
        ) : (
          <div className="text-center p-6">Loading...</div> // Optional: can show a spinner
        )}
      </div>
    </Router>
  );
};

export default App;
