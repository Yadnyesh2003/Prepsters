import React from "react";
import heroImage from "../../assets/assets_img.jpg"; // Update path as needed
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"

const Hero = () => {
    const { signInWithGoogle } = useAuth();
    return (
        <section className="relative w-full">
            {/* Background Image for mobile */}
            <div className="md:hidden absolute inset-0 z-0">
                <img
                    src={heroImage}
                    alt="Students studying"
                    className="w-full h-full object-cover brightness-50"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 md:py-24">
                {/* Text Section */}
                <div className="w-full md:w-1/2 text-center md:text-left text-white md:text-black">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                        Engineering Exam <br />
                        <span className="text-[#2eb9ec]">Success Partner</span>
                    </h1>
                    <p className="text-lg mb-8 text-gray-200 md:text-gray-600">
                        Navigate your B.Tech journey with confidence. Access personalized learning analytics,
                        comprehensive study materials, and FAQs — all in one place.
                    </p>

                    <button className="px-6 py-3 bg-[#000000] text-white font-semibold rounded-lg shadow-lg hover:bg-[#727272] transition duration-300"
                        onClick={signInWithGoogle} >
                        Get Started
                    </button>

                </div>

                {/* Image Section for larger screens */}
                <div className="hidden md:flex w-1/2 justify-center">
                    <img
                        src={heroImage}
                        alt="Students studying"
                        className="w-full max-w-lg rounded-xl shadow-2xl"
                    />
                </div>
            </div>
        </section >
    );
};

export default Hero;
