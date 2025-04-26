import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets'
import { useAuth } from '../../context/AuthContext';

const AccessForbidden = () => {
  const { role, logoutUser } = useAuth()
  const navigate = useNavigate()
  const goBack = () => {
    if (role === "admin") {
      navigate('/ghost')
    } else if (role === "student") {
      logoutUser(),
        navigate('/')
    } else {
      navigate('/')
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center p-10 bg-violet-500 rounded-xl shadow-lg w-full max-w-lg mx-4">
        <div className="animate-pulse mb-4">
          <img
            className="w-16 h-16 text-yellow-400 mx-auto"
            src={assets.access_forbidden}
            alt='Access Denied Icon'
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-6 animate__animated animate__fadeIn animate__delay-1s">Access Forbidden</h1>
        <p className="text-xl text-gray-300 mb-8 animate__animated animate__fadeIn animate__delay-2s">
          You do not have permission to view this page.
        </p>
        <button
          onClick={goBack}
          className="bg-yellow-500 text-black text-lg py-2 px-6 rounded-full hover:bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg animate__animated animate__zoomIn"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default AccessForbidden;
