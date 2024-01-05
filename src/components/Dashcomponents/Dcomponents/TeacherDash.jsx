import React from "react";
import { FaHome } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./Teacherdash.css";

function TeacherDash() {
  const navigate = useNavigate();

  const handleClickme = () => {
    navigate("/dashboard");
  };

  const userId = Math.floor(Math.random() * 1000);

  return (
    <div className="teacher-dash-container">
      <ul className="tnavbar">
        <div className="user-display">
          <div className="user-avatar">
            <FaUser className="user-icon" />
          </div>
          <span className="user-name">User {userId}</span>
        </div>
        <li className="nav-item">
          <a href="#">Stream</a>
        </li>
        <li className="nav-item">
          <a href="#">Classwork</a>
        </li>
        <li className="nav-item">
          <a href="#">People</a>
        </li>
        <li className="nav-item">
          <a href="#">Grades</a>
        </li>

        <div className="home">
          <FaHome onClick={handleClickme} />
        </div>
      </ul>
    </div>
  );
}

export default TeacherDash;
