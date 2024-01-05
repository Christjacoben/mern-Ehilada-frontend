import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Send the form data to the backend for storage
      await axios.post("http://localhost:5000/api/signup", formData);
      console.log("Successfully signed up");
      // Clear the form after successful submission

      // navigate login page
      navigate("/login");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const [isAdminCreated, setIsAdminCreated] = useState(false);

  useEffect(() => {
    // Check if an admin user is already created
    axios
      .get("http://localhost:5000/api/checkAdmin")
      .then((response) => {
        setIsAdminCreated(response.data.isAdminCreated);
      })
      .catch((error) => {
        console.error("Error checking admin user:", error);
      });
  }, []);

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Admin User:</label>
          <input
            className="admin-checkbox"
            type="checkbox"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={() =>
              setFormData((prevData) => ({
                ...prevData,
                isAdmin: !prevData.isAdmin,
              }))
            }
            disabled={isAdminCreated}
          />
        </div>
        <div className="show-password-checkbox">
          <input
            type="checkbox"
            id="showPasswordCheckbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPasswordCheckbox">Show Password</label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <div className="already-account">
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Signup;
