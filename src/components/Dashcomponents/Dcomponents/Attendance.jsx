import React, { useState } from "react";
import "./Attendance.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import LogoAtten from "./image/ehilada1.png";

function Attendance() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const classId = sessionStorage.getItem("classInfoId");

  console.log("successfully retrive", classId);

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
      .post("http://localhost:5000/api/attendance", attendanceData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
        },
      })
      .then((response) => {
        // Handle success if needed
        console.log("Data saved to MongoDB:", response.data);
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
