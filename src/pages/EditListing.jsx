import React, { useState, useEffect } from 'react';
import { firestore } from '../auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatedListing, setUpdatedListing] = useState({});

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingRef = doc(firestore, 'listings', id);
        const listingDoc = await getDoc(listingRef);

        if (listingDoc.exists()) {
          setListing(listingDoc.data());
          setUpdatedListing(listingDoc.data());
          setIsLoading(false);
        } else {
          setError('Listing not found');
          setIsLoading(false);
        }
      } catch (err) {
        setError('Error fetching listing data');
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedListing(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    const { area, roomType, rent, genderPref, contactInfo, description } = updatedListing;

    if (!area || !roomType || !rent || !genderPref || !contactInfo || !description) {
      setError('Please fill out all fields');
      return;
    }

    try {
      const listingRef = doc(firestore, 'listings', id);
      await updateDoc(listingRef, updatedListing);
      navigate('/profile');
    } catch (err) {
      setError('Error updating listing');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>

    <div className="p-6 max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Listing</h2>

      <div>
        <label>Area</label>
        <input
          type="text"
          name="area"
          value={updatedListing.area || ''}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label>Room Type</label>
        <input
          type="text"
          name="roomType"
          value={updatedListing.roomType || ''}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label>Rent</label>
        <input
          type="number"
          name="rent"
          value={updatedListing.rent || ''}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          />

        <label>Gender Preference</label>
        <select
          name="genderPref"
          value={updatedListing.genderPref || ''}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          >
          <option value="">Select Gender Preference</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Any">Both</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          value={updatedListing.description || ''}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          />

        <label>Contact Info</label>
        <input
          type="text"
          name="contactInfo"
          value={updatedListing.contactInfo || ''}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Save Changes
        </button>
      </div>
    </div>
          </Layout>
  );
};

export default EditListingPage;
