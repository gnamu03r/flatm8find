// components/SignOutButton.jsx
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './signoutbutton.css';

const SignOutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate('/auth');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <button onClick={handleSignOut} className="btn text-white hover:text-gray-200">
      Sign Out
    </button>
  );
};

export default SignOutButton;
