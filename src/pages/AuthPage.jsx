import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRedirectResult } from "firebase/auth";
import { auth, loginWithGoogle, saveUserProfile } from "../auth"; // Import Google login
import Layout from "../components/Layout";
import { useEffect } from "react";

const AuthPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const user = result.user;
  
          // Save Google user to Firestore (only if new)
          await saveUserProfile(user.uid, {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });
  
          console.log("Redirect login successful:", user);
          navigate("/profile");
        }
      })
      .catch((err) => {
        console.error("Redirect login error:", err);
        setError("Google login failed. Please try again.");
      });
  }, []);
  
  

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // navigate("/profile");
    } catch (err) {
      setError("Google login failed. Please try again.");
    }
  };

  const handleEmailLogin = () => {
    navigate("/auth/email");
  };

  const handlePhoneLogin = () => {
    navigate("/auth/phone");
  };

  return (
    <Layout>

    <div className="p-6 max-w-sm mx-auto mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Welcome to AuthPage</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-500 text-white p-2 rounded-md mb-4"
      >
        Continue with Google
      </button>

      <hr className="my-4" />

      <button
        onClick={handleEmailLogin}
        className="w-full bg-blue-500 text-white p-2 rounded-md mb-4"
      >
        Continue with Email
      </button>

      <button
        onClick={handlePhoneLogin}
        className="w-full bg-yellow-500 text-white p-2 rounded-md"
      >
        Continue with Phone Number
      </button>
    </div>
    </Layout>
  );
};

export default AuthPage;
