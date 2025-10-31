import React from 'react'
import img from '../../assets/tte_transparent_logo.png'

const Footer = () => {

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });


    return (
        <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>

            <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>

                <div className='flex flex-col md:items-start items-center w-full'>
                    <div className="flex items-center space-x-3">
                        <img
                            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 bg-white rounded-full object-cover"
                            src={img}
                            alt="logo"
                        />
                        <span className="font-bold text-lg sm:text-xl md:text-1xl text-white/60">Prepsters</span>
                    </div>
                    <p className='mt-6 text-center md:text-left text-sm text-white/80'>Prepsters made its online presence on 22nd October,2023.
                        Today is {formattedDate}. Look how far we have reached!</p>
                </div>
                <div className='hidden md:flex flex-col items-start w-full'>
                    <h2 className='font-semibold text-white mb-5'>Subscribe to our News Letter</h2>
                    <p className='text-sm text-white/80'>The latest news, articles and resoources sent to your inbox weekly
                    </p>
                    <div className='flex items-center gap-2 pt-4'>
                        <input type="email" placeholder='Enter your Email'
                            className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm' />
                        <button className='bg-blue-600 w-24 h-9 rounded text-white'>Subscribe</button>
                    </div>

                </div>

            </div>
            <p className='py-4 text-center text-xs md:text-sm text-white/60'>Copyright 2025 @Prepsters. All Rights Reserved</p>

        </footer>
    )
}

export default Footer;