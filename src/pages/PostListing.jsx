import React, { useState } from 'react';
import { firestore } from '../auth'; // Firestore from your auth.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Function to resize or compress image
const resizeImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxWidth = 800; // Max width for resizing
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.7); // Compress image to 70% quality
    };
  });
};

const PostListing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    area: '',
    rent: '',
    roomType: '',
    vacantFrom: '',
    genderPref: '',
    description: '',
    contactInfo: '',
    images: [] // For storing selected image files
  });

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // For tracking upload progress

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.size <= 5 * 1024 * 1024); // Limit file size to 5MB
    if (validImages.length !== files.length) {
      alert('Some images exceed the size limit (5MB). These will not be uploaded.');
    }
    setFormData((prev) => ({
      ...prev,
      images: validImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert('Please login first');

    if (formData.images.length === 0) {
      return alert('Please upload at least one image.');
    }

    setUploading(true);
    setProgress(0);

    try {
      // Resize/compress images and upload to Cloudinary
      const resizedImages = await Promise.all(formData.images.map(resizeImage));
      const imageUrls = await uploadImagesToCloudinary(resizedImages);

      // Add listing to Firestore
      await addDoc(collection(firestore, 'listings'), {
        ...formData,
        images: imageUrls, // Store the Cloudinary image URLs
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
        upvotedBy: [],
      });

      alert('Listing posted!');
      navigate('/');

      // Clear form after submission
      setFormData({
        area: '',
        rent: '',
        roomType: '',
        vacantFrom: '',
        genderPref: '',
        description: '',
        contactInfo: '',
        images: []
      });
    } catch (error) {
      console.error('Error posting listing:', error);
      alert('Error posting listing.');
    } finally {
      setUploading(false);
    }
  };

  // Function to upload images to Cloudinary with progress tracking
  const uploadImagesToCloudinary = async (images) => {
    const uploadedUrls = [];
    const cloudName = 'dzgfwlrv4';  // your cloud name
    const uploadPreset = 'flatmate-finder';  // your unsigned preset
  
    for (const image of images) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', uploadPreset);
  
      // 👇 Folder structure in Cloudinary
      formData.append('folder', 'cloud');
  
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
  
        if (!res.ok) {
          throw new Error('Cloudinary upload failed');
        }
  
        const data = await res.json();
        uploadedUrls.push(data.secure_url);
  
        // Update progress
        setProgress((prev) => Math.min(prev + 100 / images.length, 100));
      } catch (err) {
        console.error('Error uploading image to Cloudinary:', err);
        throw err;
      }
    }
  
    return uploadedUrls;
  };
  

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Post a Room Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="area"
          placeholder="Area (e.g. Ber Sarai)"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="rent"
          placeholder="Rent (e.g. 6000)"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="roomType"
          placeholder="Room Type (e.g. 2 Sharing)"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="vacantFrom"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="genderPref"
          placeholder="Gender Preference (e.g. Any)"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="contactInfo"
          placeholder="Contact Info (e.g. Insta/Phone)"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Image Upload */}
        <input
          type="file"
          name="images"
          accept="image/*"
          onChange={handleImageChange}
          multiple
          className="w-full border p-2 rounded"
        />
        {formData.images.length > 0 && (
          <div className="mt-2">
            <p>Selected Images:</p>
            <ul className="space-y-2">
              {formData.images.map((image, index) => (
                <li key={index}>{image.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="w-full bg-gray-200 h-2 mt-2">
            <div
              className="bg-blue-600 h-2"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Post Listing'}
        </button>
      </form>
    </div>
  );
};

export default PostListing;
