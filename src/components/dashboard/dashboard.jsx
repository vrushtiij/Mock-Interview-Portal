// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Dashboard.css";
// import { assets } from "../../assets/assets";
// const Dashboard = () => {
//   const [userName, setUserName] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = sessionStorage.getItem("token");

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     axios
//       .get("http://localhost:5000/dashboard", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setUserName(res.data.name);
//       })
//       .catch(() => {
//         sessionStorage.removeItem("token");
//         navigate("/login");
//       });
//   }, [navigate]);

//   const handleDomainClick = async(selectedDomain,e) => {
//     e.preventDefault();
//   try {
    
//     const res = await axios.post("http://localhost:5000/get-questions", { selectedDomain });
//     console.log("Server response:", res.data);
//     sessionStorage.setItem("domain", selectedDomain);

//     navigate("/instructions");
//    } catch (err) {
//     let errorMessage = "Failed to connect to server";
//     if (err.response) {
//       errorMessage = err.response.data.message || "Request failed";
//     }
//     console.error(errorMessage);
//   }
// };

//   return (
//     <>
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <img src={assets.logo} alt="logo" className="ds-logo" />
//         <h1 className="dashboard-title">MockMe - Mock Interview Portal</h1>
//         <p className="dashboard-subtitle">
//           Practice mock interviews with us and ace your next interview!
//         </p>
//       </header>

//       <div className="welcome-section">
//         <h2>
//           Welcome,<span className="user-name"> {userName}</span>!
//         </h2>
//         <p className="welcome-message">
//           Select a domain to start your mock interview journey
//         </p>
//       </div>

//       <div className="domains-grid">
//         <div className="domain-card glowing-border" onClick={(e) => handleDomainClick("Data Structures & Algorithm",e)} style={{backgroundColor: "#eff9f3ff"}}>
//           <div className="card-content">
//             <h3>Data Structures & Algorithms</h3>
//             <p>Master problem-solving with our DSA interview preparation</p>
//             <div className="card-icon">🧠</div>
//           </div>
//         </div>

//         <div className="domain-card glowing-border" onClick={(e) => handleDomainClick("Database Management System",e)} style={{backgroundColor: "#fff6f6ff"}}>
//           <div className="card-content">
//             <h3>Database Management</h3>
//             <p>Test your knowledge of databases and query optimization</p>
//             <div className="card-icon">🗃️</div>
//           </div>
//         </div>

//         <div className="domain-card glowing-border" onClick={(e) => handleDomainClick("Software Engineering",e)} style={{backgroundColor: "#eefaeeff"}}>
//           <div className="card-content">
//             <h3>Software Engineering</h3>
//             <p>Practice system design and software development concepts</p>
//             <div className="card-icon">💻</div>
//           </div>
//         </div>

//         <div className="domain-card glowing-border" onClick={(e) => handleDomainClick("HR and Behavioral",e)} style={{backgroundColor: "#fae7f8ff"}}>
//           <div className="card-content">
//             <h3>HR Interview</h3>
//             <p>Prepare for behavioral and situational interview questions</p>
//             <div className="card-icon">🤝</div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [currentTagline, setCurrentTagline] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [stats, setStats] = useState({
    interviews: 0,
    successRate: 0,
    companies: 0,
    activeUsers: 0
  });
  const navigate = useNavigate();

  // Dynamic taglines that rotate
  const taglines = [
    "Practice mock interviews with us and ace your next interview!",
    "Your journey to interview excellence starts here!",
    "Master your skills with realistic interview scenarios!",
    "Get personalized feedback and improve your performance!",
    "Join thousands who've cracked their dream jobs!"
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserName(res.data.name);
      })
      .catch(() => {
        sessionStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  // Animate stats counting up
  useEffect(() => {
    const targetStats = {
      interviews: 1247,
      successRate: 95,
      companies: 67,
      activeUsers: 5432
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        interviews: Math.floor(targetStats.interviews * progress),
        successRate: Math.floor(targetStats.successRate * progress),
        companies: Math.floor(targetStats.companies * progress),
        activeUsers: Math.floor(targetStats.activeUsers * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targetStats);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);


  const handleDomainClick = async (selectedDomain, e) => {
    e.preventDefault();
    setIsPulsing(true);
    
    setTimeout(() => setIsPulsing(false), 600);

    try {
      const res = await axios.post("http://localhost:5000/get-questions", { selectedDomain });
      console.log("Server response:", res.data);
      sessionStorage.setItem("domain", selectedDomain);
      navigate("/instructions");
    } catch (err) {
      let errorMessage = "Failed to connect to server";
      if (err.response) {
        errorMessage = err.response.data.message || "Request failed";
      }
      console.error(errorMessage);
    }
  };

  const handleAccountInfo = () => {
    // Navigate to account info page or show modal
    console.log("Account info clicked");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("domain");
    navigate("/login");
  };

  return (
    <>
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <img src={assets.logo} alt="MockMe Logo" className="header-logo" />
            <h1 className="header-title">MockMe</h1>
          </div>
          <nav className="header-nav">
            <button className="nav-button" onClick={handleAccountInfo}>
              Account Info
            </button>
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-wrapper">
        <div className="dashboard-container">

          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-content">
              <p className="welcome-title">Start your journey of excellence here.</p>
              <h2 className="journey-line">
                Welcome, <span className="user-name">{userName}</span>!
              </h2>
            </div>
          </div>

          {/* Domains Grid */}
          <div className="domains-section">
            <h3 className="section-title">Choose Your Interview Domain</h3>
            
            <div className="domains-grid">
              <div 
                className={`domain-card glowing-border ${isPulsing ? 'pulse-once' : ''}`} 
                onClick={(e) => handleDomainClick("Data Structures & Algorithm", e)} 
              >
                <div className="card-content">
                  <div className="card-header">
                    <h3>Data Structures & Algorithms</h3>
                    <div className="card-icon">🧠</div>
                  </div>
                  <p>Master problem-solving with our comprehensive DSA interview preparation covering arrays, trees, graphs, and dynamic programming.</p>
                  <div className="card-footer">
                    <span className="card-difficulty">Intermediate - Advanced</span>
                    <span className="card-questions">50+ Questions</span>
                  </div>
                  <div className="card-hover-effect"></div>
                </div>
                <div className="card-sparkle">⚡</div>
              </div>

              <div 
                className={`domain-card glowing-border ${isPulsing ? 'pulse-once' : ''}`} 
                onClick={(e) => handleDomainClick("Database Management System", e)} 
              >
                <div className="card-content">
                  <div className="card-header">
                    <h3>Database Management</h3>
                    <div className="card-icon">🗃️</div>
                  </div>
                  <p>Test your knowledge of databases, SQL queries, normalization, indexing, and database design principles.</p>
                  <div className="card-footer">
                    <span className="card-difficulty">Beginner - Intermediate</span>
                    <span className="card-questions">35+ Questions</span>
                  </div>
                  <div className="card-hover-effect"></div>
                </div>
                <div className="card-sparkle">💾</div>
              </div>

              <div 
                className={`domain-card glowing-border ${isPulsing ? 'pulse-once' : ''}`} 
                onClick={(e) => handleDomainClick("Software Engineering", e)} 
              >
                <div className="card-content">
                  <div className="card-header">
                    <h3>Software Engineering</h3>
                    <div className="card-icon">💻</div>
                  </div>
                  <p>Practice system design, OOP concepts, design patterns, and software development methodologies.</p>
                  <div className="card-footer">
                    <span className="card-difficulty">All Levels</span>
                    <span className="card-questions">45+ Questions</span>
                  </div>
                  <div className="card-hover-effect"></div>
                </div>
                <div className="card-sparkle">🔧</div>
              </div>

              <div 
                className={`domain-card glowing-border ${isPulsing ? 'pulse-once' : ''}`} 
                onClick={(e) => handleDomainClick("HR and Behavioral", e)} 
              >
                <div className="card-content">
                  <div className="card-header">
                    <h3>HR Interview</h3>
                    <div className="card-icon">🤝</div>
                  </div>
                  <p>Prepare for behavioral questions, situational responses, and cultural fit assessments.</p>
                  <div className="card-footer">
                    <span className="card-difficulty">All Levels</span>
                    <span className="card-questions">40+ Questions</span>
                  </div>
                  <div className="card-hover-effect"></div>
                </div>
                <div className="card-sparkle">🌟</div>
              </div>
            </div>
          </div>

          {/* Dynamic Stats Bar */}
          <div className="stats-section">
            <h3 className="section-title">Our Impact</h3>
            <p className="section-subtitle">Join our growing community of successful candidates</p>
            
            <div className="stats-bar">
              <div className="stat-item">
                <div className="stat-icon">📊</div>
                <span className="stat-number">{stats.interviews}+</span>
                <span className="stat-label">Interviews Conducted</span>
                <div className="stat-progress">
                  <div 
                    className="stat-progress-fill" 
                    style={{ width: `${(stats.interviews / 1247) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🎯</div>
                <span className="stat-number">{stats.successRate}%</span>
                <span className="stat-label">Success Rate</span>
                <div className="stat-progress">
                  <div 
                    className="stat-progress-fill" 
                    style={{ width: `${stats.successRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🏢</div>
                <span className="stat-number">{stats.companies}+</span>
                <span className="stat-label">Companies Covered</span>
                <div className="stat-progress">
                  <div 
                    className="stat-progress-fill" 
                    style={{ width: `${(stats.companies / 67) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <span className="stat-number">{stats.activeUsers}</span>
                <span className="stat-label">Active Users</span>
                <div className="stat-progress">
                  <div 
                    className="stat-progress-fill" 
                    style={{ width: `${(stats.activeUsers / 5432) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>MockMe</h4>
            <p>Your trusted partner for interview preparation and career growth.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact Us</a>
          </div>
          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <span>📘</span>
              <span>🐦</span>
              <span>💼</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 MockMe. All rights reserved. | Empowering candidates worldwide</p>
        </div>
      </footer>
    </>
  );
};

export default Dashboard;