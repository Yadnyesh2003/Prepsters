import React, { useEffect } from 'react'

const StudentsEnrolled = () => {
  useEffect(()=>{
    document.title = "Students Enrolled"
  },[])
  return (
    <h1>StudentsEnrolled - This Page shows list of Students enrolled in various courses to Admin.</h1>
  )
}

export default StudentsEnrolled