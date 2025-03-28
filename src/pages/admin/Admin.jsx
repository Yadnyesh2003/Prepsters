import React from 'react'
import { Outlet } from 'react-router-dom'

const Admin = () => {
  return (
    <div>
      <h1>Admin Outlet main page.</h1>
      <Outlet/>
    </div>
  )
}

export default Admin