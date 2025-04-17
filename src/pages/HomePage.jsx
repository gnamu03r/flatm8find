import React, { useEffect, useState } from 'react';
import { firestore } from '../auth';
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://via.placeholder.com/160x100?text=No+Image';

// Utility function to split listings into two columns
const splitIntoColumns = (listings) => {
  const left = [];
  const right = [];
  listings.forEach((item, idx) => {
    if (idx % 2 === 0) left.push(item);
    else right.push(item);
  });
  return [left, right];
};

const ListingCard = ({ listing, handleViewDetailsClick }) => {
  const getDaysAgo = (timestamp) => {
    if (!timestamp?.seconds) return null;
    const createdDate = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Posted today' : `Posted ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg flex h-[90px] text-xs shadow-sm overflow-hidden">
      <div className="w-[100px] h-full flex-shrink-0">
        <img
          src={listing.images?.[0]?.url || DEFAULT_IMAGE}
          alt="Listing"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 truncate text-sm">
              {listing.area} - {listing.roomType}
            </h3>
            <span className="text-green-600 font-medium">₹{listing.rent}</span>
          </div>
          <div className="text-gray-500">{getDaysAgo(listing.createdAt)}</div>
        </div>
        <div className="flex justify-between items-center text-gray-600 mt-1">
          <Link
            to={`/listing/${listing.id}`}
            onClick={() => handleViewDetailsClick(listing.id)}
            className="text-blue-500 hover:underline"
          >
            View
          </Link>
          <div className="flex gap-2">
            <span title="Upvotes">👍 {listing.upvotes || 0}</span>
            <span title="Views">👁️ {listing.views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [femaleOnly, setFemaleOnly] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(collection(firestore, 'listings'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  const handleViewDetailsClick = async listingId => {
    try {
      const listingRef = doc(firestore, 'listings', listingId);
      await updateDoc(listingRef, {
        views: increment(1),
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const filteredAndSortedListings = listings
    .filter(listing => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        listing.area?.toLowerCase().includes(query) ||
        listing.roomType?.toLowerCase().includes(query);

      const matchesGender =
        !femaleOnly ||
        listing.genderPref?.toLowerCase().includes('female');

      return matchesSearch && matchesGender;
    })
    .sort((a, b) => {
      if (sortOption === 'rent-asc') return a.rent - b.rent;
      if (sortOption === 'rent-desc') return b.rent - a.rent;
      if (sortOption === 'views-desc') return (b.views || 0) - (a.views || 0);
      if (sortOption === 'upvotes-desc') return (b.upvotes || 0) - (a.upvotes || 0);
      if (sortOption === 'date-desc') return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      return 0;
    });

  const [leftColumn, rightColumn] = splitIntoColumns(filteredAndSortedListings);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto mt-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Available Listings</h2>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by area or room type..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-1/2 text-sm"
        />
        <div className="flex items-center gap-4">
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            className="border p-2 rounded-md w-full sm:w-auto text-sm"
          >
            <option value="">Sort by</option>
            <option value="rent-asc">Rent: Low to High</option>
            <option value="rent-desc">Rent: High to Low</option>
            <option value="views-desc">Most Viewed</option>
            <option value="upvotes-desc">Most Upvoted</option>
            <option value="date-desc">Newest First</option>
          </select>
          <label className="inline-flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={femaleOnly}
              onChange={() => setFemaleOnly(!femaleOnly)}
              className="form-checkbox h-4 w-4 text-pink-500"
            />
            <span>Female-only</span>
          </label>
        </div>
      </div>

      {/* True two-column layout */}
      <div className="flex flex-col md:flex-row gap-4 max-h-[75vh] overflow-y-auto">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-3 pr-2">
          {leftColumn.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              handleViewDetailsClick={handleViewDetailsClick}
            />
          ))}
        </div>
        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-3 pl-2">
          {rightColumn.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              handleViewDetailsClick={handleViewDetailsClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
