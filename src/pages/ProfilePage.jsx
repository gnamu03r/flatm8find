import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../auth';
import { firestore } from '../auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchMyListings = async () => {
      try {
        const q = query(collection(firestore, 'listings'), where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyListings(data);
      } catch (err) {
        console.error('Error fetching user listings:', err);
      }
    };

    fetchProfile();
    fetchMyListings();
  }, [currentUser]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(firestore, 'listings', id));
      setMyListings(prev => prev.filter(listing => listing.id !== id));
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-lg">
      {profile ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p><strong>Name:</strong> {profile.name || 'No name set'}</p>
          <p><strong>Email:</strong> {profile.email || 'No email set'}</p>
          <Link to="/edit-profile" className="text-blue-500 hover:text-blue-700 block mt-2">
            Edit Profile
          </Link>

          {/* ➕ Post New Listing */}
          <div className="mt-8 flex justify-between items-center">
            <h3 className="text-xl font-semibold">My Listings</h3>
            <Link
              to="/post-listing"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ➕ Post New Listing
            </Link>
          </div>

          {/* Listings */}
          {myListings.length === 0 ? (
            <p className="text-gray-600 mt-2">You haven’t posted any listings yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {myListings.map(listing => (
                <div key={listing.id} className="p-4 border rounded shadow-sm bg-gray-50">
                  <h4 className="text-lg font-bold">{listing.area} - {listing.roomType}</h4>
                  <p className="text-sm text-gray-700">{listing.description}</p>
                  <p className="text-sm mt-1">Rent: ₹{listing.rent}</p>
                  <p className="text-sm">Vacant From: {listing.vacantFrom}</p>
                  <p className="text-sm">Gender Preference: {listing.genderPref}</p>
                  <p className="text-sm">Contact: {listing.contactInfo}</p>
                
                  {/* 👀 Views & ❤️ Likes */}
                  <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                    <span>👀 {listing.views || 0} views</span>
                    <span>❤️ {listing.likes || 0} likes</span>
                  </div>
                
                  <div className="mt-4 flex justify-between">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      <Link to={`/edit-listing/${listing.id}`}>
                        Edit Listing
                      </Link>
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(listing.id)}
                    >
                      Delete Listing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;
