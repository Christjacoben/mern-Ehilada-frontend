import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./Grade.css";
import LogoG from "./image/ehilada1.png";

function Grade() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  //const userId = params.get("userId");
  const userDataString = params.get("userData");
  const userData = JSON.parse(decodeURIComponent(userDataString));
  const classInfoString = params.get("classInfo");
  //const classInfo = JSON.parse(decodeURIComponent(classInfoString));

  const classId = sessionStorage.getItem("classInfoId");
  const userId = sessionStorage.getItem("encodedUserData");
  const classInfo = sessionStorage.getItem("encodedClassInfo");

  const [usersInClass, setUsersInClass] = useState([]);
  const [submittedActivities, setSubmittedActivities] = useState([]);
  const [quizSubmissions, setQuizSubmissions] = useState([]);

  const [userQuizSubmissions, setUserQuizSubmissions] = useState([]);
  const [userSubmittedActivities, setUserSubmittedActivities] = useState([]);
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [showQuizSubmissions, setShowQuizSubmissions] = useState(true);
  const [showSubmittedActivities, setShowSubmittedActivities] = useState(true);

  // Function to fetch users who joined the class
  const fetchUsersInClass = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/classes/users/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      );

      if (response.status === 200) {
        const usersInClassData = response.data;
        setUsersInClass(usersInClassData);
      }
    } catch (error) {
      console.error("Error fetching users in class:", error);
    }
  };

  // Function to fetch quiz submissions and submitted activities for a specific user
  const fetchUserSubmissions = async (userId) => {
    try {
      // Fetch quiz submissions
      const quizSubmissionsResponse = await axios.get(
        `http://localhost:5000/api/quiz/submissions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      );

      if (quizSubmissionsResponse.status === 200) {
        const quizSubmissionsData = quizSubmissionsResponse.data;
        setUserQuizSubmissions(quizSubmissionsData);
        setQuizSubmissions(quizSubmissionsData);
      }

      // Fetch submitted activities
      const submittedActivitiesResponse = await axios.get(
        `http://localhost:5000/api/fetch-submitted-activities/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      );

      if (submittedActivitiesResponse.status === 200) {
        const submittedActivitiesData = submittedActivitiesResponse.data;
        setSubmittedActivities(submittedActivitiesData);
        setUserSubmittedActivities(submittedActivitiesData);
      }
    } catch (error) {
      console.error("Error fetching user submissions:", error);
    }
  };

  useEffect(() => {
    // Call the function to fetch users when the component mounts
    fetchUsersInClass();
  }, []); // Empty dependency array to execute the effect only once

  const handleUserClick = (userId) => {
    setShowQuizSubmissions(true);
    setShowSubmittedActivities(true);
    fetchUserSubmissions(userId);
  };

  const handleSubmissionClick = (submissionIndex) => {
    if (expandedSubmission === submissionIndex) {
      setExpandedSubmission(null);
    } else {
      setExpandedSubmission(submissionIndex);
    }
  };

  const handleActivityClick = (activityIndex) => {
    if (expandedActivity === activityIndex) {
      setExpandedActivity(null);
    } else {
      setExpandedActivity(activityIndex);
    }
  };
  const handleCloseBothClick = () => {
    setShowQuizSubmissions(false);
    setShowSubmittedActivities(false);
  };

  const formatSubmissionTime = (submissionTime) => {
    const options = {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const philippineTime = new Intl.DateTimeFormat("en-PH", options).format(
      new Date(submissionTime)
    );
    return philippineTime;
  };

  return (
    <div className="grade">
      <img src={LogoG} alt="LogoG" />
      <div className="grade-container">
        <h2>Join in this Class</h2>
        <ul>
          {usersInClass.map((userData, index) => (
            <li
              key={index}
              onClick={() => handleUserClick(userData.userId._id)}
            >
              {userData.userId && userData.userId.username}
            </li>
          ))}
        </ul>

        <ul>
          {showQuizSubmissions &&
            quizSubmissions.map((submission, index) => (
              <li key={index} onClick={() => handleSubmissionClick(index)}>
                <h2 className="QE">Quiz/Exam Submissions</h2>
                <p> {submission.quizTitle} </p>
                {expandedSubmission === index && (
                  <ul>
                    {submission.submissions.map((sub, subIndex) => (
                      <li key={subIndex}>
                        {sub.questionUserAnswerPairs.map(
                          (question, questionIndex) => (
                            <div key={questionIndex}>
                              Question: {question.question}
                              <br />
                              <p className="answers">
                                Answer: {question.answer}
                              </p>
                              <br />
                            </div>
                          )
                        )}
                        <p className="score"> Score: {sub.userScore}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
        </ul>

        <ul>
          {showSubmittedActivities &&
            submittedActivities.map((activity, index) => (
              <li key={index}>
                <h2 className="activityAsignment">
                  Activity/Assignment Submissions
                </h2>
                <p onClick={() => handleActivityClick(index)}>
                  {activity.activityTitle}
                </p>
                {expandedActivity === index && (
                  <div className="activity-data">
                    <p className="point">Points: {activity.points}</p>
                    <p>
                      Submission Time:{" "}
                      {formatSubmissionTime(activity.submissionTime)}
                    </p>
                    {activity.uploadedFile && (
                      <p>
                        Uploaded File:
                        <a
                          href={`http://localhost:5000/${activity.uploadedFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {activity.uploadedFile}
                        </a>
                      </p>
                    )}
                    {activity.userLink && (
                      <p>
                        User Link:
                        <a
                          href={activity.userLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {activity.userLink}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
        </ul>
        <button className="closeMe" onClick={handleCloseBothClick}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Grade;
