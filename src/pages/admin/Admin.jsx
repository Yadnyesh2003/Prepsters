// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import AdminSidebar from '../../components/admin/AdminSidebar'
// import AdminNavbar from '../../components/admin/AdminNavbar'
// import AdminFooter from '../../components/admin/AdminFooter';

// const Admin = () => {
//   return (
//     <div>
//       <AdminNavbar />
//       <div className="flex">
//         <AdminSidebar />
//         <div className="flex-1">
//           <Outlet />
//         </div>
//       </div>
//       <AdminFooter />
//     </div>
//   );
// };


// export default Admin


import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminNavbar from '../../components/admin/AdminNavbar'
import AdminFooter from '../../components/admin/AdminFooter';

const Admin = () => {
  const [activeSidebarType, setActiveSidebarType] = useState('add'); // Default to 'add' content view

  const handleSidebarToggle = (type) => {
    setActiveSidebarType(type); // Update active sidebar type on button click
  };

  return (
    <div>
      <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      <div className="flex">
        <AdminSidebar activeSidebarType={activeSidebarType} />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default Admin;
