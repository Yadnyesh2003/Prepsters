import React, { useState, useEffect, useRef } from 'react';
import {
    AiOutlineClose,
    AiOutlineMenu,
    AiOutlineLogout
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { assets } from '../../assets/assets';

const NAV_ITEMS = {
    auth: [
        { text: 'About Us', path: '/about-us' },
        { text: 'Contributors', path: '/contributors' }
    ],
    examPrep: [
        { text: 'Syllabus', path: '/exam-prep/syllabus' },
        { text: 'PYQs', path: '/exam-prep/pyqs' },
        { text: 'FAQs', path: '/exam-prep/faqs' }
    ],
    resources: [
        { text: 'Notes', path: '/resources/notes' },
        { text: 'Courses', path: '/resources/course-list' }
    ]
};

const NavbarHome = () => {
    const { logoutUser, user, signInWithGoogle } = useAuth();
    const [navOpen, setNavOpen] = useState(false);
    const [dropdown, setDropdown] = useState({ examPrep: false, resources: false, profile: false });

    const refs = {
        examPrep: useRef(null),
        resources: useRef(null),
        profile: useRef(null)
    };

    const toggleDropdown = (name) => {
        setDropdown((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const closeAllDropdowns = () => {
        setDropdown({ examPrep: false, resources: false, profile: false });
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

    const handleOutsideClick = (e) => {
        Object.keys(refs).forEach((key) => {
            if (refs[key].current && !refs[key].current.contains(e.target)) {
                setDropdown((prev) => ({ ...prev, [key]: false }));
            }
        });
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const renderDropdown = (items, toggleName, ref) => (
        dropdown[toggleName] && (
            <ul
                className="absolute left-0 top-full mt-2 w-40 bg-white text-black rounded-md shadow-md z-50"
                ref={ref}
            >
                {items.map(({ text, path }) => (
                    <li key={path}>
                        <Link to={path} className="block px-4 py-2 hover:bg-gray-100">
                            {text}
                        </Link>
                    </li>
                ))}
            </ul>
        )
    );

    const renderDesktopLinks = () => (
        <ul className="hidden md:flex space-x-6 ml-auto items-center">
            {user && (
                <>
                    <li className="relative group" ref={refs.examPrep}>
                        <button
                            onClick={() => toggleDropdown('examPrep')}
                            className="flex items-center text-lg font-medium hover:text-[#c1c1c1]"
                        >
                            Exam Prep
                        </button>
                        {renderDropdown(NAV_ITEMS.examPrep, 'examPrep', refs.examPrep)}
                    </li>
                    <li className="relative group" ref={refs.resources}>
                        <button
                            onClick={() => toggleDropdown('resources')}
                            className="flex items-center text-lg font-medium hover:text-[#c1c1c1]"
                        >
                            Resources
                        </button>
                        {renderDropdown(NAV_ITEMS.resources, 'resources', refs.resources)}
                    </li>
                </>
            )}
            {NAV_ITEMS.auth.map(({ text, path }) => (
                <li key={path}>
                    <Link to={path} className="text-lg font-medium hover:text-[#c1c1c1] transition">
                        {text}
                    </Link>
                </li>
            ))}
        </ul>
    );

    const renderUserProfile = () => (
        <div className="hidden md:block ml-6 relative" ref={refs.profile}>
            {user ? (
                <>
                    <img
                        src={user?.photoURL || assets.default_student_avatar}
                        onError={(e) => (e.currentTarget.src = assets.default_student_avatar)}
                        alt="User"
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                        onClick={() => toggleDropdown('profile')}
                    />
                    {dropdown.profile && (
                        <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-xl z-50">
                            <div className="p-4 border-b">
                                <p className="font-semibold text-lg">Hello, {user.displayName || 'User'}!</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Joined: {formatDate(user?.metadata?.creationTime)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Last Seen: {formatDate(user?.metadata?.lastSignInTime)}
                                </p>
                            </div>
                            <button
                                onClick={logoutUser}
                                className="w-full py-2 text-red-600 font-semibold hover:bg-red-100 flex items-center justify-center gap-2"
                            >
                                <AiOutlineLogout /> Logout
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <button
                    className="px-5 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition"
                    onClick={signInWithGoogle}
                >
                    Get Started
                </button>
            )}
        </div>
    );

    return (
        <nav className="bg-black text-white z-50 relative shadow-lg">
            <div className="container mx-auto flex justify-between items-center py-3 px-6">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="bg-white rounded-full p-1 shadow-md">
                        <img
                            src={assets.tte_transparent_logo}
                            alt="TTE Logo"
                            className="h-10 w-10 object-contain"
                        />
                    </div>
                </Link>

                {renderDesktopLinks()}
                {renderUserProfile()}

                {/* Mobile Menu Toggle */}
                <button onClick={() => setNavOpen(!navOpen)} className="md:hidden">
                    {navOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar */}
            <MobileSidebar
                open={navOpen}
                setOpen={setNavOpen}
                user={user}
                logoutUser={logoutUser}
                signInWithGoogle={signInWithGoogle}
            />
        </nav>
    );
};

const MobileSidebar = ({ open, setOpen, user, logoutUser, signInWithGoogle }) => {
    const [expanded, setExpanded] = useState({ examPrep: false, resources: false });

    const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

    const handleLinkClick = () => setTimeout(() => setOpen(false), 300);

    const renderList = (items, key) =>
        expanded[key] && (
            <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-300">
                {items.map(({ text, path }) => (
                    <li key={path}>
                        <Link to={path} onClick={handleLinkClick}>
                            {text}
                        </Link>
                    </li>
                ))}
            </ul>
        );

    return (
        <div
            className={`fixed md:hidden top-0 left-0 w-[75%] h-full bg-[#1F2937] shadow-lg transform ${open ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300`}
        >
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h1 className="text-lg font-bold text-[#00DF9A]">
                    {user ? `Hello, ${user.displayName}` : 'TTE'}
                </h1>
                <button onClick={() => setOpen(false)}>
                    <AiOutlineClose size={24} />
                </button>
            </div>

            {user && (
                <div className="px-6 py-2 text-xs text-gray-300 border-b border-gray-700">
                    <p>Email: {user.email}</p>
                    <p>Joined: {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
                    <p>Last Seen: {new Date(user.metadata.lastSignInTime).toLocaleDateString()}</p>
                </div>
            )}

            <ul className="flex flex-col space-y-4 p-6">
                {user && (
                    <>
                        <li>
                            <button
                                onClick={() => toggle('examPrep')}
                                className="w-full text-left text-lg font-medium hover:text-[#c1c1c1]"
                            >
                                Exam Prep
                            </button>
                            {renderList(NAV_ITEMS.examPrep, 'examPrep')}
                        </li>
                        <li>
                            <button
                                onClick={() => toggle('resources')}
                                className="w-full text-left text-lg font-medium hover:text-[#c1c1c1]"
                            >
                                Resources
                            </button>
                            {renderList(NAV_ITEMS.resources, 'resources')}
                        </li>
                        <li>
                            <Link
                                to="/profile"
                                className="block text-lg font-medium hover:text-[#c1c1c1]"
                                onClick={handleLinkClick}
                            >
                                My Profile
                            </Link>
                        </li>
                    </>
                )}
                {NAV_ITEMS.auth.map(({ text, path }) => (
                    <li key={path}>
                        <Link
                            to={path}
                            className="block text-lg font-medium hover:text-[#c1c1c1]"
                            onClick={handleLinkClick}
                        >
                            {text}
                        </Link>
                    </li>
                ))}
                <li>
                    {user ? (
                        <button
                            onClick={() => {
                                logoutUser();
                                setOpen(false);
                            }}
                            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center justify-center gap-2"
                        >
                            <AiOutlineLogout /> Logout
                        </button>
                    ) : (
                        <button
                            onClick={signInWithGoogle}
                            className="w-3/4 py-2 text-lime-500 bg-white rounded-full font-bold hover:bg-red-100 mx-auto flex items-center justify-center gap-2"
                        >
                            Get Started
                        </button>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default NavbarHome;