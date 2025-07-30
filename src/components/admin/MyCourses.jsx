import React, { useEffect } from 'react'

const MyCourses = () => {
  useEffect(()=>{
    document.title = "My Courses"
  }, [])
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold'>My Courses</h1>
      <p className='mt-4 text-lg'>This is the My Courses page for admin.</p>
    </div>
  )
}

export default MyCourses