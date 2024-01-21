import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ActivityTaker.css";
import axios from "axios";
import logoAct from "./image/ehilada1.png";

function ActivityTaker() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const userDataString = params.get("user");

  const classId = sessionStorage.getItem("classInfoId");
  const activityTitle = sessionStorage.getItem("activityTitle");
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [activityData, setActivityData] = useState([]);

  const [userLink, setUserLink] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isMarkedAsDone, setIsMarkedAsDone] = useState(false);

  // Store the original input data in separate state variables

  const [originalUserLink, setOriginalUserLink] = useState("");
  const [originalUploadedFile, setOriginalUploadedFile] = useState(null);

  const [submittedActivities, setSubmittedActivities] = useState([]);
  const [isActivitySubmitted, setIsActivitySubmitted] = useState(false);

  const navigate = useNavigate();

  // Function to check if the activity is already submitted
  const checkIfActivitySubmitted = () => {
    // Check if there's a submitted activity with the same title
    const submittedActivity = submittedActivities.find(
      (activity) => activity.activityTitle === activityTitle
    );

    if (submittedActivity) {
      // Activity is already submitted, set the form fields

      setUserLink(submittedActivity.userLink);
      setUploadedFile(submittedActivity.uploadedFile);
      setIsActivitySubmitted(true);
    }
  };

  const fetchSubmittedActivities = () => {
    // Check if the user is logged in (has a token)
    const userToken = sessionStorage.getItem("usertoken");

    if (userToken) {
      const userId = user.userId;
      axios
        .get(
          `https://mern-ehilada-backend.onrender.com/api/fetch-submitted-activities/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            // Filter submitted activities for the current activityTitle
            const filteredActivities = response.data.filter(
              (activity) => activity.activityTitle === activityTitle
            );

            setSubmittedActivities(filteredActivities);
            checkIfActivitySubmitted();
          }
        })
        .catch((error) => {
          console.error("Error fetching submitted activities:", error);
        });
    } else {
      // If the user is not logged in (no token), clear the submittedActivities
      setSubmittedActivities([]);
    }
  };
  // Function to render file links
  const renderFileLink = (file) => {
    if (file) {
      const fileName = file.split("/").pop();
      return (
        <a
          href={`https://mern-ehilada-backend.onrender.com/${file}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {fileName}
        </a>
      );
    }
    return null;
  };

  // Call the fetchSubmittedActivities function when the component mounts
  useEffect(() => {
    fetchSubmittedActivities();

    const interval = setInterval(() => {
      fetchSubmittedActivities();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Fetch the specific activity based on the activityTitle
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(
          `https://mern-ehilada-backend.onrender.com/api/activities?classId=${classId}&activityTitle=${encodeURIComponent(
            activityTitle
          )}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
            },
          }
        );
        if (response.status === 200) {
          setActivityData(response.data);
          // Handle the activity data
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
        // Handle error scenario, e.g., show an error message to the user
      }
    };
    fetchActivity();

    const intervalId = setInterval(() => {
      fetchActivity();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [classId, activityTitle]);

  const convertToPhilippineTime = (utcDateTime) => {
    if (!utcDateTime) {
      return "None";
    }

    const options = {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    // Convert the UTC date to Philippine Time (PHT)
    const philippineDateTime = new Date(utcDateTime).toLocaleString(
      "en-US",
      options
    );
    return philippineDateTime;
  };

  // Function to handle changes in userLink
  const handleUserLinkChange = (value) => {
    setUserLink(value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  const handleMarkAsDone = () => {
    if (isMarkedAsDone) {
      // User wants to unsubmit, so enable the fields

      setUserLink(originalUserLink);
      setUploadedFile(originalUploadedFile);
    } else {
      const submissionData = new FormData(); // Create a new FormData instance

      submissionData.append("classId", classId);
      submissionData.append("user", JSON.stringify(user));

      submissionData.append("userLink", userLink);

      if (uploadedFile) {
        submissionData.append("uploadedFile", uploadedFile);
      }

      submissionData.append("points", activityData[0].points);
      submissionData.append("activityTitle", activityTitle);

      // Send a request to the server to submit/update the activity with the FormData
      axios
        .post(
          "https://mern-ehilada-backend.onrender.com/api/submit-activity",
          submissionData,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
            },
          }
        )
        .then((response) => {
          // Handle the response, e.g., show a success message to the user
          console.log("User Data:", user);
          navigate("/stream");
          console.log("Activity submitted/updated successfully");
          setIsMarkedAsDone(true);
          // setOriginalUserAnswer(userAnswer);
          setOriginalUserLink(userLink);
          setOriginalUploadedFile(uploadedFile);
        })
        .catch((error) => {
          console.error("Error submitting/updating activity:", error);
        });
    }

    setIsMarkedAsDone(!isMarkedAsDone);
  };
  /*
  const handleClickMe = () => {
    navigate(
      `/Stream?class=${encodeURIComponent(
        JSON.stringify({ _id: classId })
      )}&user=${encodeURIComponent(JSON.stringify(user))}`
    );
  };
  */

  const isDueDatePassed = () => {
    const activity = activityData[0];
    if (activity && activity.dueDate) {
      const dueDate = new Date(activity.dueDate);
      const currentDate = new Date();
      return currentDate > dueDate;
    }
    return false;
  };

  return (
    <div>
      <img className="logoact" src={logoAct} alt="logoAct" />
      <div className="activity-taker-container1">
        {activityData.length > 0 && (
          <div>
            <h3 className="activity-title">{activityTitle}</h3>
            <div className="activity-info">
              <div>
                <h4>Instructions:</h4>
                <p>{activityData[0].instructions}</p>
              </div>
              <div>
                <h4>Link:</h4>
                <a
                  href={activityData[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {activityData[0].link}
                </a>
              </div>
              <div>
                <h4>Points:</h4>
                <p>{activityData[0].points}</p>
              </div>
              <div>
                <h4>Due Date:</h4>
                <p>{convertToPhilippineTime(activityData[0].dueDate)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="activity-taker-container2">
        {isDueDatePassed() && (
          <div className="due-date-message">
            <p>Due date for this activity has passed. better luck next time</p>
          </div>
        )}
        <div>
          <h4>Link:</h4>
          <input
            type="text"
            placeholder="Paste your link here..."
            onChange={(e) => handleUserLinkChange(e.target.value)}
            disabled={isDueDatePassed() ? "disabled" : undefined}
            // Add any additional props or event handlers as needed
          />
        </div>

        <div>
          <h4>Upload File:</h4>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={isDueDatePassed() ? "disabled" : undefined}
          />
        </div>
        <div>
          <h4>Link to Your Work:</h4>
          {submittedActivities.length > 0 ? (
            <a
              href={submittedActivities[0].userLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {submittedActivities[0].userLink}
            </a>
          ) : (
            <span>No link provided</span>
          )}
        </div>
        <div>
          <h4>Uploaded file:</h4>
          {submittedActivities.length > 0 ? (
            <div>{renderFileLink(submittedActivities[0].uploadedFile)}</div>
          ) : (
            <span>No link provided</span>
          )}
        </div>

        <button
          className="mark-as-done-button"
          onClick={handleMarkAsDone}
          disabled={isDueDatePassed() ? "disabled" : undefined}
        >
          Submit {isMarkedAsDone}
        </button>
      </div>

      {/*<button onClick={handleClickMe}>click me</button>*/}
    </div>
  );
}

export default ActivityTaker;
