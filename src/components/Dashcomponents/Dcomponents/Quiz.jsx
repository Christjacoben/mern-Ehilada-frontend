import React, { useEffect, useState } from "react";
import "./Quiz.css";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./image/ehilada1.png";

const QuestionForm = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const classId = sessionStorage.getItem("classInfoId");

  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [isScheduleDateTimeEnabled, setIsScheduleDateTimeEnabled] =
    useState(false);
  const [title, setTitle] = useState("");
  const [dueDateTime, setDueDateTime] = useState("");
  const [isDueDateTimeEnabled, setIsDueDateTimeEnabled] = useState(false);
  const [timeLimit, setTimeLimit] = useState(0);

  const initialQuestion = {
    questionType: "multipleChoice",
    questionText: "",
    essayInstructions: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  };
  const [questions, setQuestions] = useState([initialQuestion]);

  const resetForm = () => {
    setTitle("");
    setQuestions([initialQuestion]);
  };

  const handleScheduleDateTimeChange = (e) => {
    setScheduleDateTime(e.target.value);
  };

  const handleScheduleDateTimeToggle = () => {
    setIsScheduleDateTimeEnabled(!isScheduleDateTimeEnabled);
  };

  const handleEssayInstructionsChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].essayInstructions = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleInputChange = (e, index, field) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (e, questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].questionType = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (e, questionIndex) => {
    const updatedQuestions = [...questions];
    const value = e.target.value;

    if (value === "true") {
      updatedQuestions[questionIndex].correctAnswer = 0;
    } else if (value === "false") {
      updatedQuestions[questionIndex].correctAnswer = 1;
    } else {
      updatedQuestions[questionIndex].correctAnswer = parseInt(value, 10);
    }

    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        quizTitle: "",
        questionType: "multipleChoice",
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a FormData object
      const formData = new FormData();

      // Append form fields to FormData
      formData.append("classId", classId);
      formData.append("title", title);
      formData.append("dueDateTime", isDueDateTimeEnabled ? dueDateTime : null);
      formData.append(
        "scheduleDateTime",
        isScheduleDateTimeEnabled ? scheduleDateTime : null
      );
      formData.append("timeLimit", timeLimit);

      // Append questions as a JSON string to FormData
      formData.append("questions", JSON.stringify(questions));

      // Append file to FormData if it exists
      if (file) {
        formData.append("file", file);
      }
      formData.append("link", link);

      // Append other form fields as needed

      // Get user token
      const token = sessionStorage.getItem("usertoken");

      // Make the fetch request with FormData
      const response = await fetch(
        "https://mern-ehilada-backend.onrender.com/api/questions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Questions saved successfully!");
        resetForm();

        navigate("/stream");
      } else {
        console.error("Failed to save questions:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /*
 const handleStream = () => {
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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDueDateTimeChange = (e) => {
    setDueDateTime(e.target.value);
  };
  const handleTimeLimitChange = (e) => {
    setTimeLimit(parseInt(e.target.value, 10));
  };

  const handleDueDateTimeToggle = () => {
    setIsDueDateTimeEnabled(!isDueDateTimeEnabled);
  };

  return (
    <div>
      <div className="nav">
        <img src={Logo} alt="logo" />
      </div>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} className="question">
            <h3>Question {index + 1}</h3>
            <div className="form-group-qtype">
              <label htmlFor={`questionType${index}`}>Question Type:</label>
              <select
                id={`questionType${index}`}
                name={`questionType${index}`}
                value={question.questionType}
                onChange={(e) => handleQuestionTypeChange(e, index)}
              >
                <option value="multipleChoice">Multiple Choice</option>
                <option value="enumeration">Enumeration</option>
                <option value="trueFalse">True/False</option>
                <option value="essay">Essay</option>
              </select>
            </div>
            {/* Input field for the quiz title */}
            <div className="form-group-QEtitle">
              <label htmlFor={`quizTitle-${index}`}>Quiz/Exam Title:</label>
              <input
                type="text"
                id={`quizTitle-${index}`}
                name={`quizTitle-${index}`}
                value={title}
                onChange={handleTitleChange}
              />
            </div>

            <div className="form-group-time">
              <label htmlFor={`timeLimit-${index}`}>
                Time Limit (in minutes):
              </label>
              <input
                className="time-limit"
                type="number"
                id={`timeLimit-${index}`}
                name={`timeLimit-${index}`}
                value={timeLimit}
                onChange={handleTimeLimitChange}
                min="0"
              />
            </div>

            {/* Input field for due date and time */}
            <div className="form-group-duedate">
              <label htmlFor={`dueDateTime-${index}`}>Due Date and Time:</label>
              <input
                type="datetime-local"
                id={`dueDateTime-${index}`}
                name={`dueDateTime-${index}`}
                value={dueDateTime}
                onChange={handleDueDateTimeChange}
                disabled={!isDueDateTimeEnabled}
              />
            </div>

            {/* Checkbox to enable/disable due date and time */}
            <div className="form-group-enableDue">
              <label htmlFor={`dueDateTimeToggle-${index}`}>
                Enable Due Date and Time:
              </label>
              <input
                type="checkbox"
                id={`dueDateTimeToggle-${index}`}
                checked={isDueDateTimeEnabled}
                onChange={handleDueDateTimeToggle}
              />
            </div>

            <div className="form-group-Qtext">
              <label htmlFor={`questionText${index}`}>Question Text:</label>
              <input
                type="text"
                id={`questionText${index}`}
                name={`questionText${index}`}
                value={question.questionText}
                onChange={(e) => handleInputChange(e, index, "questionText")}
              />
            </div>
            <button
              type="button"
              className="delete-button"
              onClick={() => deleteQuestion(index)}
            >
              X
            </button>
            {question.questionType === "multipleChoice" && (
              <div className="form-group-options">
                <p>Options:</p>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-group">
                    <label htmlFor={`option${index}-${optionIndex}`}>
                      {`Option ${optionIndex + 1}:`}
                    </label>
                    <input
                      type="text"
                      id={`option${index}-${optionIndex}`}
                      name={`option${index}-${optionIndex}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(e, index, optionIndex)
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            {question.questionType === "trueFalse" && (
              <div className="form-group-options">
                <p>True/False:</p>
                <div className="option-group">
                  <label htmlFor={`option${index}-true`}>True</label>
                  <input
                    type="radio"
                    id={`option${index}-true`}
                    name={`correctAnswer${index}`}
                    value="true"
                    onChange={(e) => handleCorrectAnswerChange(e, index)}
                  />
                </div>
                <div className="option-group">
                  <label htmlFor={`option${index}-false`}>False</label>
                  <input
                    type="radio"
                    id={`option${index}-false`}
                    name={`correctAnswer${index}`}
                    value="false"
                    onChange={(e) => handleCorrectAnswerChange(e, index)}
                  />
                </div>
              </div>
            )}

            {question.questionType === "essay" && (
              <div className="form-group-options">
                <p>Instructions:</p>
                <div className="option-group">
                  <label htmlFor={`essay${index}`}>Instructions:</label>
                  <textarea
                    id={`essay${index}`}
                    name={`essay${index}`}
                    value={question.essayInstructions}
                    onChange={(e) => handleEssayInstructionsChange(e, index)}
                  />
                </div>
              </div>
            )}

            {question.questionType === "multipleChoice" && (
              <div className="form-group-Canswer">
                <label htmlFor={`correctAnswer${index}`}>Correct Answer:</label>
                <select
                  id={`correctAnswer${index}`}
                  name={`correctAnswer${index}`}
                  value={question.correctAnswer}
                  onChange={(e) => handleCorrectAnswerChange(e, index)}
                >
                  {question.options.map((_, optionIndex) => (
                    <option key={optionIndex} value={optionIndex}>
                      Option {optionIndex + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}

        <div className="form-group-scheduledatetime">
          <label htmlFor={`scheduleDateTime`}>Scheduled Date and Time:</label>
          <input
            type="datetime-local"
            id={`scheduleDateTime`}
            name={`scheduleDateTime`}
            value={scheduleDateTime}
            onChange={handleScheduleDateTimeChange}
            disabled={!isScheduleDateTimeEnabled}
          />
        </div>

        {/* Checkbox to enable/disable scheduled date and time */}
        <div className="form-group-enableScheduleDateTime">
          <label htmlFor={`scheduleDateTimeToggle`}>
            Enable Scheduled Date and Time:
          </label>
          <input
            type="checkbox"
            id={`scheduleDateTimeToggle`}
            checked={isScheduleDateTimeEnabled}
            onChange={handleScheduleDateTimeToggle}
          />
        </div>

        <div className="form-group-file">
          <label htmlFor={`file`}>Upload File:</label>
          <input
            type="file"
            id={`file`}
            name={`file`}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="form-group-link">
          <label htmlFor={`link`}>Link:</label>
          <input
            type="text"
            id={`link`}
            name={`link`}
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <div className="bnt-form">
          <button className="Add-question" type="button" onClick={addQuestion}>
            Add Question
          </button>
          <button className="Submit" type="submit">
            Submit Questions
          </button>
          <button className="reset" type="button" onClick={resetForm}>
            Reset Form
          </button>
        </div>
      </form>
      {/*  <button onClick={handleStream}>click me</button>*/}
    </div>
  );
};

export default QuestionForm;
