import React, { useEffect, useState } from "react";
import "./Activity.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./ActivityTaker.css";
import LogoAct from "./image/ehilada1.png";

function Activity() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const classId = sessionStorage.getItem("classInfoId");

  console.log("successfully retrive", classId);

  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    activityTitle: "",
    instructions: "",
    link: "",
    points: "",
    dueDate: "",
    scheduleDateTime: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleScheduleDateTimeChange = (event) => {
    const { value } = event.target;
    setFormValues({
      ...formValues,
      scheduleDateTime: value,
    });
  };

  const handleSubmit = () => {
    const data = {
      classId: classId,
      activityTitle: formValues.activityTitle,
      instructions: formValues.instructions,
      link: formValues.link,
      points: formValues.points,
      dueDate: formValues.dueDate,
      scheduleDateTime: formValues.scheduleDateTime,
    };
    const token = sessionStorage.getItem("usertoken");
    axios
      .post("https://mern-ehilada-backend.onrender.com/api/activities", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Activity created:", response.data);
        navigate("/stream");
      })
      .catch((error) => {
        console.error("Error creating activity:", error);
      });
  };
  /*
 const handleBackToStream = () => {
    if (classId) {
      // Navigate back to the Stream component for the specific class using the classId query parameter
      navigate(
        `/Stream?class=${encodeURIComponent(JSON.stringify({ _id: classId }))}`
      );
    } else {
      // Handle the case where classId is not available or handle the error
      console.error("Class ID is not available.");
    }
  };

*/

  return (
    <div>
      <div className="navAct">
        <img src={LogoAct} alt="logoAct" />
      </div>
      <div className="activity-page">
        <div className="activity-container">
          <h1>Activity / Assignment</h1>

          <div className="input-group">
            <label htmlFor="activityTitle">Activity / Assignment Title:</label>
            <input
              type="text"
              id="activityTitle"
              name="activityTitle"
              value={formValues.activityTitle}
              onChange={handleInputChange}
              placeholder="Enter title"
            />
          </div>

          <div className="input-group">
            <label htmlFor="instructions">Instructions (optional):</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formValues.instructions}
              onChange={handleInputChange}
              rows={5}
              placeholder="Enter instructions (optional)"
            />
          </div>

          <div className="input-group">
            <label htmlFor="link">Attach Link (optional):</label>
            <input
              type="text"
              id="link"
              name="link"
              value={formValues.link}
              onChange={handleInputChange}
              placeholder="Enter link (optional)"
            />
          </div>
        </div>

        <div className="points-container">
          <label htmlFor="points">Points:</label>
          <input
            type="number"
            id="points"
            name="points"
            value={formValues.points}
            onChange={handleInputChange}
            placeholder="Enter points"
          />
          <label htmlFor="dueDate">Due Date:</label>
          <input
            type="datetime-local"
            id="dueDate"
            name="dueDate"
            value={formValues.dueDate}
            onChange={handleInputChange}
          />

          <div className="form-group-scheduledatetime">
            <label htmlFor={`scheduleDateTime`}>Scheduled Date and Time:</label>
            <input
              type="datetime-local"
              id={`scheduleDateTime`}
              name={`scheduleDateTime`}
              value={formValues.scheduleDateTime}
              onChange={handleScheduleDateTimeChange}
            />
          </div>

          {/* Checkbox to enable/disable scheduled date and time */}
          <div className="form-group-enableScheduleDateTime">
            <label htmlFor={`scheduleDateTimeToggle`}></label>
            <input type="checkbox" id={`scheduleDateTimeToggle`} />
          </div>

          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        </div>
      </div>
      {/*<button onClick={handleBackToStream} className="back-button">
        Back to Stream
      </button> */}
    </div>
  );
}

export default Activity;
