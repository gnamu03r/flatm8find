import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage} from './firebase';  // Ensure this is the initialized Firestore instance


// Function to save user profile data to Firestore
export const saveUserProfile = async (userId, profileData) => {
    const userRef = doc(firestore, 'users', userId);
  
    try {
      await setDoc(userRef, profileData, { merge: true });  // Merge to update only the provided fields
      console.log('User profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Error updating profile');
    }
  };
  
// Function to update user profile data in Firestore
// Function to update user profile in Firestore
export const updateUserProfile = async (userId, profileData) => {
    const userRef = doc(firestore, 'users', userId);
  
    try {
      await updateDoc(userRef, profileData);  // Update profile data in Firestore
      console.log('Profile updated in Firestore!');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Error updating profile');
    }
  };

// Function to handle user signup
export const signupUser = async (email, password, profileData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;  // The signed-up user

    // Save the user profile to Firestore after successful signup
    await saveUserProfile(user.uid, profileData);
    
    return userCredential;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw new Error(error.message);
  }
};

// Function to handle user login
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw new Error(error.message);
  }
};

// Function to fetch user profile from Firestore
export const getUserProfile = async (userId) => {
  const userRef = doc(firestore, 'users', userId);

  try {
    const docSnap = await getDoc(userRef); // Get the user document
    if (docSnap.exists()) {
      return docSnap.data();  // Return the profile data
    } else {
      console.log('No such document!');
      throw new Error('No such document');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Error fetching profile');
  }
};

export {auth, firestore};
