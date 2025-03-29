import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'

const Admin = () => {
  return (
    <div>
        <div className='flex'>
          <AdminSidebar/>
            <div className='flex-1'>
              {<Outlet/>}
            </div>
        </div>
    </div>
  )
}

export default Admin