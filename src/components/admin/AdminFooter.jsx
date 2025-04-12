import React from 'react'
import { assets } from '../../assets/assets'
import { useAuth } from '../../context/AuthContext';

const AdminFooter = () => {
  const { isGhost } = useAuth()
  return isGhost ? (
    <div>
      <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border border-t-black'>
        <div className='py-4 flex items-center gap-4'>
          <img
            className='hidden md:block h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 bg-white rounded-full border border-black object-cover'
            src={assets.tte_transparent_logo} alt="logo" />
          <div className='hidden md:block h-7 w-px bg-gray-500/60'></div>
          <p className='py-4 text-center text-xs md:text-sm text-gray-500'>
            Copyright 2025 © The Third Tier Engineers. All Rights Reserved.
          </p>
        </div>
        <div className='flex items-center gap-3 max-md:mt-4'>
          <a href="#">
            <img src={assets.facebook_icon} alt="facebook" />
          </a>
          <a href="#">
            <img src={assets.twitter_icon} alt="twitter" />
          </a>
          <a href="#">
            <img src={assets.instagram_icon} alt="instagram" />
          </a>
        </div>
      </footer>
    </div>
  ) : null
}

export default AdminFooter