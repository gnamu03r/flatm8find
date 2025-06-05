import React, { useEffect, useState } from 'react';
import { firestore } from '../auth';
import './home.css';
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import defaultImage from '../assets/home-button4.png';

const DEFAULT_IMAGE = defaultImage;

const ListingCard = ({ listing, handleViewDetailsClick }) => {
  const getDaysAgo = (timestamp) => {
    if (!timestamp?.seconds) return null;
    const createdDate = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Posted today' : `Posted ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const photoCount = listing.images?.length || 0;

  return (
    <div className="home_card">
      <div className="card_image relative">
        <img
          src={listing.images?.[0]?.url || DEFAULT_IMAGE}
          alt="Listing"
          className="w-full h-full object-cover rounded-t-md"
        />
        {photoCount >= 1 && (
          <div className="photo_cnt">{photoCount}+ photos</div>
        )}
      </div>
      <div className="listing_info">
        <div className="listing_name">
          <h3>{listing.area}</h3><p></p>
          <p className="listing_rent">₹{listing.rent} per person</p>
        </div>
        <div className="listing_day">{getDaysAgo(listing.createdAt)}</div>
        <div className="listing_info2">
          <Link
            to={`/listing/${listing.id}`}
            onClick={() => handleViewDetailsClick(listing.id)}
            className="view_btn"
          >
            View Details
          </Link>
          <div className="listing_stats">
            <span title="Upvotes"><i className='bx bx-upvote'></i>{listing.upvotes || 0}</span>
            <span title="Views">Views {listing.views || 0}</span>
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
  const [genderFilter, setGenderFilter] = useState('');

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
        genderFilter === '' ||
        listing.genderPref?.toLowerCase().includes(genderFilter);

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

  return (
    <Layout>
      <div className="listing_available">
        <h2 className="avl">Available Listings ({filteredAndSortedListings.length}+)</h2>

        <div className="header2">
          <div className="listing_control">
            <input
              type="text"
              placeholder="Search by area or room type..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="listing_search"
            />
            <div className="listing_sortfilter">
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className="sort_select"
              >
                <option value="">Sort by</option>
                <option value="rent-asc">Rent: Low to High</option>
                <option value="rent-desc">Rent: High to Low</option>
                <option value="views-desc">Most Viewed</option>
                <option value="upvotes-desc">Most Upvoted</option>
                <option value="date-desc">Newest First</option>
              </select>

              <select
                value={genderFilter}
                onChange={e => setGenderFilter(e.target.value)}
                className="filter_select"
              >
                <option value="">Filter</option>
                <option value="female">Female-only</option>
                <option value="male">Male-only</option>
              </select>
            </div>
          </div>
        </div>
        {filteredAndSortedListings.map(listing => (
    <ListingCard
      key={listing.id}
      listing={listing}
      handleViewDetailsClick={handleViewDetailsClick}
    />
  ))}

        {/* Single-column layout */}
        {/* <div className="homepage_single_column">
          {filteredAndSortedListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              handleViewDetailsClick={handleViewDetailsClick}
            />
          ))}
        </div> */}
      </div>
    </Layout>
  );
};

export default HomePage;
