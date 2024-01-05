import React, { useState } from "react";
import "./CreateClass.css";

function CreateClass({ onClose, onCreate }) {
  const [classDetails, setClassDetails] = useState({
    className: "",
    section: "",
    subject: "",
    room: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!classDetails.className) {
      errors.className = "Class Name is required.";
    }
    if (!classDetails.section) {
      errors.section = "Section is required.";
    }
    if (!classDetails.subject) {
      errors.subject = "Subject is required.";
    }
    if (!classDetails.room) {
      errors.room = "Room is required.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateRandomCode = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  };

  const handleCreateClass = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const randomCode = generateRandomCode(6);
      const authToken = sessionStorage.getItem("usertoken"); // Get the JWT token

      const response = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Pass the JWT token
        },
        body: JSON.stringify({ ...classDetails, code: randomCode }),
      });

      setIsLoading(false);

      if (response.ok) {
        const createdClass = await response.json();
        console.log("Class created:", createdClass);
        onClose(); // Close the create class form
        onCreate; // Optionally, you can trigger a refresh of class data
      } else {
        console.error("Failed to create class");
        // Handle error scenario, e.g., show an error message to the user
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Error creating class:", error);
    }
  };

  return (
    <div className="create-class-form">
      <input
        type="text"
        placeholder="Class Name"
        value={classDetails.className}
        onChange={(e) =>
          setClassDetails({ ...classDetails, className: e.target.value })
        }
      />
      {validationErrors.className && (
        <div className="error-message">{validationErrors.className}</div>
      )}
      <input
        type="text"
        placeholder="Section"
        value={classDetails.section}
        onChange={(e) =>
          setClassDetails({ ...classDetails, section: e.target.value })
        }
      />
      {validationErrors.section && (
        <div className="error-message">{validationErrors.section}</div>
      )}
      <input
        type="text"
        placeholder="Subject"
        value={classDetails.subject}
        onChange={(e) =>
          setClassDetails({ ...classDetails, subject: e.target.value })
        }
      />
      {validationErrors.subject && (
        <div className="error-message">{validationErrors.subject}</div>
      )}
      <input
        type="text"
        placeholder="Room"
        value={classDetails.room}
        onChange={(e) =>
          setClassDetails({ ...classDetails, room: e.target.value })
        }
      />
      {validationErrors.room && (
        <div className="error-message">{validationErrors.room}</div>
      )}
      <button className="create-class-btn" onClick={handleCreateClass}>
        {isLoading ? "Creating..." : "Create Class"}
      </button>
    </div>
  );
}

export default CreateClass;
