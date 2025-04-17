import React, { useState } from 'react';
import { firestore } from '../auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
      const maxWidth = 800;
      const maxHeight = 800;

      // Calculate scaling factor while preserving aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }
      }

      // Resize the canvas
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.7);
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
    genderPref: 'Select Gender Preference',
    description: '',
    contactInfo: '',
    images: []
  });

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.size <= 5 * 1024 * 1024);
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

    setUploading(true);
    setProgress(0);
    setUploadError('');

    try {
      let imageUrls = [];
      if (formData.images.length > 0) {
        const resizedImages = await Promise.all(formData.images.map(resizeImage));
        imageUrls = await uploadImagesToCloudinary(resizedImages);
      }

      await addDoc(collection(firestore, 'listings'), {
        ...formData,
        images: imageUrls,
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
        upvotedBy: [],
      });

      alert('Listing posted!');
      navigate('/');

      setFormData({
        area: '',
        rent: '',
        roomType: '',
        genderPref: 'Select Gender Preference',
        description: '',
        contactInfo: '',
        images: []
      });
    } catch (error) {
      console.error('Error posting listing:', error);
      setUploadError('Error posting listing. Please try again later.');
    } finally {
      setUploading(false);
    }
  };

  const uploadImagesToCloudinary = async (images) => {
    const uploadedImages = [];
    const cloudName = 'dzgfwlrv4';
    const uploadPreset = 'flatmate-finder';

    for (const image of images) {
      const imageFormData = new FormData();
      imageFormData.append('file', image);
      imageFormData.append('upload_preset', uploadPreset);
      imageFormData.append('folder', 'cloud');

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: imageFormData,
        });

        if (!res.ok) throw new Error('Cloudinary upload failed');

        const data = await res.json();
        uploadedImages.push({
          url: data.secure_url,
          public_id: data.public_id,
        });

        setProgress((prev) => Math.min(prev + 100 / images.length, 100));
      } catch (err) {
        console.error('Error uploading image to Cloudinary:', err);
        setUploadError('Error uploading image. Please try again later.');
        throw err;
      }
    }

    return uploadedImages;
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Post a Room Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="area" placeholder="Area (e.g. Ber Sarai)" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="number" name="rent" placeholder="Rent (e.g. 6000)" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="roomType" placeholder="Room Type (e.g. 2 Sharing)" onChange={handleChange} required className="w-full border p-2 rounded" />

        <select name="genderPref" onChange={handleChange} value={formData.genderPref} required className="w-full border p-2 rounded">
          <option value="">Select Gender Preference</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Any">Both</option>
        </select>

        <textarea name="description" placeholder="Description" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="contactInfo" placeholder="Contact Info (e.g. Insta/Phone)" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="file" name="images" accept="image/*" onChange={handleImageChange} multiple className="w-full border p-2 rounded" />

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

        {uploading && (
          <div className="w-full bg-gray-200 h-2 mt-2">
            <div className="bg-blue-600 h-2" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {uploadError && <p className="text-red-500">{uploadError}</p>}

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Post Listing'}
        </button>
      </form>
    </div>
  );
};

export default PostListing;
