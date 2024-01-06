import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Forgot from "./components/Forgot";
import DashHeader from "./components/Dashcomponents/Dcomponents/DashHeader";
import TeacherDash from "./components/Dashcomponents/Dcomponents/TeacherDash";
import Stream from "./components/Dashcomponents/Dcomponents/Stream";
import Quiz from "./components/Dashcomponents/Dcomponents/Quiz";
import Activity from "./components/Dashcomponents/Dcomponents/Activity";
import ActivityTaker from "./components/Dashcomponents/Dcomponents/ActivityTaker";
import Attendance from "./components/Dashcomponents/Dcomponents/Attendance";
import AttendanceTaker from "./components/Dashcomponents/Dcomponents/AttendanceTaker";
import QuizTake from "./components/Dashcomponents/Dcomponents/QuizTake";
import Grade from "./components/Dashcomponents/Dcomponents/Grade";
import Admin from "./components/Dashcomponents/Dcomponents/Admin";
import Home from "./components/Home";

function App() {
  return (
    <Routes basename="/mern-Ehilada-frontend- ">
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgotpassword" element={<Forgot />} />
      <Route path="/dashboard" element={<DashHeader />} />
      <Route path="/class" element={<TeacherDash />} />
      <Route path="/stream" element={<Stream />} />
      <Route path="/Quiz" element={<Quiz />} />
      <Route path="Activity/" element={<Activity />} />
      <Route path="ActivityTake/" element={<ActivityTaker />} />
      <Route path="Attendance/" element={<Attendance />} />
      <Route path="AttendanceTake/" element={<AttendanceTaker />} />
      <Route path="QuizTaker/" element={<QuizTake />} />
      <Route path="Grade/" element={<Grade />} />
      <Route path="admin/" element={<Admin />} />
      <Route path="/" element={<Home />} />
      <Route />
    </Routes>
  );
}

export default App;
