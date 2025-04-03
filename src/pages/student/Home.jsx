import React from 'react'
import { useAuth } from '../../context/AuthContext'

const Home = () => {
  const { logoutUser } = useAuth()
  return (
    <div>
      <h1 className='mt-7 text-red-700'>Welcome to Home Page!</h1>
      <button onClick={logoutUser}>Logout</button>
    </div>
    

  )
}

export default Home