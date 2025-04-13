import { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Firebase authentication instance
import { onAuthStateChanged } from 'firebase/auth';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return { currentUser };
};

export { useAuth };
