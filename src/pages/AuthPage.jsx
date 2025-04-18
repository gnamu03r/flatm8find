import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../auth"; // Import Google login
import Layout from "../components/Layout";

const AuthPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/profile");
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