import React from 'react'
import { useAuth } from '../../context/AuthContext'
import NavbarHome from '../../components/student/Navbar'


const Home = () => {
  const { logoutUser } = useAuth()
  return (
  <>
    <NavbarHome />
    <div>
      <h1 className='mt-7 text-red-700'>Welcome to Home Page!</h1>
      <button onClick={logoutUser}>Logout</button>
    </div>
  </>
    

  )
}

export default Home