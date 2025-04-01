import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'

import { Link } from 'react-router-dom'

const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <Link to='/'>
      <img src={assets.tte_transparent_logo} alt="logo" className='h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 bg-white rounded-full object-cover border border-black' />
      </Link>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi, Ghost! </p>
        { <img className='max-w-8' src = {assets.profile_img} /> }
      </div>
    </div>
  )
}

export default AdminNavbar