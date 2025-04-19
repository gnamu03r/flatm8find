import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOTP, verifyOTP } from "../auth"; // Import functions for OTP
import Layout from "../components/Layout";
import './phoneauthpage.css'

const PhoneAuthPage = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const result = await sendOTP(phone);
      setConfirmationResult(result);
      alert("OTP sent!");
    } catch (err) {
      setError("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp(confirmationResult, otp);
      navigate("/profile"); // Redirect after successful verification
    } catch (err) {
      setError("Invalid OTP");
    }
  };

  return (
    <Layout>

    <div className="phone_win">
      <h2 className="phone_title">Phone Authentication</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="phone_card">
        <input
          type="text"
          placeholder="Enter phone (10 digit)"
          className="phone_box"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          onClick={handleSendOtp}
          className="phone_btn"
        >
          Send OTP
        </button>
        {confirmationResult && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="phone_btn"
              >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
        </Layout>
  );
};

export default PhoneAuthPage;
