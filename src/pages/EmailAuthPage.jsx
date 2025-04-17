import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../auth"; // Import functions for email login/signup

const EmailAuthPage = () => {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Only required for signup
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await loginUser(email, password);
      } else {
        const profileData = { name };
        await signupUser(email, password, profileData);
      }
      navigate("/profile"); // Redirect to profile or another page after success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">{mode === "login" ? "Login" : "Sign Up"}</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleAuth}>
        {mode === "signup" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-center">
        {mode === "login" ? (
          <>Don't have an account? <span onClick={() => setMode("signup")} className="text-blue-500 cursor-pointer">Sign up</span></>
        ) : (
          <>Already have an account? <span onClick={() => setMode("login")} className="text-blue-500 cursor-pointer">Login</span></>
        )}
      </p>
    </div>
  );
};

export default EmailAuthPage;
