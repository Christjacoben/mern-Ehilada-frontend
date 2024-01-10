import React, { useEffect, useState } from "react";
import "./AttendanceTaker.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logoatten from "./image/ehilada1.png";

function AttendanceTaker() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const classId = sessionStorage.getItem("classInfoId");
  const attendanceTitle = sessionStorage.getItem("attendanceTitle");
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [canAddStudent, setCanAddStudent] = useState(true);
  const [attendanceSubmissions, setAttendanceSubmissions] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [dueDateTimePassed, setDueDateTimePassed] = useState(false);

  const navigate = useNavigate();

  // Function to check if dueDateTime has passed
  const checkDueDateTimePassed = (dueDateTime) => {
    const currentDateTime = new Date();
    const dueDateTimeObject = new Date(dueDateTime);
    setDueDateTimePassed(currentDateTime > dueDateTimeObject);
  };

  const fetchAttendanceData = async () => {
    try {
      // Send a GET request to the API to fetch attendance data for the specific class
      const response = await axios.get(
        `http://localhost:5000/api/attendance/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      );

      if (response.status === 200) {
        // Set the fetched attendance data in your state
        setAttendanceData(response.data);
      }
    } catch (error) {
      // Handle any errors here
      console.error("Error fetching attendance data:", error);
    }
  };
  useEffect(() => {
    fetchAttendanceData();
    const intervalId = setInterval(() => {
      fetchAttendanceData();
    }, 3000);
    return () => clearInterval(intervalId);
  }, [classId]);

  // Update dueDateTimePassed when attendance data changes
  useEffect(() => {
    if (attendanceData.length > 0) {
      const dueDateTime = attendanceData[0].dueDateTime;
      checkDueDateTimePassed(dueDateTime);
    }
  }, [attendanceData]);

  const filteredAttendanceData = attendanceData.filter(
    (data) => data.attendanceTitle === attendanceTitle
  );

  useEffect(() => {
    const fetchAttendanceSubmissions = async () => {
      try {
        // Send a GET request to the API to fetch attendance submissions
        const response = await axios.get(
          "http://localhost:5000/api/attendance/submissions",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
            },
          }
        );

        if (response.status === 200) {
          const specificAttendanceSubmissions = response.data.filter(
            (submission) =>
              submission.classId === classId &&
              submission.attendanceTitle === attendanceTitle
          );

          setAttendanceSubmissions(specificAttendanceSubmissions);
        }
      } catch (error) {
        // Handle any errors here
        console.error("Error fetching attendance submissions:", error);
      }
    };

    fetchAttendanceSubmissions();
    const intervalId = setInterval(() => {
      fetchAttendanceSubmissions();
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const handleNameChange = (e) => {
    setStudentName(e.target.value);
  };

  const addStudent = () => {
    if (studentName.trim() !== "" && canAddStudent) {
      // Check if the student name is already in the list
      const isStudentAdded = students.some(
        (student) => student.name === studentName
      );
      if (!isStudentAdded) {
        setStudents([...students, { name: studentName, isPresent: true }]);
        setStudentName("");
        setCanAddStudent(false);
      }
    }
  };

  const removeStudent = (index) => {
    const updatedStudents = [...students];
    updatedStudents.splice(index, 1);
    setStudents(updatedStudents);
    setCanAddStudent(true);
  };

  const submitAttendance = async () => {
    try {
      const attendanceData = {
        classId: classId, // The ID of the class for which attendance is being submitted
        attendanceTitle: attendanceTitle, // The title of the attendance record
        students: students, // The array of students with their names and attendance status
        user: user.userId,
      };

      // Send the attendance data to your API endpoint
      const response = await axios.post(
        "http://localhost:5000/api/attendance/submit",
        attendanceData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      );

      if (response.status === 201) {
        setStudents([]);
        // Attendance submitted successfully, you can handle success here
        console.log("Attendance submitted successfully");
        navigate("/stream");
      }
    } catch (error) {
      // Handle any errors here
      console.error("Error submitting attendance:", error);
    }
  };

  const convertToPhilippineTime = (dateTimeString) => {
    if (!dateTimeString) {
      return "Due Date and Time not set";
    }
    const options = {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Date(dateTimeString).toLocaleString("en-PH", options);
  };

  /*
const handleClickBack = () => {
    navigate(
      `/stream?class=${encodeURIComponent(
        JSON.stringify({ _id: classId })
      )}&user=${encodeURIComponent(JSON.stringify(user))}`
    );
  };
*/

  return (
    <div className="att-container">
      <img src={logoatten} alt="logoatten" />
      <div className="attendance-container">
        {filteredAttendanceData.map((data, index) => (
          <div key={index}>
            <h3>{data.attendanceTitle}</h3>
            <div className="submission">
              <h3>Due Date and Time</h3>
              <p>{convertToPhilippineTime(data.dueDateTime)}</p>
            </div>
          </div>
        ))}
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter Student Full Name"
            value={studentName}
            onChange={handleNameChange}
            disabled={
              !canAddStudent ||
              (attendanceData.length > 0 && attendanceData[0].dueDateTime)
            }
          />
          <div className="button-container">
            <button
              onClick={addStudent}
              disabled={
                !canAddStudent ||
                (attendanceData.length > 0 && attendanceData[0].dueDateTime)
              }
            >
              Add Student
            </button>
          </div>
        </div>
        <ul className="student-list">
          {students.map((student, index) => (
            <li key={index} className="student-item">
              <span className="student-name">{student.name}</span>
              <span className="attendance-status">
                {student.isPresent ? "Present" : "Absent"}
              </span>
              <button onClick={() => removeStudent(index)} className="remove">
                remove
              </button>
            </li>
          ))}
          <div className="submision">
            {attendanceSubmissions.map((submission, index) => (
              <li key={index}>
                <ul>
                  {submission.students.map((student, studentIndex) => (
                    <li key={studentIndex}>
                      <p> {student.name}</p>
                      <p className="present">
                        Present: {student.isPresent ? "Yes" : "No"}
                      </p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </div>
        </ul>
        <button className="subAtten" onClick={submitAttendance}>
          submit
        </button>
        {/* <button onClick={handleClickBack}>back</button> */}
      </div>
    </div>
  );
}

export default AttendanceTaker;
