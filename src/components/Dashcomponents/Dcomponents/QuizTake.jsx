import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./QuizTake.css";
import LogoQET from "./image/ehilada1.png";

function QuizTake() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const userDataString = params.get("userData");

  const classId = sessionStorage.getItem("classInfoId");
  const quizTitle = sessionStorage.getItem("quizTitle");
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [quizLink, setQuizLink] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [fetchedQuizTitle, setFetchedQuizTitle] = useState(null);
  const [dueDateTime, setDueDateTime] = useState("");
  const [timeLimit, setTimeLimit] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [timerID, setTimerID] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [specificQuizTitle, setSpecificQuizTitle] = useState("");
  const [quizFile, setQuizFile] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [hasQuizBeenSubmitted, setHasQuizBeenSubmitted] = useState(false);
  const [trueFalseCorrectAnswers, setTrueFalseCorrectAnswers] = useState([]);
  const [essayAnswer, setEssayAnswer] = useState("");
  const [file, setFile] = useState(null);
  const [submittedFile, setSubmittedFile] = useState(null);

  const navigate = useNavigate();

  const renderFileLink = (file) => {
    if (file && file.filePath) {
      const fileName = file.filePath.split("\\").pop(); // Use '\\' for Windows path
      return (
        <a
          href={`https://mern-ehilada-backend.onrender.com/${file.filePath}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {fileName}
        </a>
      );
    }
    return null;
  };

  const renderEssayFileLink = (file) => {
    if (file && file.filePath) {
      return (
        <div>
          <p>Submitted File:</p>
          <a href={file.filePath} target="_blank" rel="noopener noreferrer">
            {file.fileName}
          </a>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchSubmittedQuizzes = async () => {
      try {
        const response = await axios.get(
          `https://mern-ehilada-backend.onrender.com/api/quiz/submissions/${user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
            },
          }
        );

        if (response.status === 200) {
          const quizData = response.data;

          console.log("data", quizData);

          const specificQuiz = quizData.find(
            (quiz) => quiz.quizTitle === quizTitle
          );

          if (specificQuiz && specificQuiz.file) {
            setQuizFile(specificQuiz.file);

            // Make sure specificQuiz.file.filePath exists before using split
            const fileName = specificQuiz.file.filePath
              ? specificQuiz.file.filePath.split("\\").pop()
              : null;

            setSubmittedFile({
              fileName: fileName,
              filePath: specificQuiz.file.filePath
                ? `https://mern-ehilada-backend.onrender.com/${specificQuiz.file.filePath}`
                : null,
            });
          }

          console.log("eto", specificQuiz);

          if (
            specificQuiz &&
            specificQuiz.submissions &&
            specificQuiz.submissions.length > 0
          ) {
            const submissions = specificQuiz.submissions[0];

            if (submissions.questionUserAnswerPairs) {
              const submittedAnswers = {}; // Map to hold submitted answers for each question

              submissions.questionUserAnswerPairs.forEach((pair) => {
                submittedAnswers[pair.question] = pair.answer;
              });

              setSelectedAnswers(submittedAnswers);

              console.log("Submitted Answers:", submittedAnswers);

              const userScore = submissions.userScore;
              setUserScore(userScore);

              console.log("User Score:", userScore);

              setHasQuizBeenSubmitted(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching submitted quiz:", error);
      }
    };

    if (classId) {
      fetchSubmittedQuizzes();
    }
  }, [classId, quizTitle]);

  const startCountdown = () => {
    if (quizStarted) {
      const countdownID = setInterval(() => {
        setTimeRemaining((prevTimeRemaining) => {
          if (prevTimeRemaining > 0) {
            return prevTimeRemaining - 1;
          } else {
            clearInterval(countdownID);

            return 0;
          }
        });
      }, 1000);
      setTimerID(countdownID);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchQuizQuestions(classId);
    }
  }, [classId, quizTitle]);

  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  const fetchQuizQuestions = async (classId) => {
    try {
      const response = await axios.get(
        `https://mern-ehilada-backend.onrender.com/api/quizzes/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      );

      if (response.status === 200) {
        const quizData = response.data;

        const specificQuiz = quizData.find(
          (quiz) => quiz.quizTitle === quizTitle
        );

        if (specificQuiz) {
          setQuizFile(specificQuiz.file);

          if (specificQuiz.link) {
            setQuizLink(specificQuiz.link);
          }

          const shuffledQuestions = shuffleArray(specificQuiz.questions);

          setFetchedQuizTitle(specificQuiz.quizTitle);
          setQuizQuestions(shuffledQuestions);

          const trueFalseCorrectAnswers = specificQuiz.questions
            .filter((question) => question.questionType === "trueFalse")
            .map((question) => question.correctAnswer);

          setTrueFalseCorrectAnswers(trueFalseCorrectAnswers);

          setDueDateTime(specificQuiz.dueDateTime);
          setQuizSubmitted(true);

          const timeLimitInMinutes = specificQuiz.timeLimit;
          const timeLimitInSeconds = timeLimitInMinutes * 60;
          setTimeLimit(timeLimitInSeconds);
          setTimeRemaining(timeLimitInSeconds);

          if (timeLimitInSeconds > 0) {
            startCountdown();
          } else {
            console.log("Quiz Title from URL does not match fetched data.");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
    }
  };

  const handleSubmitClick = async () => {
    clearInterval(timerID);
    const score = calculateScoreBasedOnSubmittedAnswers(selectedAnswers);
    setUserScore(score);
    setQuizSubmitted(true);

    const quizTitleToSubmit = fetchedQuizTitle;

    const questionUserAnswerPairs = quizQuestions.map(
      (question, questionIndex) => ({
        question: question.questionText,
        answer: selectedAnswers[questionIndex],
      })
    );

    const formData = new FormData();
    formData.append("classId", classId);
    formData.append("user", user.userId);
    formData.append("quizTitle", quizTitleToSubmit);
    formData.append(
      "questionUserAnswerPairs",
      JSON.stringify(questionUserAnswerPairs) // Convert to JSON string
    );

    formData.append("userScore", score);
    formData.append("essayAnswer", essayAnswer);
    formData.append("file", file || null);

    try {
      const response = await axios.post(
        "https://mern-ehilada-backend.onrender.com/api/quiz/submit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log("submitted", formData);
        navigate("/stream");
        console.log("Quiz submitted successfully!");
        // Handle success or navigate to a different page if needed.
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      // Handle error
    }
  };

  const handleAnswerChange = (
    selectedAnswer,
    correctAnswer,
    questionIndex,
    questionType
  ) => {
    setSelectedAnswers((prevSelectedAnswers) => {
      const updatedAnswers = [...prevSelectedAnswers];

      if (questionType === "enumeration" || questionType === "multipleChoice") {
        // For enumeration and multiple-choice questions, store the selected option
        updatedAnswers[questionIndex] = selectedAnswer;
      } else if (questionType === "trueFalse") {
        // For true/false questions, store the true/false value
        updatedAnswers[questionIndex] = selectedAnswer === "true" ? 0 : 1;
      } else if (questionType === " essay") {
        setEssayAnswer(selectedAnswer);
      } else {
        // For other question types, store the selected answer
        updatedAnswers[questionIndex] = selectedAnswer;
      }

      return updatedAnswers;
    });
  };

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

  const formatTimeRemaining = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const minutesDisplay =
      minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "";
    const secondsDisplay =
      remainingSeconds > 0
        ? `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`
        : "";

    return `${minutesDisplay} ${secondsDisplay}`;
  };

  const handleTakeClick = () => {
    setQuizStarted(true);
    setShowQuestions(true);
    startCountdown();
  };

  useEffect(() => {
    if (quizStarted) {
      startCountdown();
    }
  }, [quizStarted]);

  const calculateScoreBasedOnSubmittedAnswers = (submittedAnswers) => {
    let score = 0;

    if (!submittedAnswers || submittedAnswers.length === 0) {
      return score;
    }

    quizQuestions.forEach((question, questionIndex) => {
      if (question.questionType === "multipleChoice") {
        const selectedAnswer = submittedAnswers[questionIndex];
        const correctAnswerIndex = question.correctAnswer;

        if (selectedAnswer === question.options[correctAnswerIndex]) {
          score++;
        }
      } else if (question.questionType === "trueFalse") {
        const selectedAnswer = submittedAnswers[questionIndex];
        const correctAnswer = trueFalseCorrectAnswers[questionIndex];

        if (selectedAnswer === correctAnswer) {
          score++;
        }
      }
      // You might consider adding similar logic for other question types if necessary
    });

    return score;
  };

  const questionTextClass = "question-text";

  /*
  const handleClickMe = () => {
    navigate(
      `/Stream?class=${encodeURIComponent(
        JSON.stringify({ _id: classId })
      )}&user=${encodeURIComponent(JSON.stringify(user))}`
    );
  };
  */

  return (
    <div className="QE-container">
      <div className="LogoQET">
        <img src={LogoQET} alt="LogoQET" />
      </div>
      {fetchedQuizTitle ? (
        <div>
          <div className="DTY">
            <h2>{fetchedQuizTitle}</h2>
            <p>Due Date and Time: {convertToPhilippineTime(dueDateTime)}</p>
            <p>Time Limit: {timeLimit / 60} minutes</p>
            <p>
              {" "}
              {timeRemaining !== null
                ? timeRemaining > 0
                  ? `Time Remaining: ${formatTimeRemaining(timeRemaining)}`
                  : "Time is up!"
                : "Loading..."}
            </p>
            {quizSubmitted && (
              <div>
                <p>Your Score: {userScore}</p>
              </div>
            )}

            {quizLink && (
              <p>
                Quiz Link:{" "}
                <a href={quizLink} target="_blank" rel="noopener noreferrer">
                  {quizLink}
                </a>
              </p>
            )}

            <div>
              <p>File: {renderFileLink(quizFile)}</p>
            </div>

            {!hasQuizBeenSubmitted && !showQuestions && (
              <button
                className="Take"
                onClick={handleTakeClick}
                disabled={
                  new Date(dueDateTime) < new Date() && dueDateTime !== null
                }
              >
                Take
              </button>
            )}
          </div>
          {(hasQuizBeenSubmitted || showQuestions) && (
            <ul className="Enu-Multiple-container">
              {quizQuestions.map((question, questionIndex) => (
                <div key={questionIndex}>
                  {/* Change this line to access options */}
                  {question.questionType === "enumeration" ? (
                    <div>
                      <p className={questionTextClass}>{`${
                        questionIndex + 1
                      }. ${question.questionText}`}</p>

                      <input
                        type="text"
                        placeholder="Your answer"
                        onChange={(e) =>
                          handleAnswerChange(
                            e.target.value,
                            question.correctAnswer,
                            questionIndex,
                            question.questionType
                          )
                        }
                        disabled={!quizStarted}
                      />
                      {quizSubmitted && ( // Conditionally display submitted answer if quiz has been submitted
                        <p className="submit">
                          Submitted Answer:{" "}
                          {selectedAnswers[question.questionText] ||
                            "Not submitted"}
                        </p>
                      )}
                    </div>
                  ) : question.questionType === "multipleChoice" ? (
                    <div>
                      <p className={questionTextClass}>{`${
                        questionIndex + 1
                      }. ${question.questionText}`}</p>

                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <label>
                            <input
                              type="radio"
                              name={`question_${questionIndex}`}
                              value={`${questionIndex}_${optionIndex}`}
                              onChange={() =>
                                handleAnswerChange(
                                  option,
                                  question.correctAnswer,
                                  questionIndex,
                                  question.questionType
                                )
                              }
                              checked={
                                selectedAnswers[questionIndex] ===
                                `${questionIndex}_${optionIndex}`
                              }
                              disabled={!quizStarted}
                            />
                            <span
                              className={
                                selectedAnswers[questionIndex] ===
                                `${questionIndex}_${optionIndex}`
                                  ? "selected-answer"
                                  : question.correctAnswer ===
                                    `${questionIndex}_${optionIndex}`
                                  ? "correct-answer"
                                  : ""
                              }
                            >
                              {option}
                            </span>
                          </label>
                        </div>
                      ))}

                      {quizSubmitted && (
                        <p className="submit">
                          Submitted Answer:{" "}
                          {selectedAnswers[question.questionText] ||
                            "Not submitted"}
                        </p>
                      )}
                    </div>
                  ) : question.questionType === "trueFalse" ? (
                    <div>
                      <p className={questionTextClass}>{`${
                        questionIndex + 1
                      }. ${question.questionText}`}</p>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name={`question_${questionIndex}`}
                            value="true"
                            onChange={() =>
                              handleAnswerChange(
                                "true",
                                question.correctAnswer,
                                questionIndex,
                                question.questionType
                              )
                            }
                            checked={selectedAnswers[questionIndex] === 0}
                            disabled={!quizStarted}
                          />
                          <span
                            className={
                              selectedAnswers[questionIndex] === 0
                                ? "selected-answer"
                                : question.correctAnswer === 0
                                ? "correct-answer"
                                : ""
                            }
                          >
                            True
                          </span>
                        </label>
                      </div>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name={`question_${questionIndex}`}
                            value="false"
                            onChange={() =>
                              handleAnswerChange(
                                "false",
                                question.correctAnswer,
                                questionIndex,
                                question.questionType
                              )
                            }
                            checked={selectedAnswers[questionIndex] === 1}
                            disabled={!quizStarted}
                          />
                          <span
                            className={
                              selectedAnswers[questionIndex] === 1
                                ? "selected-answer"
                                : !question.correctAnswer === 1
                                ? "correct-answer"
                                : ""
                            }
                          >
                            False
                          </span>
                        </label>
                      </div>
                      {quizSubmitted && (
                        <p className="submit">
                          Submitted Answer:{" "}
                          {selectedAnswers[question.questionText] !== undefined
                            ? selectedAnswers[question.questionText] == 0
                              ? "True"
                              : "False"
                            : "Not submitted"}
                        </p>
                      )}
                    </div>
                  ) : question.questionType === "essay" ? (
                    <div>
                      <p className={questionTextClass}>{`${
                        questionIndex + 1
                      }. ${question.questionText}`}</p>
                      <p>{`Instructions: ${question.essayInstructions}`}</p>
                      <textarea
                        placeholder="Your answer"
                        value={essayAnswer}
                        onChange={(e) => setEssayAnswer(e.target.value)}
                        disabled={!quizStarted}
                      />
                      <label>
                        Attach File:
                        <input
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                          disabled={!quizStarted}
                        />
                      </label>

                      {renderEssayFileLink(submittedFile)}

                      {quizSubmitted && (
                        <p className="submit">
                          Submitted Answer: {essayAnswer || "Not submitted"}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p>{question.questionText}</p>
                  )}
                </div>
              ))}
              <button
                className="Submit1"
                onClick={() => {
                  setQuizSubmitted(true);
                  handleSubmitClick();
                }}
                disabled={
                  (new Date(dueDateTime) < new Date() &&
                    dueDateTime !== null) ||
                  !quizStarted
                }
              >
                Submit
              </button>
            </ul>
          )}
        </div>
      ) : (
        <h2>Quiz Title Not Found</h2>
      )}
      {/* <button onClick={handleClickMe}>back</button> */}
    </div>
  );
}

export default QuizTake;
