import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../auth"; // Import functions for email login/signup
import Layout from "../components/Layout";
import './emailauthpage.css';

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
    <Layout>
      
    <div className="ea_win">
      <h2 className="ea_title">{mode === "login" ? "Login" : "Sign Up"}</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="ea_card">

      <form onSubmit={handleAuth}>
        {mode === "signup" && (
          <div className="entry">
            <label className="ea_subtitle">Full Name</label>
            <input
              type="text"
              className="namebox"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              />
          </div>
        )}
        <div className="entry email_entry">
          <label className="ea_subtitle">Email</label>
          <input
            type="email"
            className="emailbox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>
        <div className="entry">
          <label className="ea_subtitle">Password</label>
          <input
            type="password"
            className="passwordbox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>
        <button type="submit" className="ea_loginbtn">
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>

      <p className="ea_subfooter">
        {mode === "login" ? (
          <>Don't have an account? <span onClick={() => setMode("signup")} className="alr">Sign up</span></>
        ) : (
          <>Already have an account? <span onClick={() => setMode("login")} className="alrn">Login</span></>
        )}
      </p>
        </div>
    </div>
          </Layout>
  );
};

export default EmailAuthPage;
