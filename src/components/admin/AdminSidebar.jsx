import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminSidebar = ({ activeSidebarType }) => {
  const { isGhost} = useContext(AppContext);

  const addContentItems = [
    { name: 'Dashboard', path: '/ghost', icon: assets.home_icon },
    { name: 'Student Enrolled', path: '/ghost/students-enrolled', icon: assets.person_tick_icon },
    { name: 'Add Contributors', path: '/ghost/add-contributors', icon: assets.add_icon },
    { name: 'Add Course', path: '/ghost/add-course', icon: assets.add_icon },
    { name: 'Add Syllabus', path: '/ghost/add-syllabus', icon: assets.add_icon },
    { name: 'Add PYQs', path: '/ghost/add-pyqs', icon: assets.add_icon },
    { name: 'Add FAQs', path: '/ghost/add-faqs', icon: assets.add_icon },
    { name: 'Add Notes', path: '/ghost/add-notes', icon: assets.add_icon },
  ];

  const viewModifyItems = [
    { name: 'Dashboard', path: '/ghost', icon: assets.home_icon },
    { name: 'Student Enrolled', path: '/ghost/students-enrolled', icon: assets.person_tick_icon },
    { name: 'My Contributors', path: '/ghost/my-contributors', icon: assets.person_tick_icon },
    { name: 'My Courses', path: '/ghost/my-courses', icon: assets.my_course_icon },
    { name: 'My Syllabus', path: '/ghost/my-syllabus', icon: assets.person_tick_icon },
    { name: 'My PYQs', path: '/ghost/my-pyqs', icon: assets.person_tick_icon },
    { name: 'My FAQs', path: '/ghost/my-faqs', icon: assets.person_tick_icon },
    { name: 'My Notes', path: '/ghost/my-notes', icon: assets.person_tick_icon },
  ];

  const menuItems = activeSidebarType === 'add' ? addContentItems : viewModifyItems;

  

  return isGhost && (
    <div className='bg-white md:w-55 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col'>
      {menuItems.map((item) => (
        <NavLink 
          to={item.path}
          key={item.name}
          end={item.path === '/ghost'}
          className={({ isActive }) => `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-4 gap-3 
            ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/10' : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`}
        >
          <img src={item.icon} alt="icon" className='w-6 h-6' />
          <p className='md:block hidden text-center'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default AdminSidebar;


