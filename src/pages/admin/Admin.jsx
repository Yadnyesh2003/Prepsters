import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Admin = () => {
  const { logoutUser } = useAuth()
  return (
    <div>
      <h1>Admin Outlet main page.</h1>
      {/* <Outlet /> */}
      <button onClick={logoutUser}>Logout</button>
    </div>
  )
}

export default Admin