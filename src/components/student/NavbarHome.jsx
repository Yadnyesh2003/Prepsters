import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineClose, AiOutlineMenu, AiOutlineLogout } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import img from '../../assets/tte_transparent_logo.png';
import defaultAvatar from '../../assets/react.svg'; // use a fallback if no photoURL

const NavbarHome = () => {
    const { logoutUser, user } = useAuth();
    const [navOpen, setNavOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleNav = () => setNavOpen(!navOpen);
    const toggleDropdown = () => setDropdownOpen(prev => !prev);

    const navItems = [
        { id: 1, text: 'Exam Prep', path: '/exam-prep' },
        { id: 2, text: 'Resources', path: '/resources' },
        { id: 3, text: 'About Us', path: '/about-us' },
        { id: 4, text: 'Contributors', path: '/contributors' },
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-black text-white z-50 relative shadow-lg">
            <div className="container mx-auto flex justify-between items-center py-3 px-6">
                {/* Logo */}
                <Link to="/Home" className="flex items-center space-x-2">
                    <div className="bg-white rounded-full p-1 shadow-md">
                        <img src={img} alt="TTE Logo" className="h-10 w-10 object-contain" />
                    </div>
                </Link>

                {/* Desktop Nav Items */}
                <ul className="hidden md:flex space-x-6 ml-auto">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <Link to={item.path} className="text-lg font-medium hover:text-[#c1c1c1] transition">
                                {item.text}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* User Avatar & Dropdown */}
                <div className="hidden md:block relative ml-6" ref={dropdownRef}>
                    <img
                        src={user?.photoURL || defaultAvatar}
                        alt="User"
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                        onClick={toggleDropdown}
                    />
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-xl z-50">
                            <div className="p-4 border-b">
                                <p className="font-semibold text-lg">{user?.displayName || "User"}</p>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                                <p className="text-sm text-gray-500 mt-2">Joined: {formatDate(user?.metadata?.creationTime)}</p>
                                <p className="text-sm text-gray-500">Last Seen: {formatDate(user?.metadata?.lastSignInTime)}</p>
                            </div>
                            <button
                                onClick={logoutUser}
                                className="w-full py-2 text-red-600 font-semibold hover:bg-red-100 flex items-center justify-center gap-2"
                            >
                                <AiOutlineLogout /> Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button onClick={toggleNav} className="md:hidden">
                    {navOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed md:hidden top-0 left-0 w-[75%] h-full bg-[#1F2937] shadow-lg transform ${navOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-[#00DF9A]">TTE</h1>
                    <button onClick={toggleNav}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>

                {/* User Info (Small font) */}
                <div className="px-6 py-2 text-xs text-gray-300 border-b border-gray-700">
                    <p>{user?.displayName}</p>
                    <p>{user?.email}</p>
                    <p>Joined: {formatDate(user?.metadata?.creationTime)}</p>
                    <p>Last Seen: {formatDate(user?.metadata?.lastSignInTime)}</p>
                </div>

                {/* Mobile Nav Items */}
                <ul className="flex flex-col space-y-4 p-6">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <Link
                                to={item.path}
                                className="block text-lg font-medium hover:text-[#c1c1c1] transition"
                                onClick={toggleNav}
                            >
                                {item.text}
                            </Link>
                        </li>
                    ))}

                    {/* Logout Button in Mobile */}
                    <li>
                        <button
                            className="flex items-center justify-center gap-2 w-full text-center bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                            onClick={() => {
                                logoutUser();
                                toggleNav();
                            }}
                        >
                            <AiOutlineLogout /> Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavbarHome;
