// import React, { useContext, useState } from 'react'
// import { assets } from '../../assets/assets'
// import { Link } from 'react-router-dom'
// import { AppContext } from '../../context/AppContext';
// import { useAuth } from '../../context/AuthContext';

// const AdminNavbar = ({ onToggleSidebar }) => {
//   const [activeButton, setActiveButton] = useState(null);

//   const { navigate } = useContext(AppContext)

//   const handleButtonClick = (type) => {
//     setActiveButton(type);
//     onToggleSidebar(type); 
//     if (type === 'add') {
//       navigate('/ghost/add-contributors')
//     } else {
//       navigate('/ghost/my-contributors')
//     }
//   };

//   const { isGhost, user, logoutUser } = useAuth()

//   return isGhost ? (
//     <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
//       <Link to='/ghost'>
//         <img src={assets.tte_transparent_logo} alt="logo" className='h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 bg-white rounded-full object-cover border border-black' />
//       </Link>
//       <div className="flex gap-2">
//         <button 
//           className={`py-2 px-4 rounded-4xl flex ${activeButton === 'add' ? 'bg-indigo-500 text-white' : 'bg-gray-200  hover:bg-blue-300'}`} 
//           onClick={() => {handleButtonClick('add')}}>
//             <img src={assets.add_icon} alt='edit' className='w-6 h-6 mr-2' />
//             <span className="hidden md:inline">Add Content</span>
//         </button>
//         <button 
//           className={`py-2 px-4 rounded-4xl flex ${activeButton === 'view' ? 'bg-indigo-500 text-white' : 'bg-gray-200  hover:bg-blue-300'}`} 
//           onClick={() => handleButtonClick('view')}>
//             <img src={assets.edit_data} alt='edit' className='w-6 h-6 mr-2' />
//             <span className="hidden md:inline">View/Modify Content</span>
//         </button>
//       </div>
//       <div className='flex items-center gap-5 text-gray-500 relative'>
//         <p>Hi, {user.displayName}!</p>
//            <img
//             src={user?.photoURL || assets.default_student_avatar}
//             onError={(e) => (e.currentTarget.src = assets.default_student_avatar)}
//             alt="Admin"
//             className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
//             onClick={() => toggleDropdown('profile')}
//           />
//       </div>
//     </div>
//   ) : null
// };

// export default AdminNavbar;

import React, { useContext, useState, useRef, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AiOutlineLogout } from 'react-icons/ai'; // For the logout icon

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const AdminNavbar = ({ onToggleSidebar }) => {
  const [activeButton, setActiveButton] = useState(null);
  const [dropdown, setDropdown] = useState({ profile: false });
  const dropdownRef = useRef(null);

  const { navigate } = useContext(AppContext);
  const { isGhost, user, logoutUser } = useAuth();

  const handleButtonClick = (type) => {
    setActiveButton(type);
    onToggleSidebar(type);
    navigate(type === 'add' ? '/ghost/add-contributors' : '/ghost/my-contributors');
  };

  const toggleDropdown = (menu) => {
    setDropdown((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdown({ profile: false });
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return isGhost ? (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3 relative'>
      <Link to='/ghost'>
        <img
          src={assets.tte_transparent_logo}
          alt="logo"
          className='h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 bg-white rounded-full object-cover border border-black'
        />
      </Link>

      <div className="flex gap-2">
        <button
          className={`py-2 px-4 rounded-4xl flex ${activeButton === 'add' ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-blue-300'}`}
          onClick={() => handleButtonClick('add')}
        >
          <img src={assets.add_icon} alt='edit' className='w-6 h-6 mr-2' />
          <span className="hidden md:inline">Add Content</span>
        </button>
        <button
          className={`py-2 px-4 rounded-4xl flex ${activeButton === 'view' ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-blue-300'}`}
          onClick={() => handleButtonClick('view')}
        >
          <img src={assets.edit_data} alt='edit' className='w-6 h-6 mr-2' />
          <span className="hidden md:inline">View/Modify Content</span>
        </button>
      </div>

      <div className='flex items-center gap-5 text-gray-500 relative' ref={dropdownRef}>
        <p>Hi, {user.displayName}!</p>
        <img
          src={user?.photoURL || assets.default_student_avatar}
          onError={(e) => (e.currentTarget.src = assets.default_student_avatar)}
          alt="Admin"
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
          onClick={() => toggleDropdown('profile')}
        />

        {dropdown.profile && (
          <div className="absolute right-0 top-16 mt-2 w-64 bg-white text-black rounded-lg shadow-xl z-50">
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
      </div>
    </div>
  ) : null;
};

export default AdminNavbar;
