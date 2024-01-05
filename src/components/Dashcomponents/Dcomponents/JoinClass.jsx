import React, { useState } from "react";
import "./JoinClass.css";
import axios from "axios";

function JoinClass({ onJoinClassSuccess }) {
  const [classCode, setClassCode] = useState("");
  const [username, setUsername] = useState("");

  const handleClassCodeChange = (event) => {
    setClassCode(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleJoinClass = async () => {
    try {
      const token = sessionStorage.getItem("usertoken");

      if (!token) {
        console.error("User not logged in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/classes/join",
        {
          classCode,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Class joined successfully:", response.data);

      onJoinClassSuccess(response.data);
    } catch (error) {
      console.error(
        "Error joining class:",
        error.response ? error.response.data.error : error.message
      );
    }
  };

  return (
    <div className="container">
      <h2 className="cod">Class code</h2>
      <h3 className="ask">
        Ask your teacher for the class code, then enter it here.
      </h3>
      <input
        type="text"
        value={classCode}
        onChange={handleClassCodeChange}
        placeholder="Enter class code"
        className="input"
      />
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter your username"
        className="input"
      />

      <button onClick={handleJoinClass} className="button">
        Join Class
      </button>
    </div>
  );
}

export default JoinClass;
