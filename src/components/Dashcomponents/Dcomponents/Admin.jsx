import React, { useState, useEffect } from "react";
import "./Admin.css";
import { SiGoogleclassroom } from "react-icons/si";
import { FaUsers } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

function Admin() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showClassList, setShowClassList] = useState(false);
  const [showUserData, setShowUserData] = useState(false);

  useEffect(() => {
    // Function to fetch user data from the backend API
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://mern-ehilada-backend.onrender.com/api/users",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();

          console.log("User Data:", userData);

          setUsers(userData); // Set the retrieved user data in the state
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const intervalId = setInterval(fetchUsers, 5000);
    fetchUsers();

    return () => {
      clearInterval(intervalId);
    };
  }, []); // Run this effect only once on component mount

  const changePassword = async (userId) => {
    const newPassword = prompt("Enter new password:");

    try {
      const response = await fetch(
        `https://mern-ehilada-backend.onrender.com/api/users/${userId}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (response.ok) {
        // Password changed successfully, update the UI or show a message
        console.log("Password changed successfully!");
      } else {
        console.error("Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      const response = await fetch(
        `https://mern-ehilada-backend.onrender.com/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.userId !== userId));
        console.log("User deleted successfully");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUsernameUpdate = async (userId) => {
    const newUsername = prompt("Enter new username:");

    try {
      const response = await fetch(
        `https://mern-ehilada-backend.onrender.com/api/users/${userId}/username`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
          body: JSON.stringify({ username: newUsername }),
        }
      );

      if (response.ok) {
        // Perform an action like updating the users state or show a success message
        console.log("Username updated successfully!");
      } else {
        console.error("Failed to update username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  useEffect(() => {
    // Fetch classes from the backend API
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          "https://mern-ehilada-backend.onrender.com/api/all-classes",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
            },
          }
        );

        if (response.ok) {
          const classesData = await response.json();
          setClasses(classesData);
        } else {
          console.error("Failed to fetch classes");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleDelete = async (classId) => {
    try {
      // Make a DELETE request to the backend to delete the class
      const response = await fetch(
        `https://mern-ehilada-backend.onrender.com/api/classes/${classId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      );

      if (response.ok) {
        // If the delete request is successful, update the classes state by removing the deleted class
        setClasses(classes.filter((c) => c._id !== classId));
        console.log("Class deleted successfully");
      } else {
        console.error("Failed to delete class");
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const handleUpdate = async (classId) => {
    const updatedClassName = prompt("Enter updated Class Name:");
    const updatedSection = prompt("Enter updated Section:");
    const updatedSubject = prompt("Enter updated Subject:");
    const updatedRoom = prompt("Enter updated Room:");

    const updatedData = {
      className: updatedClassName,
      section: updatedSection,
      subject: updatedSubject,
      room: updatedRoom,
    };

    try {
      const response = await fetch(
        `https://mern-ehilada-backend.onrender.com/api/classes/${classId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        // Perform an action like updating the classes state or show a success message
        console.log("Class updated successfully!");
      } else {
        console.error("Failed to update class");
      }
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  const toggleClassList = () => {
    setShowClassList(!showClassList);
    setShowUserData(false);
  };

  const toggleUserData = () => {
    setShowUserData(!showUserData);
    setShowClassList(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("usertoken");
    window.location.href = "/";
  };

  return (
    <div>
      <div className="nav">
        <FiLogOut className="logout" onClick={handleLogout} />
        <FaUsers className="icon1" onClick={toggleUserData} />
        <SiGoogleclassroom className="icon2" onClick={toggleClassList} />
        <h3 className="admin">Admin Dashboard</h3>
      </div>
      <div
        className="user-data"
        style={{ display: showUserData ? "block" : "none" }}
      >
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>userId</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.userId}</td>

                <td>
                  <button onClick={() => changePassword(user.userId)}>
                    Change Password
                  </button>
                  <button onClick={() => handleUsernameUpdate(user.userId)}>
                    Update Username
                  </button>
                  <button onClick={() => handleUserDelete(user.userId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showClassList && (
        <div className="class-list">
          {classes.map((classItem) => (
            <div className="class-card" key={classItem._id}>
              <h2>{classItem.className}</h2>
              <div className="class-card-content">
                <p>Section: {classItem.section}</p>
                <p>Subject: {classItem.subject}</p>
                <p>Room: {classItem.room}</p>
                <button onClick={() => handleUpdate(classItem._id)}>
                  Update
                </button>
                <button onClick={() => handleDelete(classItem._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
