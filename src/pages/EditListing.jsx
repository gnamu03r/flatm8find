import React, { useState, useEffect } from 'react';
import { firestore } from '../auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';

const EditListingPage = () => {
  const { id } = useParams();  // Get the listing ID from the URL params
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);  // Track loading state
  const [updatedListing, setUpdatedListing] = useState({});

  useEffect(() => {
    // Fetch the listing data when the component mounts
    const fetchListing = async () => {
      try {
        const listingRef = doc(firestore, 'listings', id);
        const listingDoc = await getDoc(listingRef);
        
        if (listingDoc.exists()) {
          // Set the initial form values with the fetched listing data
          setListing(listingDoc.data());
          setUpdatedListing(listingDoc.data());  // Set the editable state for the form
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
    if (!updatedListing.area || !updatedListing.roomType || !updatedListing.rent) {
      setError('Please fill out all fields');
      return;
    }

    try {
      const listingRef = doc(firestore, 'listings', id);
      await updateDoc(listingRef, updatedListing);  // Update the listing with new data
      navigate('/profile');  // Navigate to the profile page after successful update
    } catch (err) {
      setError('Error updating listing');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
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

        <label>Vacant From</label>
        <input
          type="date"
          name="vacantFrom"
          value={updatedListing.vacantFrom || ''}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label>Gender Preference</label>
        <input
          type="text"
          name="genderPref"
          value={updatedListing.genderPref || ''}
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
  );
};

export default EditListingPage;
