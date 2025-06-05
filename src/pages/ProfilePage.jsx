import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../auth';
import { firestore } from '../auth';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import './profilepage.css';
import PROFILE_IMAGE from '../assets/profileimg.png';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      try {
        const q = query(collection(firestore, 'listings'), where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyListings(data);
      } catch (err) {
        setError('Error fetching your listings. Please try again later.');
      } finally {
        setLoading(false);
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
      alert('Listing deleted successfully!');
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Error deleting the listing. Please try again.');
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <Layout>
      <div className="profile_window">
        {profile ? (
          <>
            <h2 className="profile_title">Profile</h2>
            <div className="profile_header">
              <div className="profile_image_wrapper">
                <div htmlFor="profileImage">
                  <img
                    src={PROFILE_IMAGE  }
                    alt="Profile"
                    className="profile_image hover:opacity-80"
                  />
                </div>
              </div>
              <div className="profile_details">
                <p><strong>Name:</strong> {profile.name || 'No name set'}</p>
                <p><strong>Email:</strong> {profile.email || 'No email set'}</p>
                <Link to="/edit-profile" className="edit_profile">
                  Edit Profile
                </Link>
              </div>
            </div>

            <div className="post_subheaders">
              <div className='post_subheader'>
                <h3 className="post_mylisting">My Listings</h3>
              <Link
                to="/post-listing"
                className="post_postlisting"
                >
                <div className='post_icon'>
                +</div> <div>Post New Listing</div>
              </Link>
                </div>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="post_listingwindow">
                {myListings.length === 0 ? (
                  <p className="text-gray-600 mt-2">You haven't posted any listings yet.</p>
                ) : (
                  myListings.map(listing => (
                    <div key={listing.id} className="post_listings">
                      <h4 className="text-lg font-bold">{listing.area} - {listing.roomType}</h4>
                      <p className="text-sm text-gray-700">{listing.description}</p>
                      <p className="text-sm mt-1">Rent: ₹{listing.rent}</p>
                      <p className="text-sm">Vacant From: {listing.vacantFrom}</p>
                      <p className="text-sm">Gender Preference: {listing.genderPref}</p>
                      <p className="text-sm">Contact: {listing.contactInfo}</p>

                      <div className="profile_subsub">
                        <span><i className='bx bx-upvote'></i> {listing.likes || 0} upvotes</span>
                        <span>{listing.views || 0} views</span>
                      </div>

                      <div className="profile_buttons">
                        <button className="profile_btn_item">
                          <Link to={`/edit-listing/${listing.id}`}>Edit Listing</Link>
                        </button>
                        <button
                          className="profile_btn_item item_delete"
                          onClick={() => handleDelete(listing.id)}
                        >
                          Delete Listing
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
