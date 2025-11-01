// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Mic, MicOff, Send, Award, XCircle, HelpCircle } from "lucide-react";
// import { useVoiceToText } from "react-speakup";
// import "./InterviewPage.css";
// import { assets } from "../../assets/assets";
// import { useNavigate } from "react-router-dom"; 

// const VoiceRecorder = ({ onTranscriptChange, isListening, setIsListening, resetKey }) => {
//   const { startListening, stopListening, transcript } = useVoiceToText({
//     continuous: true,
//     lang: "en-US",
//     key: resetKey, 
//   });

//   useEffect(() => {
//     onTranscriptChange(transcript);
//   }, [transcript]);

//   const handleStart = () => {
//     startListening();
//     setIsListening(true);
//   };

//   const handleStop = () => {
//     stopListening();
//     setIsListening(false);
//   };

//   return (
//     <div className="mic-controls">
//       <button className={`mic-button ${isListening ? "active" : ""}`} onClick={handleStart} disabled={isListening}>
//         <Mic /> Start Speaking
//       </button>
//       <button className="mic-button" onClick={handleStop} disabled={!isListening}>
//         <MicOff /> Stop Speaking
//       </button>
//     </div>
//   );
// };

// const InterviewPage = () => {
//   const navigate = useNavigate();
//   const [selectedDomain, setSelectedDomain] = useState("");
//   const [items, setItems] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [timeLeft, setTimeLeft] = useState(120);
//   const [isListening, setIsListening] = useState(false);
//   const [isInterviewComplete, setIsInterviewComplete] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [skipCount, setSkipCount] = useState(0);
//   const [visitedQuestions, setVisitedQuestions] = useState(new Set()); 
//   const maxSkips = 3;

//   useEffect(() => {
//     const domain = sessionStorage.getItem("domain");
//     setSelectedDomain(domain);

//     if (domain) {
//       axios
//         .post("http://localhost:5000/get-questions", { selectedDomain: domain })
//         .then((res) => {
//           setItems(res.data.questions || []);
//           setAnswers(new Array(res.data.questions.length).fill(""));
//         })
//         .catch((err) => console.error("Error fetching questions:", err));
//     }
//   }, []);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       handleNext();
//       return;
//     }
//     const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft, currentIndex, items.length]);

//   useEffect(() => {
//     setVisitedQuestions(prev => new Set(prev).add(currentIndex));
//   }, [currentIndex]);

//   useEffect(() => {
//     const visitedSkipCount = Array.from(visitedQuestions).filter(index => 
//       !answers[index] || answers[index].trim() === ""
//     ).length;
//     setSkipCount(visitedSkipCount);
//   }, [answers, visitedQuestions]);

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   const updateAnswer = (value) => {
//     const updatedAnswers = [...answers];
//     updatedAnswers[currentIndex] = value;
//     setAnswers(updatedAnswers);
//   };

//   const handleNext = () => {
//     if (isListening) setIsListening(false);
//     if (currentIndex < items.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//       setTimeLeft(120);
//     } else {
//       handleCompleteInterview();
//     }
//   };

//   const handlePrev = () => {
//     if (isListening) setIsListening(false);
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//       setTimeLeft(120);
//     }
//   };

//   const getInterviewStats = () => {
//     const answeredCount = answers.filter(answer => answer && answer.trim() !== "").length;
//     const totalQuestions = items.length;
//     const skippedCount = totalQuestions - answeredCount;
    
//     return { answeredCount, skippedCount, totalQuestions };
//   };

//   const canSubmitInterview = () => {
//     const { skippedCount } = getInterviewStats();
//     return skippedCount <= maxSkips;
//   };

//   const triggerGrading = async () => {
//   try {
//     const token = sessionStorage.getItem("token");

//     await axios.get("http://localhost:5000/grade-interview", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log("Grading triggered successfully.");
//   } catch (error) {
//     console.error("Error triggering grading:", error);
//   }
// };
//   const handleCompleteInterview = async () => {
//     if (!canSubmitInterview()) {
//       const { skippedCount } = getInterviewStats();
//       alert(`You cannot submit the interview. You have skipped ${skippedCount} questions (maximum allowed: ${maxSkips}). Please go back and answer more questions.`);
//       return;
//     }

//     setIsInterviewComplete(true);
//     setIsSubmitting(true);
//     try {
//       const payload = {
//       domain: selectedDomain,
//       answers: answers.map((answer, idx) => ({
//       question_id: items[idx].id,   
//       answer: answer,
//     })),
//     timestamp: new Date().toISOString(),
//   };
//   const token = sessionStorage.getItem("token");
//   const response = await axios.post(
//   "http://localhost:5000/submit-answers",
//   payload,
//   {
//     headers: {
//       Authorization: `Bearer ${token}`,  
//       "Content-Type": "application/json",
//     },
//   }
// );
//       if (response.data.success) {
//         console.log("Answers submitted successfully!");
//         await triggerGrading();
//         navigate("/feedback");}
//       else console.error("Failed to submit answers:", response.data.error);
//     } catch (err) {
//       console.error("Error submitting answers:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const progressPercentage = ((currentIndex + 1) / items.length) * 100;

//   if (!items.length) return <div>Loading questions...</div>;

// if (isInterviewComplete) {
//   const { answeredCount, skippedCount, totalQuestions } = getInterviewStats();

//   const handleViewFeedback = () => {
//     navigate('/feedback'); 
//   };

//   return (
//     <div className="animated-bg">
//       <aside className="navbar">
//         <header className="ig-portal-header">
//           <img src={assets.logo1} alt="logo" className="ig-logo" />
//           <h2>{selectedDomain} Interview</h2>
//         </header>
//       </aside>

//       <div className="container-full">
//         <div className="completion-screen-full">
//           {/* Success Animation */}
//           <div className="completion-animation">
//             <div className="confetti"></div>
//           </div>
          
//           {/* Main Title */}
//           <div className="completion-header">
//             <h1 className="completion-title">Interview Completed Successfully! 🎉</h1>
//             <p className="completion-subtitle">Great job! Your {selectedDomain} interview has been submitted and is being analyzed.</p>
//           </div>
          
//           {/* Performance Stats - Full Width */}
//           <div className="performance-stats-full">
//             <div className="stats-grid-full">
//               <div className="stat-card-full success">
//                 <div className="stat-icon-wrapper">
//                   <Award size={32} color="#4CAF50" />
//                 </div>
//                 <div className="stat-info">
//                   <span className="stat-number">{answeredCount}</span>
//                   <span className="stat-label">Questions Answered</span>
//                   <span className="stat-percentage">
//                     {Math.round((answeredCount / totalQuestions) * 100)}% completion
//                   </span>
//                 </div>
//               </div>
              
//               <div className="stat-card-full warning">
//                 <div className="stat-icon-wrapper">
//                   <XCircle size={32} color="#FF9800" />
//                 </div>
//                 <div className="stat-info">
//                   <span className="stat-number">{skippedCount}</span>
//                   <span className="stat-label">Questions Skipped</span>
//                   <span className="stat-percentage">
//                     {Math.round((skippedCount / totalQuestions) * 100)}% skipped
//                   </span>
//                 </div>
//               </div>

//               <div className="stat-card-full info">
//                 <div className="stat-icon-wrapper">
//                   <HelpCircle size={32} color="#2196F3" />
//                 </div>
//                 <div className="stat-info">
//                   <span className="stat-number">{totalQuestions}</span>
//                   <span className="stat-label">Total Questions</span>
//                   <span className="stat-percentage">100% coverage</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Button - Centered */}
//           <div className="completion-actions-full">
//             <button 
//               className="primary-button large"
//               onClick={handleViewFeedback}
//             >
//               <Award size={20} />
//               View Detailed Feedback
//             </button>
//             <p className="action-note">
//               Your feedback is being generated. This may take a few moments...
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


//   return (
//     <div className="animated-bg">
//       <aside className="navbar">
//         <header className="ig-portal-header">
//           <img src={assets.logo1} alt="logo" className="ig-logo" />
//           <h2>{selectedDomain}</h2>
//         </header>
//       </aside>

//       <div className="container">
//         <div className="progress-bar">
//           <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
//         </div>

//         <div className="question-header">
//           <p>
//             Question {currentIndex + 1}/{items.length}
//           </p>
//           <p>Time Left: {formatTime(timeLeft)}</p>
//           <p className={`skip-warning ${skipCount >= maxSkips ? 'skip-danger' : ''}`}>
//             Skips remaining: {Math.max(0, maxSkips - skipCount)}
//           </p>
//         </div>

//         <div className="answer-container">
//           <div className="question-text">{items[currentIndex].text}</div>
//           <textarea
//             className="answer-box"
//             placeholder="Type or speak your answer..."
//             value={answers[currentIndex] || ""}
//             onChange={(e) => updateAnswer(e.target.value)}
//           />

//           <VoiceRecorder
//             key={currentIndex}
//             resetKey={currentIndex}
//             isListening={isListening}
//             setIsListening={setIsListening}
//             onTranscriptChange={updateAnswer}
//           />

//           <div className="navigation-buttons">
//             <button onClick={handlePrev} disabled={currentIndex === 0}>Previous</button>
//             {currentIndex < items.length - 1 ? (
//               <button onClick={handleNext}>Next Question</button>
//             ) : (
//               <button 
//                 onClick={handleCompleteInterview} 
//                 className="submit-button" 
//                 disabled={isSubmitting || !canSubmitInterview()}
//               >
//                 <Send size={16} /> {isSubmitting ? "Submitting..." : "Submit Interview"}
//               </button>
//             )}
//           </div>

//           {/* Show warning if too many skips */}
//           {!canSubmitInterview() && (
//             <div className="skip-alert">
//               <XCircle size={16} />
//               <span>Please answer at least {skipCount - maxSkips} more question(s) to submit.</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mic, MicOff, Send, Award, XCircle, HelpCircle } from "lucide-react";
import { useVoiceToText } from "react-speakup";
import "./InterviewPage.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom"; 

const VoiceRecorder = ({ onTranscriptChange, isListening, setIsListening, resetKey }) => {
  const { startListening, stopListening, transcript } = useVoiceToText({
    continuous: true,
    lang: "en-US",
    key: resetKey,
  });

  useEffect(() => {
    onTranscriptChange(transcript);
  }, [transcript]);

  const handleStart = () => {
    startListening();
    setIsListening(true);
  };

  const handleStop = () => {
    stopListening();
    setIsListening(false);
  };

  return (
    <div className="mic-controls">
      <button className={`mic-button ${isListening ? "active" : ""}`} onClick={handleStart} disabled={isListening}>
        <Mic /> Start Speaking
      </button>
      <button className="mic-button" onClick={handleStop} disabled={!isListening}>
        <MicOff /> Stop Speaking
      </button>
    </div>
  );
};

const InterviewPage = () => {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState("");
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isListening, setIsListening] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0])); // Start with first question visited
  const maxSkips = 3;

  useEffect(() => {
    const domain = sessionStorage.getItem("domain");
    setSelectedDomain(domain);

    if (domain) {
      axios
        .post("http://localhost:5000/get-questions", { selectedDomain: domain })
        .then((res) => {
          setItems(res.data.questions || []);
          setAnswers(new Array(res.data.questions.length).fill(""));
        })
        .catch((err) => console.error("Error fetching questions:", err));
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentIndex, items.length]);

  // Track visited questions
  useEffect(() => {
    setVisitedQuestions(prev => new Set(prev).add(currentIndex));
  }, [currentIndex]);

  // Calculate ACTUAL skipped questions (visited but unanswered)
  const getSkippedCount = () => {
    return Array.from(visitedQuestions).filter(index => 
      !answers[index] || answers[index].trim() === ""
    ).length;
  };

  const skippedCount = getSkippedCount();
  const remainingSkips = Math.max(0, maxSkips - skippedCount);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const updateAnswer = (value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (isListening) setIsListening(false);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(120);
    } else {
      handleCompleteInterview();
    }
  };

  const handlePrev = () => {
    if (isListening) setIsListening(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTimeLeft(120);
    }
  };

  const getInterviewStats = () => {
    const answeredCount = answers.filter(a => a && a.trim() !== "").length;
    const totalQuestions = items.length;
    const skippedCount = totalQuestions - answeredCount;
    return { answeredCount, skippedCount, totalQuestions };
  };

  const canSubmitInterview = () => {
    const { skippedCount } = getInterviewStats();
    return skippedCount <= maxSkips;
  };

  const triggerGrading = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.get("http://localhost:5000/grade-interview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Grading triggered successfully.");
    } catch (error) {
      console.error("Error triggering grading:", error);
    }
  };

  const handleCompleteInterview = async () => {
    if (!canSubmitInterview()) {
      const { skippedCount } = getInterviewStats();
      const remainingToAnswer = Math.max(0, skippedCount - maxSkips);
      alert(`You cannot submit the interview. You have skipped ${skippedCount} questions (maximum allowed: ${maxSkips}). Please go back and answer at least ${remainingToAnswer} more question(s).`);
      return;
    }

    setIsInterviewComplete(true);
    setIsSubmitting(true);

    try {
      const payload = {
        domain: selectedDomain,
        answers: answers.map((answer, idx) => ({
          question_id: items[idx].id,
          answer: answer,
        })),
        timestamp: new Date().toISOString(),
      };

      const token = sessionStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/submit-answers", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        console.log("Answers submitted successfully!");
        await triggerGrading();
        navigate("/feedback");
      } else {
        console.error("Failed to submit answers:", response.data.error);
      }
    } catch (err) {
      console.error("Error submitting answers:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentIndex + 1) / items.length) * 100;

  if (!items.length) return <div>Loading questions...</div>;

  if (isInterviewComplete) {
    const { answeredCount, skippedCount, totalQuestions } = getInterviewStats();
    const handleViewFeedback = () => navigate("/feedback");

    return (
      <div className="animated-bg">
        <aside className="navbar">
          <header className="ig-portal-header">
            <img src={assets.logo1} alt="logo" className="ig-logo" />
            <h2>{selectedDomain} Interview</h2>
          </header>
        </aside>

        <div className="container-full">
          <div className="completion-screen-full">
            <div className="completion-animation">
              <div className="confetti"></div>
            </div>

            <div className="completion-header">
              <h1 className="completion-title">Interview Completed Successfully! 🎉</h1>
              <p className="completion-subtitle">
                Great job! Your {selectedDomain} interview has been submitted and is being analyzed.
              </p>
            </div>

            <div className="performance-stats-full">
              <div className="stats-grid-full">
                <div className="stat-card-full success">
                  <div className="stat-icon-wrapper">
                    <Award size={32} color="#4CAF50" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">{answeredCount}</span>
                    <span className="stat-label">Questions Answered</span>
                    <span className="stat-percentage">
                      {Math.round((answeredCount / totalQuestions) * 100)}% completion
                    </span>
                  </div>
                </div>

                <div className="stat-card-full warning">
                  <div className="stat-icon-wrapper">
                    <XCircle size={32} color="#FF9800" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">{skippedCount}</span>
                    <span className="stat-label">Questions Skipped</span>
                    <span className="stat-percentage">
                      {Math.round((skippedCount / totalQuestions) * 100)}% skipped
                    </span>
                  </div>
                </div>

                <div className="stat-card-full info">
                  <div className="stat-icon-wrapper">
                    <HelpCircle size={32} color="#2196F3" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">{totalQuestions}</span>
                    <span className="stat-label">Total Questions</span>
                    <span className="stat-percentage">100% coverage</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="completion-actions-full">
              <button className="primary-button large" onClick={handleViewFeedback}>
                <Award size={20} />
                View Detailed Feedback
              </button>
              <p className="action-note">
                Your feedback is being generated. This may take a few moments...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { answeredCount, skippedCount: totalSkipped, totalQuestions } = getInterviewStats();
  const remainingToAnswer = Math.max(0, totalSkipped - maxSkips);

  return (
    <div className="animated-bg">
      <aside className="navbar">
        <header className="ig-portal-header">
          <img src={assets.logo1} alt="logo" className="ig-logo" />
          <h2>{selectedDomain}</h2>
        </header>
      </aside>

      <div className="container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <div className="question-header">
          <p>
            Question {currentIndex + 1}/{items.length}
          </p>
          <p>Time Left: {formatTime(timeLeft)}</p>
          <p className={`skip-warning ${remainingSkips === 0 ? "skip-danger" : ""}`}>
            Skips remaining: {remainingSkips}
          </p>
        </div>

        <div className="answer-container">
          <div className="question-text">{items[currentIndex].text}</div>
          <textarea
            className="answer-box"
            placeholder="Type or speak your answer..."
            value={answers[currentIndex] || ""}
            onChange={(e) => updateAnswer(e.target.value)}
          />

          <VoiceRecorder
            key={currentIndex}
            resetKey={currentIndex}
            isListening={isListening}
            setIsListening={setIsListening}
            onTranscriptChange={updateAnswer}
          />

          <div className="navigation-buttons">
            <button onClick={handlePrev} disabled={currentIndex === 0}>Previous</button>
            {currentIndex < items.length - 1 ? (
              <button onClick={handleNext}>Next Question</button>
            ) : (
              <button 
                onClick={handleCompleteInterview}
                className="submit-button"
                disabled={isSubmitting || !canSubmitInterview()}
              >
                <Send size={16} /> {isSubmitting ? "Submitting..." : "Submit Interview"}
              </button>
            )}
          </div>

          {!canSubmitInterview() && (
            <div className="skip-alert">
              <XCircle size={16} />
              <span>Please answer at least {remainingToAnswer} more question(s) to submit.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;