import React from 'react'
import { useAuth } from '../../context/AuthContext'
import NavbarHome from '../../components/student/Navbar'


const Home = () => {
  const { logoutUser, user } = useAuth()
  return (
    <>
      <NavbarHome />
      <div>
        <h1 className='mt-7 text-red-700'>Welcome to Home Page!</h1>
        <img
          src={user.photoURL || defaultAvatar}
          alt="User"
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"

        />
        <button onClick={logoutUser}>Logout</button>
      </div>
    </>


  )
}

export default Home