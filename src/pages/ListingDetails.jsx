import React, { useEffect, useState } from 'react';
import { firestore } from '../auth';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Assuming you have this hook

const ListingDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth(); // 👈 get logged-in user
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingRef = doc(firestore, 'listings', id);
        const listingSnap = await getDoc(listingRef);
        
        if (listingSnap.exists()) {
          setListing(listingSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    fetchListing();
  }, [id]);

  if (!listing) return <div>Loading...</div>;

  const isOwnListing = currentUser && listing.uid === currentUser.uid;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{listing.area} - {listing.roomType}</h2>

      {/* Image Grid */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {listing.images && listing.images.length > 0 ? (
          listing.images.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Listing Image ${index + 1}`}
              className="w-full h-48 object-cover rounded-md"
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      <div className="p-4">
        <p className="text-lg">Rent: ₹{listing.rent}</p>
        <p className="text-sm">Vacant From: {listing.vacantFrom}</p>
        <p className="text-sm">Gender Preference: {listing.genderPref}</p>
        <p className="text-sm">Description: {listing.description}</p>
        <p className="text-sm">Contact: {listing.contactInfo}</p>

        <div className="flex justify-between items-center mt-4">
          {/* 👍 Upvote Button */}
          {isOwnListing ? (
            <button className="text-gray-400 cursor-not-allowed" disabled>
              Upvote (Disabled for your own listing)
            </button>
          ) : (
            <button
              onClick={() => console.log("Upvote clicked!")}
              className="text-yellow-500 hover:text-yellow-600"
            >
              Upvote
            </button>
          )}

          <p className="text-sm">👀 {listing.views || 0} views</p>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
