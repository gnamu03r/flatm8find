import React, { useEffect, useState } from 'react';
import { firestore } from '../auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Layout from '../components/Layout';
import './listingdetails.css';
import DEFAULT_IMAGE from '../assets/home-button3.png';

const ListingDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [listing, setListing] = useState(null);
  const [userUpvoted, setUserUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [views, setViews] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [copied, setCopied] = useState(false); // for visual feedback

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

  const handleCopyContact = () => {
    navigator.clipboard.writeText(listing.contactInfo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // show "Copied!" for 2 seconds
  };

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

    <Layout>

    <div className="ld_window">
      <div className='ld_titleimg'>
      <h2 className="ld_title">{listing.area} - {listing.roomType}</h2>

      {/* Image Grid */}
      <Swiper
  modules={[Navigation, Pagination]}
  spaceBetween={10}
  slidesPerView={1}
  navigation
  pagination={{ clickable: true }}
  className="ld_swiper"
>
  {listing.images && listing.images.length > 0 ? (
    listing.images.map((imgObj, index) => (
      <SwiperSlide key={index}>
       <img
  src={imgObj.url}
  alt={`Listing Image ${index + 1}`}
  className="ld_imagecard cursor-pointer"
  onClick={() => {
    setActiveImage(imgObj.url);
    setIsModalOpen(true);
  }}
/>

      </SwiperSlide>
    ))
  ) : (
    <SwiperSlide>
      <div className="ld_imagecard">
        <img src={DEFAULT_IMAGE} alt="Placeholder" />
      </div>
    </SwiperSlide>
  )}
</Swiper>
<div className="ld_buttons">
          {/* 👍 Upvote Button */}
          {isOwnListing ? (
            <div className='ld_upvotediv'>
            <button className="ld_upvote ld_upvote_upvote text-gray-400 cursor-not-allowed" disabled>
              Upvote
            </button>
            <p className='upvotedisabled'>(Disabled for your own listing)</p>
            </div>
          ) : (
            <button
            onClick={handleUpvote}
            className={`ld_upvote text-yellow-500 hover:text-yellow-600 ${userUpvoted ? 'font-bold' : ''}`}
            >
              {userUpvoted ? 'Unvote' : 'Upvote'}
              <p className="text-sm">{upvoteCount}</p>
            </button>
          )}

          {/* Display views count */}
          <p className="ld_views">Views: {views}</p>
          </div>
  </div>

  

      <div className="ld_details">
        <p className="ld_des text-sm">Description: {listing.description}</p>
        <p className="ld_rent text-lg font-semibold">Rent: ₹{listing.rent}</p>
        <p className="ld_gender text-sm">Gender Preference: <p>{listing.genderPref}</p></p>
        <button
  onClick={handleCopyContact}
  className="ld_contact text-sm transition duration-200"
>
  {copied ? 'Copied!' : `Contact/Insta: ${listing.contactInfo}`}
</button>


          </div>
       
    </div>
    {isModalOpen && (
  <div className="ld_modal_overlay">
    <div className="ld_modal_card swiper-container">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="ld_modal_swiper"
        initialSlide={
          listing.images.findIndex(img => img.url === activeImage) || 0
        }
      >
        {listing.images.map((imgObj, index) => (
          <SwiperSlide key={index}>
            <img
              src={imgObj.url}
              alt={`Slide ${index + 1}`}
              className="ld_modal_image"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => setIsModalOpen(false)}
        className="ld_modal_close"
      >
        ✕
      </button>
    </div>
  </div>
)}



  
    </Layout>
  );
};

export default ListingDetails;
