import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const PdfViewer = ({ pdfUrl, onClose }) => {
    // const { navigate } = useContext(AppContext);

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            <div className='bg-white w-full sm:w-3/4 md:w-3/4 lg:w-3/4 xl:w-3/4 2xl:w-3/4 h-full rounded-lg overflow-hidden border border-white'>
                <div className="flex justify-between items-center bg-indigo-700 p-2">
                    {/* Logo image */}
                    <img
                        src={assets.tte_transparent_logo}
                        alt="logo"
                        className="h-6 w-6 sm:h-8 sm:w-8 md:h-8 md:w-8 lg:h-10 lg:w-10 bg-white rounded-full object-cover border border-black cursor-pointer"
                        // onClick={() => navigate('/')} // Navigate to the home page on logo click
                    />
                    {/* Close button */}
                    <button
                        className="h-6 w-6 sm:h-8 sm:w-8 md:h-8 md:w-8 lg:h-10 lg:w-10 cursor-pointer"
                        onClick={onClose}
                    >
                        <img src={assets.close_button} alt="Close" />
                    </button>
                </div>
                {/* PDF viewer */}
                <iframe
                    src={pdfUrl}
                    title="PDF Viewer"
                    className="w-full h-[calc(100vh-5rem)]" // Adjust the height based on the viewport
                />
            </div>
        </div>
    );
};

export default PdfViewer;
