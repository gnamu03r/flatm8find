import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOTP, verifyOTP } from "../auth"; // Import functions for OTP

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
    <div className="p-6 max-w-sm mx-auto mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Phone Authentication</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div>
        <input
          type="text"
          placeholder="Enter phone (10 digit)"
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          onClick={handleSendOtp}
          className="w-full bg-yellow-500 text-white p-2 rounded-md mb-2"
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
              className="w-full bg-green-600 text-white p-2 rounded-md"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PhoneAuthPage;
