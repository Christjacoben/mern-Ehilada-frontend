import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = Cookies.get("usertoken");
    if (storedToken) {
      // Perform necessary validation if needed before using the token
      // For example, check token expiration
      // Then you can navigate to the dashboard with the user's data
      // navigate("/dashboard", { state: { user: userResponse.data } });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send the form data to the backend for login
      const response = await axios.post(
        "https://mern-ehilada-backend.onrender.com/api/login",

        formData
      );

      // Store the JWT token in a cookie
      Cookies.set("usertoken", response.data.token, {
        expires: 1,
        secure: true, // Use only over HTTPS
        httpOnly: true, // Prevent client-side access
      }); // Set cookie expiration as needed

      // Simulate a longer loading time (10 seconds) using setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store the JWT token in localStorage
      sessionStorage.setItem("usertoken", response.data.token);

      // Clear any existing user-related data (optional)
      localStorage.removeItem("createdClasses");

      // If login successful, you can redirect the user to a dashboard or home page
      const userResponse = await axios.get(
        `https://mern-ehilada-backend.onrender.com/api/user/${formData.usernameOrEmail}`
      );
      //navigate dashboard

      // If login successful, pass the username to the dashboard route
      const userData = userResponse.data;

      sessionStorage.setItem("userData", JSON.stringify(userData));

      if (userData.isAdmin) {
        // If the user is an admin, redirect to the admin component
        navigate(`/admin`);
      } else {
        // If not an admin, redirect to the dashboard passing user data
        navigate(`/dashboard`);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Incorrect username or password. Please try again.");
      // Handle login errors here, such as displaying error messages to the user
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div>
      <div className={`login-container ${loading ? "blur" : ""}`}>
        <h2>Login</h2>
        <LoadingSpinner loading={loading} />
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username or Email:</label>
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={handleShowPassword}
              />
              Show Password
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="forgot-create-account">
          <Link to="/signup">Create Account</Link>
          <Link to="/forgotpassword">Forgot Password </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
