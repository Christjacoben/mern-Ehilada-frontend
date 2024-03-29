import React, { useState } from "react";
import "./Attendance.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LogoAtten from "./image/ehilada1.png";

function Attendance() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const classId = sessionStorage.getItem("classInfoId");

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [dueDateTime, setDueDateTime] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDueDateTimeChange = (e) => {
    setDueDateTime(e.target.value);
  };

  const handleSubmit = () => {
    const attendanceData = {
      classId,
      attendanceTitle: title,
      dueDateTime,
    };

    axios
      .post(
        "https://mern-ehilada-backend.onrender.com/api/attendance",
        attendanceData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      )
      .then((response) => {
        // Handle success if needed
        navigate("/stream");
        setTitle("");
        setDueDateTime("");
      })
      .catch((error) => {
        // Handle errors if needed
        console.error("Error:", error);
      });
  };

  return (
    <div className="attendance">
      <img src={LogoAtten} alt="LogoAtten" />
      <div className="attendance-container">
        <h2 className="attendance-title">Create Attendance</h2>
        <div className="input-container1">
          <label className="input-label">Attendance Title:</label>
          <input
            className="input-field1"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter Attendance Title"
          />
        </div>
        <div className="input-container2">
          <label className="input-label">Due Date and Time:</label>
          <input
            className="input-field"
            type="datetime-local"
            value={dueDateTime}
            onChange={handleDueDateTimeChange}
          />
        </div>
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Attendance;
