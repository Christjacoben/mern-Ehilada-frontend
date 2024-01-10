import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import CreateClass from "./CreateClass";
import JoinClass from "./JoinClass";

import "./DashHeader.css";
import Logo from "./image/ehilada1.png";

function DashHeader() {
  const storedUserData = sessionStorage.getItem("userData");
  const userDataFromStorage = storedUserData
    ? JSON.parse(storedUserData)
    : null;
  const currentUser = userDataFromStorage || user;

  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const [showCreateJoinOptions, setShowCreateJoinOptions] = useState(false);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showJoinClass, setShowJoinClass] = useState(false);
  const [createdClasses, setCreatedClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [isDataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchClasses = async () => {
      try {
        const authToken = sessionStorage.getItem("usertoken");

        // Fetch created classes
        const createdClassesResponse = await fetch(
          "https://mern-ehilada-backend.onrender.com/api/classes",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            signal,
          }
        );

        // Fetch joined classes
        const joinedClassesResponse = await fetch(
          "https://mern-ehilada-backend.onrender.com/api/classes/joinedWithDetails",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            signal,
          }
        );

        if (createdClassesResponse.ok && joinedClassesResponse.ok) {
          const createdClasses = await createdClassesResponse.json();
          const joinedClasses = await joinedClassesResponse.json();

          setCreatedClasses(createdClasses);
          setJoinedClasses(joinedClasses);

          // setDataFetched(true);
        } else {
          console.error("Failed to fetch classes");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    if (!isDataFetched) {
      const intervalId = setInterval(fetchClasses, 9000);
      fetchClasses();

      return () => {
        clearInterval(intervalId);
        // controller.abort();
      };
    }
  }, [isDataFetched]);

  const toggleSideMenu = () => {
    setSideMenuOpen(!isSideMenuOpen);

    const createdClassesDiv = document.querySelector(".created-classes");
    if (createdClassesDiv) {
      if (isSideMenuOpen) {
        createdClassesDiv.style.left = "20px";
      } else {
        createdClassesDiv.style.left = "260px";
      }
    }
  };

  const toggleCreateJoinOptions = () => {
    setShowCreateJoinOptions(!showCreateJoinOptions);
    setShowCreateClass(false); // Hide create class form
    setShowJoinClass(false);
  };

  const toggleJoinClass = () => {
    setShowJoinClass(!showJoinClass);
    setShowCreateClass(false);
  };

  const toggleCreateClass = () => {
    setShowCreateClass(!showCreateClass);
    setShowJoinClass(false);
  };

  const handleCreateClass = async (classDetails) => {
    try {
      const authToken = sessionStorage.getItem("usertoken");

      const response = await fetch(
        "https://mern-ehilada-backend.onrender.com/api/classes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ ...classDetails }),
        }
      );

      if (response.ok) {
        const createdClass = await response.json();
        console.log("Class created:", createdClass);

        toggleCreateClass();
        // Hide create class form after creating class
        await fetchCreatedClasses(); // Fetch updated class list

        // Update the local storage with the new class data
        const updatedClasses = [...createdClasses, createdClass];
        sessionStorage.setItem(
          "createdClasses",
          JSON.stringify(updatedClasses)
        );

        // Update the state with the new class data
        setCreatedClasses(updatedClasses);
        console.log("Updated classes:", updatedClasses);
      } else {
        console.error("Failed to create class");
      }
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("usertoken");
    sessionStorage.removeItem("usertoken");
    sessionStorage.removeItem("createdClasses");
    sessionStorage.removeItem("userData");
    window.location.href = "/";
  };

  const handleJoinClassSuccess = (classDetails) => {
    console.log("handleJoinClassSuccess called");
    console.log("Joined Class Details: ", classDetails);

    console.log("User joined class:", currentUser);
    storeDataInSessionStorage(classDetails, currentUser);
    setJoinedClasses((prevClasses) => [...prevClasses, classDetails]);
  };

  const storeDataInSessionStorage = (classInfo, currentUser) => {
    // Store classInfo and currentUser in sessionStorage
    sessionStorage.setItem("selectedClass", JSON.stringify(classInfo));
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
  };

  return (
    <nav className="navbar">
      <div className="menu-icon" onClick={toggleSideMenu}>
        ☰
      </div>
      <div className={`side-menu ${isSideMenuOpen ? "open" : ""}`}>
        <div className="logo-side-menu">
          <img src={Logo} alt="Logo" className="logo-img" />
        </div>
        <div className="close-btn" onClick={toggleSideMenu}>
          &times;
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        {/* Other side menu content */}
      </div>
      <div className="logo">
        <img src={Logo} alt="Logo" className="logo-nav" />
      </div>
      <div
        className={`plus-button ${showCreateJoinOptions ? "active" : ""}`}
        onClick={toggleCreateJoinOptions}
      >
        +
      </div>
      {showCreateJoinOptions && (
        <div className="create-join-option">
          <button
            className="close-dropdown-btn"
            onClick={toggleCreateJoinOptions}
          >
            &times;
          </button>
          <button className="create-class-btn" onClick={toggleCreateClass}>
            Create Class
          </button>
          <button className="join-class-btn" onClick={toggleJoinClass}>
            {" "}
            {/* Add onClick to toggle JoinClass */}
            Join Class
          </button>
        </div>
      )}
      {showCreateClass && (
        <CreateClass onClose={toggleCreateClass} onCreate={handleCreateClass} />
      )}
      {showJoinClass && (
        <JoinClass onJoinClassSuccess={handleJoinClassSuccess} />
      )}

      <div className="created-classes">
        {createdClasses.map((classInfo, index) => (
          <div key={index} className="class-card">
            <h3>classname: {classInfo.className}</h3>

            <Link
              to="/stream"
              className="sec"
              onClick={() => storeDataInSessionStorage(classInfo, currentUser)}
            >
              <p>Section: {classInfo.section}</p>
            </Link>
          </div>
        ))}

        {joinedClasses.map((joinedClass, index) => (
          <div key={index} className="class-card">
            <h3>
              Class Name:{" "}
              {joinedClass.classDetails
                ? joinedClass.classDetails.className || "Loading..."
                : "Loading..."}
            </h3>
            {joinedClass.classDetails ? (
              <Link
                to="/stream"
                className="sec"
                onClick={() =>
                  storeDataInSessionStorage(
                    joinedClass.classDetails,
                    currentUser
                  )
                }
              >
                <p>
                  Section: {joinedClass.classDetails.section || "Loading..."}
                </p>
              </Link>
            ) : (
              <p>Section: Loading...</p>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

export default DashHeader;
