// import React, { useState } from "react";
// import { assets } from "../../assets/assets";
// import './Instructions.css';
// import { ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const Instructions = () => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate("/interview");
//   };
// return (
//         <>
//             <ToastContainer position="top-center" theme="colored" />
//             <div className="portal-intro">
//                 <img src={assets.logo} alt="logo" className="pg-logo"/>
//                 <header>Mock Interview Portal</header>
//             </div> 
//             <div>
//                 <p className="tagline">Practice like a pro. Land it like a boss.</p>    
//             </div> 
//             <div>
//               <div className="disclaimer">
//                 <h1>Disclaimer & Instructions: </h1>
//                  <ul>
//                   <li>Each mock interview will have 10 questions.</li>
//                   <li>Read carefully and answer each question just like in a real interview.</li>
//                   <li>Speak clearly and at a steady pace so the microphone can capture your response accurately.</li>
//                   <li>Take a moment to think before answering, but try to keep responses concise.</li>
//                   <li>Once all 10 questions are completed, you’ll receive feedback on your performance.</li>
//                  </ul>
//                  <button onClick={handleClick}>Start Interview</button>
//                 </div>
//               </div>
//                 <div className="login-image-container">
//                     <img src={assets.temp1} alt="Login Visual" className="login-image" />
//                 </div>
//         </>
//     );
// };

// export default Instructions;

// Instructions.jsx
import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import './Instructions.css';
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Instructions = () => {
  const navigate = useNavigate();
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);
  const [checkbox4, setCheckbox4] = useState(false);
  const [checkbox5, setCheckbox5] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const checkedCount = [checkbox1, checkbox2, checkbox3, checkbox4, checkbox5].filter(Boolean).length;
  const allChecked = checkedCount === 5;

  useEffect(() => {
    // Trigger entrance animation
    setIsAnimating(true);
  }, []);

  const handleStartInterview = () => {
    if (allChecked) {
      setIsAnimating(false);
      setTimeout(() => {
        navigate("/interview");
      }, 500);
    }
  };

  const handleCheckboxChange = (setter, currentValue) => {
    if (!isAnimating) {
      setter(!currentValue);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="colored" />
      <div className="instructions-wrapper">

      {/* Main Content */}
      <div className={`instructions-container ${isAnimating ? 'animate-in' : 'animate-out'}`}>
        {showDisclaimer && (
          <div className="checklist-container">
            {/* Left Section - Instructions */}
            <div className="left-section">
              <div className="instructions-header">
                <div className="step-indicator">
                  <span className="step-number">1</span>
                  <span className="step-text">Prepare for your interview</span>
                </div>
                <h1 className="disclaimer-heading">
                  Ready to Ace Your <span className="highlight">Interview?</span>
                </h1>
                <p className="instructions-subtitle">
                  Please review and accept the following guidelines to ensure the best experience
                </p>
              </div>

              <div className="checklist-items">
                <div 
                  className={`checkbox-container ${checkbox1 ? 'checked' : ''}`}
                  onClick={() => setCheckbox1(!checkbox1)}
                >
                  <div className="checkmark">
                    {checkbox1 && <span className="check-icon">✓</span>}
                  </div>
                  <div className="checklist-content">
                    <div className="checklist-title">No switching tabs</div>
                    <div className="checklist-text">
                      Switching tabs during the interview may lead to disqualification.
                    </div>
                  </div>
                  <div className="checklist-icon">🚫</div>
                </div>

                <div 
                  className={`checkbox-container ${checkbox2 ? 'checked' : ''}`}
                  onClick={() => setCheckbox2(!checkbox2)}
                >
                  <div className="checkmark">
                    {checkbox2 && <span className="check-icon">✓</span>}
                  </div>
                  <div className="checklist-content">
                    <div className="checklist-title">Stay in a quiet environment</div>
                    <div className="checklist-text">
                      Choose a noise-free space to maintain clarity and focus.
                    </div>
                  </div>
                  <div className="checklist-icon">🔇</div>
                </div>

                <div 
                  className={`checkbox-container ${checkbox3 ? 'checked' : ''}`}
                  onClick={() => setCheckbox3(!checkbox3)}
                >
                  <div className="checkmark">
                    {checkbox3 && <span className="check-icon">✓</span>}
                  </div>
                  <div className="checklist-content">
                    <div className="checklist-title">Enable microphone access</div>
                    <div className="checklist-text">
                      We'll need permission to use your mic during the interview session.
                    </div>
                  </div>
                  <div className="checklist-icon">🎤</div>
                </div>

                <div 
                  className={`checkbox-container ${checkbox4 ? 'checked' : ''}`}
                  onClick={() => setCheckbox4(!checkbox4)}
                >
                  <div className="checkmark">
                    {checkbox4 && <span className="check-icon">✓</span>}
                  </div>
                  <div className="checklist-content">
                    <div className="checklist-title">Do not refresh the page</div>
                    <div className="checklist-text">
                      Refreshing will end your current interview session immediately.
                    </div>
                  </div>
                  <div className="checklist-icon">🔄</div>
                </div>

                <div 
                  className={`checkbox-container ${checkbox5 ? 'checked' : ''}`}
                  onClick={() => setCheckbox5(!checkbox5)}
                >
                  <div className="checkmark">
                    {checkbox5 && <span className="check-icon">✓</span>}
                  </div>
                  <div className="checklist-content">
                    <div className="checklist-title">Be interview ready</div>
                    <div className="checklist-text">
                      Treat this like a real interview. Be prepared, focused, and professional.
                    </div>
                  </div>
                  <div className="checklist-icon">💼</div>
                </div>
              </div>

              {/* Progress and Action Section */}
              <div className="checklist-actions">
                <div className="progress-section">
                  <div className="progress-text">
                    <span className="progress-count">{checkedCount}/5</span>
                    <span className="progress-label">guidelines accepted</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(checkedCount / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  className={`accept-btn ${allChecked ? "enabled" : "disabled"}`}
                  onClick={handleStartInterview}
                  disabled={!allChecked}
                >
                  {allChecked ? (
                    <>
                      <span className="btn-icon">🚀</span>
                      Start My Mock Interview
                      <span className="btn-arrow">→</span>
                    </>
                  ) : (
                    `Complete ${5 - checkedCount} more to continue`
                  )}
                </button>
              </div>
            </div>

            {/* Right Section - Visual */}
            <div className="right-section">
              <div className="image-container">
                <img src={assets.temp1} alt="Interview Preparation" className="checklist-image" />
                <div className="image-overlay">
                  <div className="overlay-content">
                    <h3>Pro Tip</h3>
                    <p>Take a deep breath and remember - this is practice makes perfect!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default Instructions;