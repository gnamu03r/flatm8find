import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../auth';  // Ensure this function is imported
import { Link } from 'react-router-dom';  // Import Link for navigation

const ProfilePage = () => {
  const { currentUser } = useAuth();  // Get current user from context
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return; // Return if currentUser is null

      try {
        const userProfile = await getUserProfile(currentUser.uid);  // Fetch updated profile data
        setProfile(userProfile);  // Update state with new profile data
      } catch (err) {
        setError(err.message);  // Handle errors
      }
    };

    fetchProfile();  // Call fetchProfile on component mount

  }, [currentUser]);  // Re-run effect whenever currentUser changes (e.g., after profile update)

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg">
      {profile ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p><strong>Name:</strong> {profile.name || 'No name set'}</p> {/* Fallback if name is missing */}
          <p><strong>Email:</strong> {profile.email || 'No email set'}</p> {/* Fallback if email is missing */}

          {/* Link to Edit Profile */}
          <Link to="/edit-profile" className="text-blue-500 hover:text-blue-700">Edit Profile</Link>
        </div>
      ) : (
        <p>Loading profile...</p> /* Show loading message while profile is being fetched */
      )}
    </div>
  );
};

export default ProfilePage;
