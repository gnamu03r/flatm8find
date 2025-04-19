import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../auth"; // Import Google login
import Layout from "../components/Layout";
import '../pages/authpage.css';

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

      <div className="auth_window">
        <h2 className="title">Looking for a Flatmate?</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="card">

          <button
            onClick={handleGoogleLogin}
            className="item google"
          >
            <i class='icon bx bxl-google'></i>
            Continue with Google

          </button>

          <hr className="my-4" />

          <button
            onClick={handleEmailLogin}
            className="item mail"
          >
          <i class='icon bx bx-envelope'></i>
            Continue with Email

          </button>

          <button
            onClick={handlePhoneLogin}
            className="item phone"
          >
            <i class='icon bx bx-mobile-alt'></i>
            Continue with Phone Number

          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;