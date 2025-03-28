import React from 'react'
import { Outlet } from 'react-router-dom'

const Resourses = () => {
  return (
    <div>
      <h1>Resourses Page - "Notes" & "Courses" can be viewed by Student, and added by Admin.</h1>
      <Outlet/>
    </div>
    
  )
}

export default Resourses