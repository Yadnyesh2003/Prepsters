import React from 'react'
import { Outlet } from 'react-router-dom';
const ExamPrep = () => {
  return (
    <div>
      <h1>ExamPrep - "Syllabus", "PYQs", "FAQs" can be viewed by Student & added by an Admin</h1>
      <Outlet />
    </div>
    
  )
}

export default ExamPrep