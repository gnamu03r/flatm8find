import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';  // Hook to get current user
import { getUserProfile, saveUserProfile } from '../auth';  // Import functions to get and update profile
import Layout from '../components/Layout';

const EditProfilePage = () => {
  const { currentUser } = useAuth();  // Get current user
  const navigate = useNavigate();  // To redirect after profile update
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;

      try {
        const userProfile = await getUserProfile(currentUser.uid);  // Fetch profile data
        setProfile({
          name: userProfile.displayName || '',
          email: userProfile.email || ''
        });
        setLoading(false);
      } catch (err) {
        setError('Error fetching profile data');
        setLoading(false);
      }
    };

    fetchProfile();  // Fetch the profile on component mount
  }, [currentUser]);

  const handleInputChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value  // Update the corresponding field
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.email) {
      setError('All fields are required!');
      return;
    }

    try {
      // Call saveUserProfile to save the updated profile in Firestore
      await saveUserProfile(currentUser.uid, profile);  // Update Firestore
      navigate('/profile');  // Redirect to the profile page after successful update
    } catch (err) {
      setError('Error updating profile');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      
    <div className="p-6 max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Save Changes
        </button>
      </form>
    </div>
    </Layout>
  );
};

export default EditProfilePage;
