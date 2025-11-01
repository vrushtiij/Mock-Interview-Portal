import React from 'react';
import { useState, useEffect } from 'react';
import ProtectedRoute from '../../flask-backend/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/login'
import Signup from './components/signup/signup'
import Dashboard from './components/dashboard/dashboard';
import Instructions from './components/Interview/Instructions';
import Interview from './components/Interview/InterviewPage';
import Review from './components/Interview/feedback';

function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
  }, []);

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
  <div className='app'>
    <Router>
      <Routes>
        <Route path= "/" element = {<Signup />}/> 
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/instructions" element={<ProtectedRoute><Instructions/></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><Interview/></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><Review/></ProtectedRoute>} />
      </Routes>
    </Router>
  </div>
  );
}

export default App;