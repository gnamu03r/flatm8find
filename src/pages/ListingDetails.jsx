import React, { useEffect, useState } from 'react';
import { firestore } from '../auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { arrayUnion, arrayRemove } from 'firebase/firestore';

const ListingDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [listing, setListing] = useState(null);
  const [userUpvoted, setUserUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [views, setViews] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingRef = doc(firestore, 'listings', id);
        const listingSnap = await getDoc(listingRef);

        if (listingSnap.exists()) {
          const listingData = listingSnap.data();
          setListing(listingData);
          setUpvoteCount(listingData.upvotes || 0);
          setUserUpvoted(listingData.upvotedBy?.includes(currentUser?.uid));
          setViews(listingData.views || 0);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    fetchListing();
  }, [id, currentUser]);

  const handleUpvote = async () => {
    if (!currentUser) {
      console.log("You need to be logged in to upvote.");
      return;
    }

    try {
      const listingRef = doc(firestore, 'listings', id);
      const updatedUpvoteCount = userUpvoted ? upvoteCount - 1 : upvoteCount + 1;

      await updateDoc(listingRef, {
        upvotes: updatedUpvoteCount,
        upvotedBy: userUpvoted
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid)
      });

      setUpvoteCount(updatedUpvoteCount);
      setUserUpvoted(!userUpvoted);
    } catch (error) {
      console.error('Error updating upvote:', error);
    }
  };

  if (!listing) return <div>Loading...</div>;

  const isOwnListing = currentUser && listing.uid === currentUser.uid;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{listing.area} - {listing.roomType}</h2>

      {/* Image Grid */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {listing.images && listing.images.length > 0 ? (
          listing.images.map((imgObj, index) => (
            <img
              key={index}
              src={imgObj.url}
              alt={`Listing Image ${index + 1}`}
              className="w-full h-48 object-cover rounded-md"
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      <div className="p-4 space-y-2">
        <p className="text-lg font-semibold">Rent: ₹{listing.rent}</p>
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
              onClick={handleUpvote}
              className={`text-yellow-500 hover:text-yellow-600 ${userUpvoted ? 'font-bold' : ''}`}
            >
              {userUpvoted ? 'Unvote' : 'Upvote'}
              <p className="text-sm">{upvoteCount}</p>
            </button>
          )}

          {/* Display views count */}
          <p className="text-sm">Views: {views}</p>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
