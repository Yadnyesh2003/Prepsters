import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import img from '../../assets/tte_transparent_logo.png'

const Navbar = () => {
  const { signInWithGoogle } = useAuth();
  const { demofunction } = useAuth()
  const [navOpen, setNavOpen] = useState(false);

  // Toggle mobile menu
  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const navItems = [
    { id: 1, text: 'Home', path: '/' },
    { id: 4, text: 'About', path: '/about' },
    { id: 5, text: 'Contact', path: '/contact' },
  ];

  // bg - gradient - to - br from - [#1F2937] to - [#3B4864]

  return (
    <nav className="bg-black text-white z-50 relative shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-white rounded-full p-1 shadow-md">
            <img src={img} alt="TTE Logo" className="h-10 w-10 object-contain" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 ml-auto">
          {navItems.map(item => (
            <li key={item.id}>
              <Link
                to={item.path}
                className="text-lg font-medium hover:text-[#c1c1c1] transition duration-300"
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>

        {/* Login Button (Desktop) */}
        {/* <Link
          to="/login"
          className="hidden md:block px-5 py-2 bg-[#ffffff] text-gray-900 font-semibold rounded-lg hover:bg-[#c1c1c1] transition duration-300"
          onClick={signInWithGoogle} // Call demo function on click
        >
          Login
        </Link> */}

        <button className="hidden md:block ml-10 px-5 py-2 bg-[#ffffff] text-gray-900 font-semibold rounded-lg hover:bg-[#c1c1c1] transition duration-300"
          onClick={signInWithGoogle}>Get Started</button>

        {/* Mobile Menu Toggle Button */}
        <button onClick={toggleNav} className="md:hidden">
          {navOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed md:hidden top-0 left-0 w-[70%] h-full bg-[#1F2937] shadow-lg transform ${navOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300`}
      >

        {/* text-[#00DF9A] */}
        {/* Mobile Logo & Close Button */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-[#00DF9A]">TTE</h1>
          <button onClick={toggleNav}>
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <ul className="flex flex-col space-y-4 p-6">
          {navItems.map(item => (
            <li key={item.id}>
              <Link
                to={item.path}
                className="block text-lg font-medium hover:text-[#c1c1c1] transition duration-300"
                onClick={toggleNav} // Close menu on item click
              >
                {item.text}
              </Link>
            </li>
          ))}
          <li>
            {/* <Link
              to="/login"
              className="block w-full text-center bg-[#ffffff] text-gray-900 py-2 rounded-lg font-semibold hover:bg-[#c1c1c1] transition duration-300"
              onClick={signInWithGoogle}
            >
              Login
            </Link> */}

            <button className="block w-full text-center bg-[#ffffff] text-gray-900 py-2 rounded-lg font-semibold hover:bg-[#c1c1c1] transition duration-300"
              onClick={signInWithGoogle}>Get Started</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
