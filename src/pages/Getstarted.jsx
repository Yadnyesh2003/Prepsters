import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
// import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'
import { toast } from "react-toastify";
import Home from "./student/Home";

// import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
    const { registerUser, signInWithGoogle } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            demofunction();
            await registerUser(formData.email, formData.password);
            if (auth?.currentUser?.uid) {
                Navigate("/Home")
            }
            alert("Registration successful!");
        } catch (error) {
            console.error("Signup Error:", error);
        }
    };
    // const signInWithGoogle = async () => {
    //     try {
    //         await signUpWithPopup(auth, googleProvider);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1E2A38] to-[#243A5A] px-4 py-6">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg mt-6">
                {/* Header */}
                <h2 className="text-3xl font-bold text-[#005F73] text-center mb-4">
                    Create an Account
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    Sign up to get started!
                </p>




                {/* Google Signup Button */}
                <div className="flex items-center justify-center">
                    <button className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={signInWithGoogle}
                    >
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1">
                            <g fill="none">
                                <path d="M9.827 24C9.827 22.476 10.08 21.014 10.532 19.644L2.623 13.604C1.082 16.734 0.214 20.26 0.214 24C0.214 27.737 1.081 31.261 2.62 34.388L10.525 28.337C10.077 26.973 9.827 25.517 9.827 24" fill="#FBBC05"></path>
                                <path d="M23.714 10.133C27.025 10.133 30.016 11.307 32.366 13.227L39.202 6.4C35.036 2.773 29.695 0.533 23.714 0.533C14.427 0.533 6.445 5.844 2.623 13.604L10.532 19.644C12.355 14.112 17.549 10.133 23.714 10.133" fill="#EB4335"></path>
                                <path d="M23.714 37.867C17.549 37.867 12.355 33.888 10.532 28.356L2.623 34.395C6.445 42.156 14.427 47.467 23.714 47.467C29.446 47.467 34.918 45.431 39.025 41.618L31.518 35.814C29.4 37.149 26.732 37.867 23.714 37.867" fill="#34A853"></path>
                                <path d="M46.145 24C46.145 22.613 45.932 21.12 45.611 19.733H23.714V28.8H36.318C35.688 31.891 33.972 34.268 31.518 35.814L39.025 41.618C43.339 37.614 46.145 31.649 46.145 24" fill="#4285F4"></path>
                            </g>
                        </svg>
                        <span>Continue with Google</span>
                    </button>
                </div>


                {/* OR Separator */}
                <div className="flex items-center justify-center my-4">
                    <div className="w-1/3 border-t border-gray-300"></div>
                    <span className="mx-2 text-gray-400">or</span>
                    <div className="w-1/3 border-t border-gray-300"></div>
                </div>

                {/* Sign-Up Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label className="block text-gray-700 font-medium">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73] transition duration-300"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73] transition duration-300"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73] transition duration-300"
                            required
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label className="block text-gray-700 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73] transition duration-300"
                            required
                        />
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#005F73] text-white py-2 rounded-lg font-semibold hover:bg-[#003F50] transition duration-300 shadow-md"
                    >
                        Sign Up
                    </button>
                </form>

                {/* OR Separator */}
                {/* <div className="flex items-center justify-center my-4">
                    <div className="w-1/3 border-t border-gray-300"></div>
                    <span className="mx-2 text-gray-400">or</span>
                    <div className="w-1/3 border-t border-gray-300"></div>
                </div> */}

                {/* Google Signup Button */}
                {/* <div className="flex items-center justify-center">
                    <button className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1">
                            <g fill="none">
                                <path d="M9.827 24C9.827 22.476 10.08 21.014 10.532 19.644L2.623 13.604C1.082 16.734 0.214 20.26 0.214 24C0.214 27.737 1.081 31.261 2.62 34.388L10.525 28.337C10.077 26.973 9.827 25.517 9.827 24" fill="#FBBC05"></path>
                                <path d="M23.714 10.133C27.025 10.133 30.016 11.307 32.366 13.227L39.202 6.4C35.036 2.773 29.695 0.533 23.714 0.533C14.427 0.533 6.445 5.844 2.623 13.604L10.532 19.644C12.355 14.112 17.549 10.133 23.714 10.133" fill="#EB4335"></path>
                                <path d="M23.714 37.867C17.549 37.867 12.355 33.888 10.532 28.356L2.623 34.395C6.445 42.156 14.427 47.467 23.714 47.467C29.446 47.467 34.918 45.431 39.025 41.618L31.518 35.814C29.4 37.149 26.732 37.867 23.714 37.867" fill="#34A853"></path>
                                <path d="M46.145 24C46.145 22.613 45.932 21.12 45.611 19.733H23.714V28.8H36.318C35.688 31.891 33.972 34.268 31.518 35.814L39.025 41.618C43.339 37.614 46.145 31.649 46.145 24" fill="#4285F4"></path>
                            </g>
                        </svg>
                        <span>Continue with Google</span>
                    </button>
                </div> */}

                {/* Links Section */}
                <div className="text-center mt-5">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#005F73] font-medium hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
