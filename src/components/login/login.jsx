import React, { useState, useEffect } from "react";
import './login.css';
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentTagline, setCurrentTagline] = useState(0);
    const navigate = useNavigate();

    // Dynamic taglines that rotate
    const taglines = [
        "Practice like a pro. Land it like a boss.",
        "Your journey to interview excellence starts here!",
        "Master your skills with realistic interview scenarios!",
        "Get personalized feedback and improve your performance!",
        "Join thousands who've cracked their dream jobs!"
    ];

    // Rotate taglines every 3 seconds
    useEffect(() => {
        const taglineInterval = setInterval(() => {
            setCurrentTagline((prev) => (prev + 1) % taglines.length);
        }, 3000);
        return () => clearInterval(taglineInterval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/login", {
                email,
                password
            });
            if (res.data.success && res.data.access_token) {
                toast.success('🎉 Login successful! Redirecting...', {
                    position: "top-center",
                    autoClose: 2000,
                    theme: "colored",
                });

                sessionStorage.setItem("token", res.data.access_token);
                
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                toast.error(`❌ ${res.data.message || 'Invalid credentials'}`, {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored",
                });
            }
        } catch (err) {
            let errorMessage = 'Failed to connect to server';
            if (err.response) {
                errorMessage = err.response.data.message || 'Login failed';
            }
            
            toast.error(`❌ ${errorMessage}`, {
                position: "top-center",
                autoClose: 3000,
                theme: "colored",
            });
            
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-center" theme="colored" />
            <div className="portal-intro">
                <img src={assets.logo} alt="logo" className="lg-logo"/>
                <header>Mock Interview Portal</header>
            </div> 
            <div className="tagline-container">
                <p className="login-tagline animated-tagline">
                    {taglines[currentTagline]}
                </p>
            </div>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Login to Your Account</h2>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e)=> setEmail(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                    <div className="login-links">
                        <Link to="/" className="signup-link">Don't have an account? Sign Up</Link>
                        <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
                    </div>
                </form>
                <div className="login-image-container">
                    <img src={assets.temp} alt="Login Visual" className="login-image" />
                </div>
            </div> 
        </>
    );
};

export default Login;