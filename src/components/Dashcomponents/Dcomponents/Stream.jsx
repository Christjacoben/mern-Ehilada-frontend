import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Stream.css"; // Import your CSS file
import Quiz from "./Quiz";
import Logo from "./image/ehilada1.png";

function Stream() {
  const storedClassInfo = sessionStorage.getItem("selectedClass");
  const storedCurrentUser = sessionStorage.getItem("currentUser");

  const classInfo = storedClassInfo ? JSON.parse(storedClassInfo) : null;
  const user = storedCurrentUser ? JSON.parse(storedCurrentUser) : null;

  const userId = user;

  // Retrieve the userId from the query parameter
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState(""); // State for the announcement text
  const [link, setLink] = useState("");
  const [announcements, setAnnouncements] = useState([]); // State for storing posted announcements
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [isQuizOpen, setQuizOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [quizTitles, setQuizTitles] = useState([]);
  const [activitiesData, setActivitiesData] = useState([]);

  const [hasJoinedClass, setHasJoinedClass] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [userClasses, setUserClasses] = useState([]);
  const [isDataFetched, setDataFetched] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = document.documentElement.scrollTop;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const userToken = sessionStorage.getItem("usertoken");

  const fetchUserClasses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/classes", {
        headers: {
          Authorization: `Bearer ${userToken}`, // Include the user's token
        },
      });

      if (response.status === 200) {
        const userClasses = response.data;

        setUserClasses(userClasses);
      }
    } catch (error) {
      console.error("Error fetching user classes:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchUserClasses();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [userToken]);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/attendance/${classInfo._id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      );

      if (response.status === 200) {
        const attendanceData = response.data;

        // Update the state with attendanceData
        setAttendanceData(attendanceData);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };
  useEffect(() => {
    if (classInfo) {
      const intervalId = setInterval(() => {
        fetchAttendanceData();
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [classInfo]);

  //Function to check if the user has joined the class
  const checkIfUserJoinedClass = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/classes/joinedWithDetails`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        const joinedClasses = response.data;

        const hasJoined = joinedClasses.some(
          (joinedClass) => joinedClass.classDetails._id === classInfo._id
        );
        setHasJoinedClass(hasJoined);
      }
    } catch (error) {
      console.error("Error checking if user joined class:", error);
    }
  };

  // Use useEffect to check if the user joined the class when the component mounts
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkIfUserJoinedClass();
    }, 8000);
    return () => clearInterval(intervalId);
  }, []);

  // Function to fetch activity and assignment data
  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/activities/${classInfo._id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      );
      if (response.status === 200) {
        const activitiesData = response.data;
        console.log("activites", activitiesData);

        const currentDateTime = new Date();
        const filteredActivities = activitiesData.filter(
          (activity) =>
            !activity.scheduleDateTime ||
            new Date(activity.scheduleDateTime) <= currentDateTime
        );

        setActivitiesData(filteredActivities); // Update the state with activitiesData
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      // Handle error scenario, e.g., show an error message to the user
    }
  };

  // Use useEffect to fetch activities when the component mounts
  useEffect(() => {
    if (classInfo) {
      const intervalId = setInterval(() => {
        fetchActivities();
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [classInfo]);

  // Function to fetch quiz titles
  const fetchQuizTitles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/quiz-titles?classId=${classInfo._id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      );
      if (response.status === 200) {
        const quizzesWithDueDate = response.data;

        const currentDateTime = new Date();
        const filteredQuizzes = quizzesWithDueDate.filter(
          (quiz) =>
            !quiz.scheduleDateTime ||
            new Date(quiz.scheduleDateTime) <= currentDateTime
        );

        setQuizTitles(filteredQuizzes);
        setDataFetched(true);
      }
    } catch (error) {
      console.error("Error fetching quiz titles:", error);
      // Handle error scenario, e.g., show an error message to the user
    }
  };

  // Use useEffect to fetch quiz titles when the component mounts
  useEffect(() => {
    fetchQuizTitles();

    const intervalId = setInterval(() => {
      fetchQuizTitles();
    }, 6000);
    return () => clearInterval(intervalId);
  }, []);

  // Function to fetch announcements
  const fetchAnnouncements = async (classId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/announcements/${classId}`, // Pass the classId as part of the URL
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      );
      if (response.status === 200) {
        setAnnouncements(response.data);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      // Handle error scenario, e.g., show an error message to the user
    }
  };

  // Function to render file links
  const renderFileLink = (file) => {
    if (file) {
      const fileName = file.split("/").pop();
      return (
        <a
          href={`http://localhost:5000/${file}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {fileName}
        </a>
      );
    }
    return null;
  };
  // Use useEffect to fetch announcements when the component mounts
  useEffect(() => {
    if (classInfo) {
      const intervalId = setInterval(() => {
        fetchAnnouncements(classInfo._id);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [classInfo]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleTextareaInput = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset the height to auto
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the content
    setAnnouncement(event.target.value);
  };

  const handleLinkInput = (event) => {
    setLink(event.target.value);
  };

  const handlePostAnnouncement = async () => {
    try {
      const formData = new FormData();
      formData.append("classId", classInfo._id);
      formData.append("text", announcement);
      formData.append("link", link);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // Make a POST request to your backend API with the announcement and file
      const response = await axios.post(
        "http://localhost:5000/api/announcements",
        formData, // Send the form data with the file
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
            "Content-Type": "multipart/form-data", // Set the content type for file uploads
          },
        }
      );

      if (response.status === 201) {
        // Announcement posted successfully
        const savedAnnouncement = response.data;
        setAnnouncements([...announcements, savedAnnouncement]);
        setAnnouncement("");
        setLink("");
        setSelectedFile(null);

        fetchQuizTitles();
      }
    } catch (error) {
      console.error("Error posting announcement:", error);
      // Handle error scenario, e.g., show an error message to the user
    }
  };
  // Function to open the category menu
  const openCategoryMenu = () => {
    setCategoryMenuOpen(true);
  };

  // Function to close the category menu
  const closeCategoryMenu = () => {
    setCategoryMenuOpen(false);
    setSelectedCategory(null);
  };

  //selected category quiz,exam, etc..
  const selectCategory = (category) => {
    setSelectedCategory(category);

    if (category === "Quiz") {
      setCategoryMenuOpen(false);
      sessionStorage.setItem("classInfoId", classInfo._id);
      navigate("/Quiz");
    } else if (category === "Activity") {
      sessionStorage.setItem("classInfoId", classInfo._id);
      navigate("/Activity");
    } else if (category === "Attendance") {
      sessionStorage.setItem("classInfoId", classInfo._id);
      navigate("/Attendance");
    } else if (category === "Grade") {
      sessionStorage.setItem("classInfoId", classInfo._id);
      navigate("/Grade");
    }
  };

  const handleCloseQuiz = () => {
    setQuizOpen(false);
  };

  const handleClickMe = () => {
    // Navigate to the dashboard and pass the encoded data as query parameters
    navigate("/dashboard");
  };

  const convertToPhilippineTime = (utcDateTime) => {
    if (!utcDateTime) {
      return "None";
    }
    const utcDate = new Date(utcDateTime);
    const philippineDate = new Date(
      utcDate.toLocaleString("en-US", { timeZone: "Asia/Manila" })
    );
    return philippineDate.toLocaleString();
  };

  const handleQuizTitleClick = (quizTitle) => {
    sessionStorage.setItem("classInfoId", classInfo._id);
    sessionStorage.setItem("quizTitle", quizTitle);
    sessionStorage.setItem("user", JSON.stringify(user));
    setSelectedQuiz(quizTitle);
    const dueDateTime = new Date(quizTitle.dueDateTime);
    const options = {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const philippineDueDateTime = dueDateTime.toLocaleString("en-US", options);

    console.log("Due Date and Time (Philippine Time):", philippineDueDateTime);

    navigate("/QuizTaker");
  };

  const handleActivityTitleClick = (activity) => {
    sessionStorage.setItem("classInfoId", classInfo._id);
    sessionStorage.setItem("activityTitle", activity.activityTitle);
    sessionStorage.setItem("user", JSON.stringify(user));

    navigate("/ActivityTake");
  };
  const handleAttendanceTitleClick = (attendance) => {
    sessionStorage.setItem("classInfoId", classInfo._id);
    sessionStorage.setItem("attendanceTitle", attendance.attendanceTitle);
    sessionStorage.setItem("user", JSON.stringify(user));
    navigate("/AttendanceTake");
  };

  const handleClickGrade = () => {
    const encodedUserData = encodeURIComponent(JSON.stringify(user));
    const encodedClassInfo = encodeURIComponent(JSON.stringify(classInfo));

    sessionStorage.setItem("encodedUserData", encodedUserData);
    sessionStorage.setItem("encodedClassInfo", encodedClassInfo);
    sessionStorage.setItem("classInfoId", classInfo._id);
    navigate("/Grade");
  };

  const specificClass = userClasses.find(
    (classItem) => classItem._id === classInfo._id
  );

  return (
    <div className="stream-container">
      <div className={`navbar ${visible ? "" : "hidden"}`}>
        <img src={Logo} alt="logo" className="logo" onClick={handleClickMe} />
      </div>
      {specificClass && (
        <div className="classname">
          <p>Class Name: {specificClass.className}</p>
          <p>Section: {specificClass.section}</p>
        </div>
      )}

      {!hasJoinedClass && specificClass && (
        <div className="code">
          <p>Code: {specificClass.code}</p>
        </div>
      )}

      {!hasJoinedClass && (
        <div className="post-announce">
          {/* Input field for entering the announcement */}
          <textarea
            className="announcement-input"
            rows="1"
            cols="100"
            placeholder="Enter your announcement before add link or upload file..."
            value={announcement}
            onChange={handleTextareaInput}
          />
          {/* Input field for entering the link */}
          <input
            type="text"
            className="link-input"
            placeholder="Enter a link (optional)"
            value={link}
            onChange={handleLinkInput}
          />
          {/* Input field for file selection */}
          <input type="file" className="file" onChange={handleFileSelect} />

          {/* Button to post the announcement */}
          <button className="post-button" onClick={handlePostAnnouncement}>
            Post
          </button>
        </div>
      )}
      {/* Button to open the classwork menu */}
      {!hasJoinedClass && (
        <button className="classwork-button" onClick={openCategoryMenu}>
          Classwork
        </button>
      )}

      {/* Pop-up menu for classwork categories */}
      {isCategoryMenuOpen && (
        <div className="classwork-menu">
          <button className="exit-button" onClick={closeCategoryMenu}>
            X
          </button>
          <button className="Quiz-Exam" onClick={() => selectCategory("Quiz")}>
            Quiz / Exam
          </button>

          <button
            className="Activity-Assignment"
            onClick={() => selectCategory("Activity")}
          >
            Activity / Assignment
          </button>
          <button
            className="Attendance"
            onClick={() => selectCategory("Attendance")}
          >
            Attendance
          </button>
          <button className="Grade" onClick={handleClickGrade}>
            Grade
          </button>
        </div>
      )}

      {/* Pop-up for the quiz component */}
      {isQuizOpen && (
        <div className="quiz-popup">
          <button className="close-button" onClick={handleCloseQuiz}>
            X
          </button>
          {/* Render your Quiz component here */}

          <Quiz classId={classInfo._id} />
        </div>
      )}

      <div className="posted-announce">
        {/* Display posted announcements */}
        <div className="announcements-container">
          <h3>Posted Announcements</h3>
          {announcements.map((ann, index) => (
            <div className="announcement" key={index}>
              <p>{ann.text}</p>
              {ann.link && (
                <a href={ann.link} target="_blank" rel="noopener noreferrer">
                  {ann.link}
                </a>
              )}
              {renderFileLink(ann.file)}
            </div>
          ))}
        </div>
      </div>
      <div className="Quiz-container">
        <h3>Posted Quiz and Exam</h3>
        {/* Display quiz titles */}
        {quizTitles.map((quiz, index) => (
          <div
            className="announcementQ"
            key={index}
            onClick={() => handleQuizTitleClick(quiz.quizTitle)} // Handle quiz title click
            style={{ cursor: "pointer" }}
          >
            <p>{quiz.quizTitle}</p>
            <p>
              Due Date and Time: {convertToPhilippineTime(quiz.dueDateTime)}
            </p>
            {/* Display due date and time */}
          </div>
        ))}
      </div>
      <div className="Activity-container">
        <h3>Posted Activity and Assigntment</h3>
        {/* Display activity and assignment titles */}
        {activitiesData.map((activity, index) => (
          <div
            className="announcementA"
            key={index}
            onClick={() => handleActivityTitleClick(activity)}
            style={{ cursor: "pointer" }}
          >
            <p>{activity.activityTitle}</p>
            <p>Due Date: {convertToPhilippineTime(activity.dueDate)}</p>
            {/* Display due date and time */}
          </div>
        ))}
      </div>
      <div className="Attendance-container">
        <h3>Posted Attendance</h3>
        {/* Display Attendance title */}
        {attendanceData.map((attendance, index) => (
          <div
            className="announcement-attendance"
            key={index}
            style={{ cursor: "pointer" }}
            onClick={() => handleAttendanceTitleClick(attendance)}
          >
            <p>{attendance.attendanceTitle}</p>
            <p>
              Due Date and Time:{" "}
              {convertToPhilippineTime(attendance.dueDateTime)}
            </p>
          </div>
        ))}
      </div>
      {/*   <button className="navigate-button" onClick={handleClickMe}>
        Navigate
      </button>*/}
    </div>
  );
}

export default Stream;
