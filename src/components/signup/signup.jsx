import React, { useState } from "react";
import "./signup.css";
import { assets } from "../../assets/assets";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Signup successful! Redirecting...", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            } else {
                toast.error(data.message || "Signup failed", {
                    position: "top-center",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Error during signup:", error);
            toast.error("An error occurred. Please try again.", {
                position: "top-center",
                autoClose: 5000,
            });
        }
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="portal-intro">
                <img src={assets.logo} alt = "logo" className="logo"/>
                <header>Mock Interview Portal</header>
            </div>
            <div>
                <p className="sign-tagline">Practice like a pro. Land it like a boss.</p>
            </div>
            <div className="signup-container">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h2>Signup</h2>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                        />
                    </div>
                    <button type="submit" className="signup-button">Signup</button>
                    <Link to="/login" className="signup-link">Already have an account? Login</Link>
                </form>
                <div className="signup-image-container">
                    <img src={assets.signup} alt="signup Visual" className="signup-image" />
                </div>
            </div>
        </>
    );
};

export default Signup;