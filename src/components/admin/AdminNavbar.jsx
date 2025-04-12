import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = ({ onToggleSidebar }) => {
  const [activeButton, setActiveButton] = useState(null);

  const { navigate } = useContext(AppContext)

  const handleButtonClick = (type) => {
    setActiveButton(type);
    onToggleSidebar(type);
    if (type === 'add') {
      navigate('/ghost/add-contributors')
    } else {
      navigate('/ghost/my-contributors')
    }
  };

  const { isGhost } = useAuth()

  return isGhost ? (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <Link to='/ghost'>
        <img src={assets.tte_transparent_logo} alt="logo" className='h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 bg-white rounded-full object-cover border border-black' />
      </Link>
      <div className="flex gap-2">
        <button
          className={`py-2 px-4 rounded-4xl flex ${activeButton === 'add' ? 'bg-indigo-500 text-white' : 'bg-gray-200  hover:bg-blue-300'}`}
          onClick={() => { handleButtonClick('add') }}>
          <img src={assets.add_icon} alt='edit' className='w-6 h-6 mr-2' />
          <span className="hidden md:inline">Add Content</span>
        </button>
        <button
          className={`py-2 px-4 rounded-4xl flex ${activeButton === 'view' ? 'bg-indigo-500 text-white' : 'bg-gray-200  hover:bg-blue-300'}`}
          onClick={() => handleButtonClick('view')}>
          <img src={assets.edit_data} alt='edit' className='w-6 h-6 mr-2' />
          <span className="hidden md:inline">View/Modify Content</span>
        </button>
      </div>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi, Ghost! </p>
        <img className='max-w-8' src={assets.profile_img} alt="profile" />
      </div>
    </div>
  ) : null
};

export default AdminNavbar;
