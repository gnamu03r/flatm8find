import React, { useEffect, useState } from 'react';
import { firestore } from '../auth';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Import useAuth hook to get current user

const HomePage = () => {
  const { currentUser } = useAuth(); // Get current user
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(collection(firestore, 'listings'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  const handleViewClick = async (id, views) => {
    try {
      // Increment the view count
      const listingRef = doc(firestore, 'listings', id);
      await updateDoc(listingRef, { views: views + 1 });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Available Listings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Show first image */}
            <div className="h-48 bg-gray-200">
              <img
                src={listing.images && listing.images[0]} // Assuming images are an array
                alt="Listing Image"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold">{listing.area} - {listing.roomType}</h3>
              <p className="text-sm text-gray-700">Rent: ₹{listing.rent}</p>

              {/* Details Link */}
              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/listing/${listing.id}`}
                  className="text-blue-500 hover:underline"
                  onClick={() => handleViewClick(listing.id, listing.views || 0)}
                >
                  View Details
                </Link>
              </div>

              {/* Views & Likes */}
              <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                <span>👀 {listing.views || 0} views</span>
                <span>❤️ {listing.likes || 0} likes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
