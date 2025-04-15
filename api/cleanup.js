import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { differenceInDays } from 'date-fns';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to delete image from Cloudinary
const deleteImageFromCloudinary = async (publicId) => {
  const cloudName = 'dzgfwlrv4';
  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;

  const signature = CryptoJS.SHA1(stringToSign).toString();

  const formData = new URLSearchParams();
  formData.append('public_id', publicId);
  formData.append('api_key', process.env.CLOUDINARY_API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: 'POST',
    body: formData,
  });

  return res.json();
};

// Main cleanup function
export default async function handler(req, res) {
  const snapshot = await getDocs(collection(db, 'listings'));
  const deletions = [];

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const createdAt = data.createdAt?.toDate?.();
    if (!createdAt) continue;

    const age = differenceInDays(new Date(), createdAt);
    if (age > 21) {
      // Extract Cloudinary public IDs from URLs
      const imageUrls = data.images || [];
      for (const url of imageUrls) {
        const publicId = url.split('/upload/')[1].split('.')[0]; // crude but works
        deletions.push(deleteImageFromCloudinary(`cloud/${publicId}`));
      }

      // Delete Firestore doc
      await deleteDoc(doc(db, 'listings', docSnap.id));
    }
  }

  await Promise.all(deletions);

  res.status(200).json({ message: 'Cleanup complete' });
}
