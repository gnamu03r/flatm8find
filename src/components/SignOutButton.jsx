// components/SignOutButton.jsx
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

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
    <button onClick={handleSignOut} className="text-white hover:text-gray-200">
      Sign Out
    </button>
  );
};

export default SignOutButton;
