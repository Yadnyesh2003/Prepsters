import React, { useState, useEffect, useRef } from 'react';
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineLogout,
  AiOutlineUser
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { assets } from '../../assets/assets';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import CaptchaModal from './CaptchaModal';

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
  const [userAvatar, setUserAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const handleCaptchaVerify = (token) => {
    if (token) {
      setShowCaptcha(false);
      signInWithGoogle(); // Your existing function
    }
  };
  
  const handleGetStarted = () => {
    setShowCaptcha(true);
  };
  

  const refs = {
    examPrep: useRef(null),
    resources: useRef(null),
    profile: useRef(null)
  };

  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (user) {
        try {
          const userRef = doc(db, "Users", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists() && userDoc.data().userAvatar) {
            setUserAvatar(userDoc.data().userAvatar);
          }
        } catch (error) {
          console.error("Error fetching user avatar:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserAvatar();
  }, [user]);

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
        className="absolute left-0 top-full mt-2 w-48 bg-white text-black rounded-lg shadow-xl z-50 border border-gray-100 overflow-hidden"
        ref={ref}
      >
        {items.map(({ text, path }) => (
          <li key={path}>
            <Link
              to={path}
              className="block px-4 py-3 hover:bg-purple-50 text-gray-800 hover:text-purple-700 transition-colors duration-200"
              onClick={closeAllDropdowns}
            >
              {text}
            </Link>
          </li>
        ))}
      </ul>
    )
  );

  const renderDesktopLinks = () => (
    <ul className="hidden md:flex space-x-8 ml-auto items-center">
      {user && (
        <>
          <li className="relative group" ref={refs.examPrep}>
            <button
              onClick={() => toggleDropdown('examPrep')}
              className="flex items-center text-lg font-medium hover:text-purple-300 transition-colors duration-200"
            >
              Exam Prep
              <svg
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${dropdown.examPrep ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {renderDropdown(NAV_ITEMS.examPrep, 'examPrep', refs.examPrep)}
          </li>
          <li className="relative group" ref={refs.resources}>
            <button
              onClick={() => toggleDropdown('resources')}
              className="flex items-center text-lg font-medium hover:text-purple-300 transition-colors duration-200"
            >
              Resources
              <svg
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${dropdown.resources ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {renderDropdown(NAV_ITEMS.resources, 'resources', refs.resources)}
          </li>
        </>
      )}
      {NAV_ITEMS.auth.map(({ text, path }) => (
        <li key={path}>
          <Link
            to={path}
            className="text-lg font-medium hover:text-purple-300 transition-colors duration-200"
            onClick={closeAllDropdowns}
          >
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
          <button
            onClick={() => toggleDropdown('profile')}
            className="flex items-center space-x-2 focus:outline-none"
          >
            {userAvatar ? (
              <img
                src={`https://api.dicebear.com/9.x/${userAvatar.niche}/png/seed=${userAvatar.seed}`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white hover:border-purple-300 transition-all duration-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center border-2 border-white">
                <AiOutlineUser className="text-white text-xl" />
              </div>
            )}
            <svg
              className={`h-4 w-4 text-white transition-transform duration-200 ${dropdown.profile ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdown.profile && (
            <div className="absolute right-0 mt-2 w-85 bg-white text-black rounded-lg shadow-xl z-50 border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  {userAvatar ? (
                    <img
                      src={`https://api.dicebear.com/9.x/${userAvatar.niche}/png/seed=${userAvatar.seed}`}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full border-2 border-purple-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                      <AiOutlineUser className="text-white text-xl" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg truncate">Hello, {user.displayName || 'User'}!</p>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-500">
                  <p>Joined: {formatDate(user?.metadata?.creationTime)}</p>
                  <p>Last Seen: {formatDate(user?.metadata?.lastSignInTime)}</p>
                </div>
              </div>
              <div className="border-b border-gray-100">
                <Link
                  to="/profile"
                  className="block px-4 py-3 hover:bg-purple-50 text-gray-800 hover:text-purple-700 transition-colors duration-200"
                  onClick={closeAllDropdowns}
                >
                  My Profile
                </Link>
              </div>
              <button
                onClick={logoutUser}
                className="w-full px-4 py-3 text-left text-red-600 font-medium hover:bg-red-50 flex items-center gap-2 transition-colors duration-200"
              >
                <AiOutlineLogout /> Logout
              </button>
            </div>
          )}
        </>
      ) : (
        <button
          className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      )}
    </div>
  );

  return (
    // <nav className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white z-50 relative shadow-lg">
    <nav className="bg-black text-white z-50 relative shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" onClick={closeAllDropdowns}>
          <div className="bg-white rounded-full p-1 shadow-md">
            <img
              src={assets.tte_transparent_logo}
              alt="TTE Logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">

          </span>
        </Link>

        {renderDesktopLinks()}
        {renderUserProfile()}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="md:hidden p-2 rounded-full hover:bg-purple-800 transition-colors duration-200"
        >
          {navOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={navOpen}
        setOpen={setNavOpen}
        user={user}
        userAvatar={userAvatar}
        logoutUser={logoutUser}
        signInWithGoogle={signInWithGoogle}
      />
      <CaptchaModal
        show={showCaptcha}
        onVerify={handleCaptchaVerify}
        onClose={() => setShowCaptcha(false)}
      />
    </nav>
  );
};

const MobileSidebar = ({ open, setOpen, user, userAvatar, logoutUser, signInWithGoogle }) => {
  const [expanded, setExpanded] = useState({ examPrep: false, resources: false });

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleLinkClick = () => setTimeout(() => setOpen(false), 300);

  const renderList = (items, key) =>
    expanded[key] && (
      <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-300">
        {items.map(({ text, path }) => (
          <li key={path}>
            <Link
              to={path}
              onClick={handleLinkClick}
              className="block py-2 px-4 rounded hover:bg-purple-800 transition-colors duration-200"
            >
              {text}
            </Link>
          </li>
        ))}
      </ul>
    );

  return (
    <div
      className={`fixed md:hidden top-0 left-0 w-[80%] sm:w-[60%] h-full bg-gradient-to-b from-purple-900 to-indigo-900 shadow-xl transform ${open ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex justify-between items-center p-6 border-b border-purple-800">
        <div className="flex items-center space-x-3">
          {userAvatar ? (
            <img
              src={`https://api.dicebear.com/9.x/${userAvatar.niche}/png/seed=${userAvatar.seed}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-purple-300"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center border-2 border-purple-300">
              <AiOutlineUser className="text-white text-lg" />
            </div>
          )}
          <h1 className="text-lg font-bold text-white">
            {user ? `Hello, ${user.displayName || 'User'}` : 'TTE'}
          </h1>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1 rounded-full hover:bg-purple-800 transition-colors duration-200"
        >
          <AiOutlineClose size={24} className="text-white" />
        </button>
      </div>

      {user && (
        <div className="px-6 py-3 text-sm text-purple-200 border-b border-purple-800">
          <p className="truncate">Email: {user.email}</p>
          <p>Joined: {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
          <p>Last Seen: {new Date(user.metadata.lastSignInTime).toLocaleDateString()}</p>
        </div>
      )}

      <ul className="flex flex-col space-y-1 p-4">
        {user && (
          <>
            <li>
              <button
                onClick={() => toggle('examPrep')}
                className="w-full text-left py-3 px-4 rounded-lg text-white hover:bg-purple-800 transition-colors duration-200 flex justify-between items-center"
              >
                <span>Exam Prep</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${expanded.examPrep ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {renderList(NAV_ITEMS.examPrep, 'examPrep')}
            </li>
            <li>
              <button
                onClick={() => toggle('resources')}
                className="w-full text-left py-3 px-4 rounded-lg text-white hover:bg-purple-800 transition-colors duration-200 flex justify-between items-center"
              >
                <span>Resources</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${expanded.resources ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {renderList(NAV_ITEMS.resources, 'resources')}
            </li>
            <li>
              <Link
                to="/profile"
                className="block py-3 px-4 rounded-lg text-white hover:bg-purple-800 transition-colors duration-200"
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
              className="block py-3 px-4 rounded-lg text-white hover:bg-purple-800 transition-colors duration-200"
              onClick={handleLinkClick}
            >
              {text}
            </Link>
          </li>
        ))}
        <li className="mt-4">
          {user ? (
            <button
              onClick={() => {
                logoutUser();
                setOpen(false);
              }}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <AiOutlineLogout /> Logout
            </button>
          ) : (
            <button
              onClick={() => {
                signInWithGoogle();
                setOpen(false);
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium transition-all duration-200 flex items-center justify-center gap-2"
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