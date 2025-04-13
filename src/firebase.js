// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAQjiXcCQQR30R9asnVEtDpZNnVO_XC2Ic",
    authDomain: "flatmate-finder-684fc.firebaseapp.com",
    projectId: "flatmate-finder-684fc",
    storageBucket: "flatmate-finder-684fc.firebasestorage.app",
    messagingSenderId: "470498479802",
    appId: "1:470498479802:web:3bef5363c08ce09dbf3c83",
    measurementId: "G-GYBWJ0SXX3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);

// Export the initialized services
export { auth, firestore };
