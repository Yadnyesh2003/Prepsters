import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';

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

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <Link to='/'>
        <img src={assets.tte_transparent_logo} alt="logo" className='h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 bg-white rounded-full object-cover border border-black' />
      </Link>
      <div className="flex gap-4">
        <button 
          className={`py-2 px-4 rounded-4xl ${activeButton === 'add' ? 'bg-indigo-500 text-white' : 'bg-gray-200  hover:bg-blue-300'}`} 
          onClick={() => {handleButtonClick('add')}}>
          Add Content
        </button>
        <button 
          className={`py-2 px-4 rounded-4xl ${activeButton === 'view' ? 'bg-indigo-500 text-white' : 'bg-gray-200  hover:bg-blue-300'}`} 
          onClick={() => handleButtonClick('view')}>
          View/Modify Content
        </button>
      </div>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi, Ghost! </p>
        <img className='max-w-8' src={assets.profile_img} alt="profile" />
      </div>
    </div>
  );
};

export default AdminNavbar;
