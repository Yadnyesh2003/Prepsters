import React, { useEffect } from 'react'

const Dashboard = () => {
  useEffect(()=>{
    document.title = "Admin Dashboard"
  },[])
  return (
    <h1>Admin Dashboard - Shows Dashboard Data.</h1>
  )
}

export default Dashboard