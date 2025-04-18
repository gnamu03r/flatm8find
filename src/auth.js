import { firestore, storage } from './firebase'; // already initialized
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithRedirect,
} from 'firebase/auth';
import { auth } from './firebase';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

// ------------------ USER PROFILE FUNCTIONS ------------------

// Save new user profile to Firestore
export const saveUserProfile = async (userId, profileData) => {
  const userRef = doc(firestore, 'users', userId);
  try {
    await setDoc(userRef, profileData, { merge: true });
    console.log('User profile updated!');
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Error updating profile');
  }
};

// Update existing user profile in Firestore
export const updateUserProfile = async (userId, profileData) => {
  const userRef = doc(firestore, 'users', userId);
  try {
    await updateDoc(userRef, profileData);
    console.log('Profile updated in Firestore!');
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Error updating profile');
  }
};

// Fetch user profile from Firestore
export const getUserProfile = async (userId) => {
  const userRef = doc(firestore, 'users', userId);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) return docSnap.data();
    else throw new Error('No such document');
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Error fetching profile');
  }
};

// ------------------ AUTH FUNCTIONS ------------------

// Email/password signup
export const signupUser = async (email, password, profileData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await saveUserProfile(user.uid, profileData);
    return userCredential;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw new Error(error.message);
  }
};

// Email/password login
export const loginUser = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw new Error(error.message);
  }
};

// Google sign-in
// DO NOT await the result or use result.user directlyexport const loginWithGoogle = () => {
// auth.js
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // Handle successful sign-in
  } catch (error) {
    console.error('Error during sign-in:', error);
  }
};

  


// Setup reCAPTCHA
export const setupRecaptcha = (containerId = 'recaptcha-container') => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: (response) => console.log('reCAPTCHA verified'),
    'expired-callback': () => console.log('reCAPTCHA expired'),
  });
};

// Send OTP
export const sendOTP = async (phoneNumber) => {
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    throw new Error(error.message);
  }
};

// Verify OTP
export const verifyOTP = async (confirmationResult, otp, profileData = {}) => {
  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;

    // Optional: Save phone user to Firestore
    await saveUserProfile(user.uid, {
      phone: user.phoneNumber,
      ...profileData,
    });

    return result;
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    throw new Error('Invalid OTP');
  }
};

export { auth, firestore, storage };
