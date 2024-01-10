import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import "./Forgot.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSendOtp = async () => {
    try {
      await axios.post(
        "https://mern-ehilada-backend.onrender.com/api/forgotpassword",
        {
          email: formData.email,
        }
      );
      alert("OTP sent to your email.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://mern-ehilada-backend.onrender.com/api/resetPassword",
        {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }
      );
      alert(
        "Password reset successful. You can now login with the new password."
      );
      navigate("/login");
      setFormData({
        email: "",
        otp: "",
        newPassword: "",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Error resetting password.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-heading">Forgot Password</h2>
      <form onSubmit={handleResetPassword}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group otp-group">
          <button type="button" onClick={handleSendOtp} className="otp-button">
            Send OTP
          </button>
          <label>OTP:</label>
          <input
            type="text"
            name="otp"
            maxLength="4"
            value={formData.otp}
            onChange={handleChange}
            className="otp-input"
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="reset-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
